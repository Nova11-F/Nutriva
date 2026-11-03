"""
Nutriva AI Service (FastAPI) untuk web Nutriva.

Endpoint
  GET  /health                  liveness + versi model (tanpa auth)
  GET  /v1/model-info           metadata model risiko (tanpa auth, tanpa secret)
  POST /v1/growth/zscores       z-score WHO 2006 (deterministik)               [auth]
  POST /v1/growth/assess        WHO z-score + profil risiko ML + saran aksi    [auth]
  POST /v1/assistant/chat       AI Nutrition Assistant (RAG + guardrail)       [auth]

Jalankan lokal:  uvicorn app.main:app --reload --port 8000
"""
from __future__ import annotations

import math
import sys
import threading
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

from assistant import ask  # noqa: E402
from assistant.config import LLMConfig, _load_dotenv  # noqa: E402
from assistant.knowledge import load_kb  # noqa: E402
from growth import classify_haz, classify_waz, classify_whz, haz, waz, whz  # noqa: E402
from inference import load_model, predict  # noqa: E402

from .observability import RequestContextMiddleware, log_event, setup_logging  # noqa: E402
from .ratelimit import limiter  # noqa: E402
from .schemas import AssessRequest, ChatRequest, ChatResponse, ZScoreRequest  # noqa: E402
from .security import AuthUser, current_user  # noqa: E402
from .settings import get_settings  # noqa: E402

_load_dotenv()          # .env lokal (jika ada) sebelum membaca Settings; di HF Space pakai Secrets
settings = get_settings()
settings.validate()
setup_logging(settings.log_level)
_llm_slots = threading.BoundedSemaphore(max(1, settings.max_concurrent_llm))


@asynccontextmanager
async def lifespan(_: FastAPI):
    # warm-up: muat model & index knowledge base sekali saat start (bukan saat request pertama)
    _, meta = load_model()
    chunks, _, _ = load_kb()
    cfg = LLMConfig.from_env()
    log_event("startup", env=settings.app_env, model_version=meta.get("version"), kb_chunks=len(chunks),
              llm_provider=cfg.provider, llm_model=cfg.model, auth_mode=settings.auth_mode)
    yield


app = FastAPI(
    title="Nutriva AI Service", version="1.1.0", lifespan=lifespan,
    description="WHO growth z-score, stunting early-awareness model, dan AI Nutrition Assistant. Bukan alat diagnosis.",
    docs_url="/docs" if settings.enable_docs else None, redoc_url=None,
    openapi_url="/openapi.json" if settings.enable_docs else None,
)
app.add_middleware(RequestContextMiddleware, max_body_bytes=settings.max_body_bytes)
app.add_middleware(
    CORSMiddleware, allow_origins=settings.allowed_origins, allow_origin_regex=settings.allowed_origin_regex or None,
    allow_credentials=False, allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"], expose_headers=["X-Request-ID", "Retry-After"],
    max_age=600,
)


def _r(z: float) -> float | None:
    return None if z is None or math.isnan(z) else round(float(z), 2)


@app.get("/health")
def health():
    _, meta = load_model()
    return {"status": "ok", "model_version": meta.get("version")}


@app.get("/v1/model-info")
def model_info():
    _, meta = load_model()
    keep = ("model_name", "version", "created_utc", "algorithm", "labels", "input_features", "excluded_features",
            "balancing", "calibration", "alert_threshold", "alert_rule", "test_metrics", "data_sha256_16")
    return {k: meta[k] for k in keep if k in meta}


@app.post("/v1/growth/zscores")
def growth_zscores(req: ZScoreRequest, request: Request, user: AuthUser = Depends(current_user)):
    limiter.check(f"assess:{user.id}", settings.rate_assess_per_min)
    a, g = req.child_age_months, req.gender
    out: dict = {"standard": "WHO Child Growth Standards 2006 / Permenkes RI No. 2 Tahun 2020"}
    if req.height_cm is not None:
        z = haz(a, g, req.height_cm)
        out["haz"] = {"z": _r(z), "category": classify_haz(z)}
    if req.weight_kg is not None:
        z = waz(a, g, req.weight_kg)
        out["waz"] = {"z": _r(z), "category": classify_waz(z)}
    if req.height_cm is not None and req.weight_kg is not None:
        z = whz(a, g, req.height_cm, req.weight_kg)
        out["whz"] = {"z": _r(z), "category": classify_whz(z)}
    return out


@app.post("/v1/growth/assess")
def growth_assess(req: AssessRequest, request: Request, user: AuthUser = Depends(current_user)):
    limiter.check(f"assess:{user.id}", settings.rate_assess_per_min)
    res = predict(req.model_dump())
    log_event("assess", request_id=request.state.request_id, basis=res["basis"], level=res["level"],
              alert=res["alert"], model_version=res["risk_model"]["model_version"])
    return res


@app.post("/v1/assistant/chat", response_model=ChatResponse, response_model_exclude_none=True)
def assistant_chat(req: ChatRequest, request: Request, user: AuthUser = Depends(current_user)):
    limiter.check(f"chat:{user.id}", settings.rate_chat_per_min)
    if not _llm_slots.acquire(timeout=settings.llm_queue_wait_s):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, detail="Asisten sedang sibuk. Coba lagi sebentar.",
                            headers={"Retry-After": "10"})
    try:
        res = ask(req.question,
                  req.child_profile.model_dump(exclude_none=True) if req.child_profile else None,
                  req.growth_input.model_dump() if req.growth_input else None,
                  history=[h.model_dump() for h in req.history])
    finally:
        _llm_slots.release()
    meta = res.get("meta", {})
    flags = meta.get("guardrail_flags", [])
    log_event("assistant_chat", request_id=request.state.request_id, route=meta.get("route"),
              llm_called=meta.get("llm_called"), latency_ms=meta.get("latency_ms"), flags=flags,
              error=(meta.get("error") or "")[:120] or None, provider=meta.get("provider"),
              model=meta.get("model"), n_history=len(req.history))
    return ChatResponse(
        answer=res["answer"], actions=res.get("actions", []), sources=res.get("sources", []),
        source_details=res.get("source_details", []), refer_to_professional=bool(res.get("refer_to_professional")),
        route=meta.get("route", "normal"), disclaimer=res["disclaimer"], prompt_version=meta.get("prompt_version", ""),
        request_id=request.state.request_id, degraded="fallback_used" in flags,
        debug={k: v for k, v in meta.items() if k != "raw_output"} if settings.expose_debug_meta else None,
    )
