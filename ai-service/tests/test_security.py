"""Test lapisan produksi: auth Supabase, rate limit, validasi konfigurasi, CORS, ukuran payload, history."""
import httpx
import pytest
from fastapi.testclient import TestClient

from app import security
from app.main import app
from app.ratelimit import SlidingWindowLimiter
from app.settings import Settings

client = TestClient(app)


class _R:
    def __init__(self, code, body=None):
        self.status_code, self._b = code, body or {}

    def json(self):
        return self._b


@pytest.fixture
def supabase_auth(monkeypatch):
    s = Settings(auth_mode="supabase", supabase_url="https://proj.supabase.co", supabase_anon_key="anon")
    app.dependency_overrides[security.get_settings] = lambda: s
    security.token_cache.clear()
    calls = []

    def fake_get(url, headers, timeout):
        calls.append(headers["Authorization"])
        if headers["Authorization"] == "Bearer good-token-1234567890":
            return _R(200, {"id": "user-uuid-1"})
        return _R(401, {"msg": "invalid JWT"})

    monkeypatch.setattr(security._http, "get", fake_get)
    yield calls
    app.dependency_overrides.clear()


def test_missing_token_401(supabase_auth):
    r = client.post("/v1/growth/zscores", json={"child_age_months": 5, "gender": "F", "weight_kg": 7})
    assert r.status_code == 401


def test_invalid_token_401(supabase_auth):
    r = client.post("/v1/growth/zscores", json={"child_age_months": 5, "gender": "F", "weight_kg": 7},
                    headers={"Authorization": "Bearer bad-token-123456789012"})
    assert r.status_code == 401


def test_valid_token_is_cached(supabase_auth):
    h = {"Authorization": "Bearer good-token-1234567890"}
    body = {"child_age_months": 5, "gender": "F", "weight_kg": 7}
    assert client.post("/v1/growth/zscores", json=body, headers=h).status_code == 200
    assert client.post("/v1/growth/zscores", json=body, headers=h).status_code == 200
    assert len(supabase_auth) == 1


def test_supabase_down_503(monkeypatch, supabase_auth):
    def boom(*a, **k):
        raise httpx.ConnectError("down")
    monkeypatch.setattr(security._http, "get", boom)
    r = client.post("/v1/growth/zscores", json={"child_age_months": 5, "gender": "F", "weight_kg": 7},
                    headers={"Authorization": "Bearer another-token-1234567890"})
    assert r.status_code == 503


def test_rate_limiter():
    lim = SlidingWindowLimiter()
    for _ in range(3):
        lim.check("u", 3)
    with pytest.raises(Exception) as e:
        lim.check("u", 3)
    assert e.value.status_code == 429 and "Retry-After" in e.value.headers


def test_production_config_fails_fast():
    with pytest.raises(RuntimeError):
        Settings(app_env="production", auth_mode="disabled").validate()
    with pytest.raises(RuntimeError):
        Settings(app_env="production", supabase_url="u", supabase_anon_key="k", allowed_origins=["*"]).validate()
    Settings(app_env="production", supabase_url="u", supabase_anon_key="k",
             allowed_origins=["https://nutriva.vercel.app"]).validate()


def test_cors_allows_only_configured_origin():
    ok = client.options("/v1/assistant/chat", headers={"Origin": "http://localhost:5173",
                                                       "Access-Control-Request-Method": "POST"})
    bad = client.options("/v1/assistant/chat", headers={"Origin": "https://evil.example",
                                                        "Access-Control-Request-Method": "POST"})
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "access-control-allow-origin" not in bad.headers


def test_payload_too_large():
    r = client.post("/v1/assistant/chat", content=b"x" * 40_000, headers={"Content-Type": "application/json"})
    assert r.status_code == 413


def test_request_id_header():
    r = client.get("/health", headers={"X-Request-ID": "abc12345"})
    assert r.headers["X-Request-ID"] == "abc12345"


def test_chat_with_history_and_profile():
    r = client.post("/v1/assistant/chat", json={
        "question": "kalau 9 bulan?",
        "child_profile": {"age_months": 9, "gender": "F", "allergies": ["telur"]},
        "history": [{"role": "user", "text": "kapan mulai mpasi?"}, {"role": "assistant", "text": "Usia 6 bulan."}]})
    assert r.status_code == 200
    b = r.json()
    assert b["request_id"] and isinstance(b["actions"], list)
    assert all("url" in d for d in b["source_details"])


def test_followup_inherits_topic():
    from assistant import ask
    from assistant.config import LLMConfig
    r = ask("kalau 9 bulan?", cfg=LLMConfig(provider="mock"), history=[{"role": "user", "text": "kapan mulai mpasi?"}])
    assert r["meta"]["route"] == "normal"
    assert r["meta"]["retrieved"][0]["doc_id"] == "mpasi-dasar"
    assert ask("kalau 9 bulan?", cfg=LLMConfig(provider="mock"))["meta"]["route"] == "off_topic"
