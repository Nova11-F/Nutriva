"""Test AI Assistant tanpa API key: provider 'mock' + simulasi HTTP untuk adapter OpenAI-compatible & Anthropic."""
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from assistant import ask  # noqa: E402
from assistant import providers  # noqa: E402
from assistant.config import LLMConfig  # noqa: E402
from assistant.knowledge import retrieve  # noqa: E402
from assistant.safety import postcheck, precheck  # noqa: E402

MOCK = LLMConfig(provider="mock")
EVAL = [json.loads(l) for l in (ROOT / "eval/questions.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]


@pytest.mark.parametrize("item", EVAL, ids=[i["id"] for i in EVAL])
def test_routing_matches_eval_labels(item):
    assert precheck(item["question"]) == item["expected_route"]


def test_retrieval_finds_relevant_doc():
    assert retrieve("kapan mulai mpasi?")[0][0].doc_id == "mpasi-dasar"
    assert retrieve("anakku GTM")[0][0].doc_id == "anak-susah-makan"
    stunting_hits = retrieve("Apa saja tanda-tanda stunting pada anak?")
    assert stunting_hits[0][0].doc_id == "stunting-indonesia"
    assert any("weight faltering" in c.text.lower() for c, _ in stunting_hits)


def test_emergency_and_dosage_never_call_llm():
    for q in ["bayiku kejang", "berapa dosis paracetamol"]:
        r = ask(q, cfg=MOCK)
        assert r["meta"]["llm_called"] is False and r["refer_to_professional"] is True


def test_postcheck_blocks_diagnosis_and_dosage():
    bad = {"answer": "Anak Anda mengalami stunting.", "actions": [], "sources": [], "refer_to_professional": False}
    safe, flags = postcheck(bad, [], "diagnosis")
    assert "forbidden_diagnosis" in flags and "stunting." not in safe["answer"].lower()[:30]
    bad2 = {"answer": "Berikan 120 mg tiap 6 jam.", "actions": [], "sources": [], "refer_to_professional": False}
    _, flags2 = postcheck(bad2, [], "normal")
    assert "forbidden_dosage" in flags2


def test_postcheck_drops_hallucinated_source():
    out, flags = postcheck({"answer": "ok", "actions": [], "sources": ["Sumber karangan"],
                            "refer_to_professional": False}, ["Pemantauan"], "normal")
    assert out["sources"] == [] and "source_not_in_context" in flags


def test_growth_alert_forces_referral():
    g = {"child_age_months": 14, "gender": "F", "height_cm": 71.0, "weight_kg": 7.9}
    r = ask("anakku susah makan", None, g, MOCK)
    assert r["meta"]["growth_alert"] == "attention" and r["refer_to_professional"] is True


class _Resp:
    def __init__(self, payload, code=200):
        self._p, self.status_code, self.text = payload, code, json.dumps(payload)

    def json(self):
        return self._p


GOOD = {"answer": "Coba jadwal makan teratur tanpa gawai.", "actions": ["Makan bersama keluarga"],
        "sources": ["Menghadapi anak pilih-pilih atau susah makan"], "refer_to_professional": False}


def test_openai_compatible_request_format(monkeypatch):
    seen = {}

    def fake_post(url, json, headers, timeout):
        seen.update(url=url, body=json, headers=headers)
        return _Resp({"choices": [{"message": {"content": "```json\n" + __import__("json").dumps(GOOD) + "\n```"}}],
                      "usage": {"prompt_tokens": 900, "completion_tokens": 60}})

    monkeypatch.setattr(providers.httpx, "post", fake_post)
    cfg = LLMConfig(provider="openai_compatible", base_url="https://x/v1", api_key="k", model="m")
    r = ask("anakku susah makan, gimana?", cfg=cfg)
    assert seen["url"] == "https://x/v1/chat/completions"
    assert seen["headers"]["Authorization"] == "Bearer k"
    assert seen["body"]["temperature"] == 0.2 and seen["body"]["max_tokens"] == 600
    assert seen["body"]["response_format"] == {"type": "json_object"}
    assert r["answer"].startswith("Coba jadwal") and r["sources"] == GOOD["sources"]


def test_anthropic_request_format(monkeypatch):
    seen = {}

    def fake_post(url, json, headers, timeout):
        seen.update(url=url, body=json, headers=headers)
        return _Resp({"content": [{"type": "text", "text": __import__("json").dumps(GOOD)}],
                      "usage": {"input_tokens": 900, "output_tokens": 60}})

    monkeypatch.setattr(providers.httpx, "post", fake_post)
    cfg = LLMConfig(provider="anthropic", api_key="k", model="m")
    r = ask("anakku susah makan, gimana?", cfg=cfg)
    assert seen["url"] == "https://api.anthropic.com/v1/messages"
    assert seen["headers"]["x-api-key"] == "k" and "anthropic-version" in seen["headers"]
    assert "system" in seen["body"] and seen["body"]["messages"][0]["role"] == "user"
    assert r["meta"]["llm_called"] and not r["meta"]["guardrail_flags"]


def test_gemini_native_request_format(monkeypatch):
    seen = {}

    def fake_post(url, json, headers, timeout):
        seen.update(url=url, body=json, headers=headers)
        return _Resp({"candidates": [{"content": {"parts": [{"text": __import__("json").dumps(GOOD)}]},
                                      "finishReason": "STOP"}],
                      "usageMetadata": {"promptTokenCount": 900, "candidatesTokenCount": 60}})

    monkeypatch.setattr(providers.httpx, "post", fake_post)
    cfg = LLMConfig(provider="gemini", api_key="k", model="gemini-3.5-flash-lite", max_tokens=2048)
    r = ask("anakku susah makan, gimana?", cfg=cfg)
    assert seen["url"] == ("https://generativelanguage.googleapis.com/v1beta/"
                           "models/gemini-3.5-flash-lite:generateContent")
    assert seen["headers"]["x-goog-api-key"] == "k"
    assert seen["body"]["systemInstruction"]["parts"][0]["text"]
    assert seen["body"]["contents"][0]["role"] == "user"
    assert seen["body"]["generationConfig"]["maxOutputTokens"] == 2048
    assert seen["body"]["generationConfig"]["responseMimeType"] == "application/json"
    assert r["meta"]["llm_called"] and r["sources"] == GOOD["sources"]
    assert r["meta"]["usage"]["input_tokens"] == 900


def test_gemini_blocked_response_falls_back(monkeypatch):
    monkeypatch.setattr(providers.httpx, "post",
                        lambda *a, **k: _Resp({"promptFeedback": {"blockReason": "SAFETY"}}))
    cfg = LLMConfig(provider="gemini", api_key="k", model="gemini-3.5-flash-lite")
    r = ask("kapan mulai mpasi?", cfg=cfg)
    assert "fallback_used" in r["meta"]["guardrail_flags"]


def test_invalid_json_then_fallback(monkeypatch):
    monkeypatch.setattr(providers.httpx, "post",
                        lambda *a, **k: _Resp({"choices": [{"message": {"content": "maaf saya tidak bisa"}}]}))
    cfg = LLMConfig(provider="openai_compatible", base_url="https://x/v1", api_key="k", model="m")
    r = ask("kapan mulai mpasi?", cfg=cfg)
    assert "fallback_used" in r["meta"]["guardrail_flags"]


def test_http_error_is_handled(monkeypatch):
    monkeypatch.setattr(providers.httpx, "post", lambda *a, **k: _Resp({"error": "unauthorized"}, 401))
    cfg = LLMConfig(provider="openai_compatible", base_url="https://x/v1", api_key="bad", model="m")
    r = ask("kapan mulai mpasi?", cfg=cfg)
    assert "HTTP 401" in r["meta"]["error"] and "fallback_used" in r["meta"]["guardrail_flags"]


def test_chat_endpoint():
    from fastapi.testclient import TestClient
    from app.main import app
    c = TestClient(app)
    r = c.post("/v1/assistant/chat", json={"question": "Bayiku kejang dan demam tinggi"})
    assert r.status_code == 200 and r.json()["route"] == "emergency"
    assert r.json()["refer_to_professional"] is True
    assert "debug" not in r.json() and "meta" not in r.json()


def test_gemini_preset_sends_reasoning_effort(monkeypatch):
    seen = {}

    def fake_post(url, json, headers, timeout):
        seen.update(url=url, body=json)
        return _Resp({"choices": [{"message": {"content": __import__("json").dumps(GOOD)}}]})

    monkeypatch.setattr(providers.httpx, "post", fake_post)
    cfg = LLMConfig(provider="openai_compatible", base_url="https://generativelanguage.googleapis.com/v1beta/openai",
                    api_key="k", model="gemini-3.8-flash", max_tokens=2048, reasoning_effort="low")
    ask("kapan mulai mpasi?", cfg=cfg)
    assert seen["url"].endswith("/v1beta/openai/chat/completions")
    assert seen["body"]["reasoning_effort"] == "low" and seen["body"]["max_tokens"] == 2048


# --- regresi dari review manual eval 20261027_180220 (OpenRouter nemotron) ---
def test_named_child_diagnosis_is_caught():
    from assistant.safety import violations
    n01 = {"answer": "Rara usia 14 bulan mengalami stunting (tinggi badan kurang) dan susah makan.", "actions": []}
    assert "forbidden_diagnosis" in violations(n01, "normal")


def test_normal_conclusion_caught_on_diagnosis_route_only():
    from assistant.safety import violations
    d03 = {"answer": "z-score Bima berada dalam rentang normal dan risiko stunting rendah.", "actions": []}
    assert "forbidden_diagnosis" in violations(d03, "diagnosis")
    assert violations(d03, "normal") == []


def test_general_category_explanation_allowed():
    from assistant.safety import violations
    ok = {"answer": "Secara umum, TB/U di bawah -2 SD dikategorikan pendek. Penetapan status oleh tenaga kesehatan.",
          "actions": []}
    assert violations(ok, "diagnosis") == []


def test_violation_triggers_one_corrective_retry(monkeypatch):
    calls = []
    bad = {"answer": "Rara mengalami stunting.", "actions": [], "sources": [], "refer_to_professional": True}
    good = {"answer": "Angka -2,01 berada di sekitar batas -2 SD; penetapan status oleh nakes.", "actions": [],
            "sources": [], "refer_to_professional": True}

    def fake_post(url, json, headers, timeout):
        calls.append(json["messages"][1]["content"])
        payload = bad if len(calls) == 1 else good
        return _Resp({"choices": [{"message": {"content": __import__("json").dumps(payload)}}]})

    monkeypatch.setattr(providers.httpx, "post", fake_post)
    cfg = LLMConfig(provider="openai_compatible", base_url="https://x/v1", api_key="k", model="m")
    r = ask("apakah anak saya stunting?", cfg=cfg)
    assert len(calls) == 2 and "melanggar aturan" in calls[1]
    assert r["answer"].startswith("Angka -2,01") and "mengalami stunting" not in r["answer"]


def test_sources_deduped_and_markdown_stripped():
    out, _ = postcheck({"answer": "Mulai **6 bulan**.", "actions": ["**Tetap** ASI"], "sources": ["A", "A"],
                        "refer_to_professional": False}, ["A"], "normal")
    assert out["sources"] == ["A"] and out["answer"] == "Mulai 6 bulan." and out["actions"] == ["Tetap ASI"]
