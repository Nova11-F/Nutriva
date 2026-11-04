"""Logging JSON terstruktur + request id. Kebijakan privasi: TIDAK mencatat isi pertanyaan, nama anak,
token, atau data antropometri; hanya metadata teknis dan ID user yang di-hash."""
from __future__ import annotations

import json
import logging
import sys
import time
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

log = logging.getLogger("nutriva.ai")


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        d = {"ts": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(record.created)) + "Z",
             "level": record.levelname, "msg": record.getMessage()}
        d.update(getattr(record, "extra_fields", {}))
        if record.exc_info:
            d["exc_type"] = record.exc_info[0].__name__ if record.exc_info[0] else None
        return json.dumps(d, ensure_ascii=False)


def setup_logging(level: str = "INFO") -> None:
    h = logging.StreamHandler(sys.stdout)
    h.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers[:] = [h]
    root.setLevel(level)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").disabled = True     # diganti log request di bawah


def log_event(msg: str, **fields) -> None:
    log.info(msg, extra={"extra_fields": fields})


class RequestContextMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_body_bytes: int = 32_768):
        super().__init__(app)
        self.max_body = max_body_bytes

    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("x-request-id", "")
        rid = rid if 8 <= len(rid) <= 64 and rid.replace("-", "").isalnum() else uuid.uuid4().hex
        request.state.request_id = rid
        t0 = time.perf_counter()
        cl = request.headers.get("content-length")
        if cl and cl.isdigit() and int(cl) > self.max_body:
            resp = JSONResponse({"detail": "Payload terlalu besar.", "request_id": rid}, status_code=413)
        else:
            try:
                resp = await call_next(request)
            except Exception:                                   # noqa: BLE001
                log.exception("unhandled_error", extra={"extra_fields": {"request_id": rid,
                                                                          "path": request.url.path}})
                resp = JSONResponse({"detail": "Terjadi kesalahan internal.", "request_id": rid},
                                    status_code=500)
        resp.headers["X-Request-ID"] = rid
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["Referrer-Policy"] = "no-referrer"
        resp.headers["Cache-Control"] = "no-store"
        if request.url.path != "/health":
            log_event("request", request_id=rid, method=request.method, path=request.url.path,
                      status=resp.status_code, latency_ms=round((time.perf_counter() - t0) * 1000, 1),
                      user=getattr(request.state, "user_log_id", None))
        return resp
