"""Konfigurasi LLM dari environment variable (atau file .env di root project).

Variabel:
  LLM_PROVIDER          gemini | openai_compatible | anthropic | mock      (default: gemini)
  LLM_API_KEY           API key provider (Gemini: key dari Google AI Studio)
  LLM_BASE_URL          base URL. Kosongkan untuk default Gemini
                        (https://generativelanguage.googleapis.com/v1beta); isi untuk openai_compatible.
  LLM_MODEL             nama model persis seperti di dokumentasi provider (mis. gemini-3.5-flash-lite)
  LLM_TEMPERATURE       default 0.2
  LLM_TOP_P             default 0.9
  LLM_MAX_TOKENS        default 600
  LLM_MAX_TOKENS_FIELD  max_tokens | max_completion_tokens   (beberapa model OpenAI terbaru memakai yang kedua)
  LLM_JSON_MODE         true | false  -> kirim response_format={"type":"json_object"} (openai_compatible)
  LLM_SEND_SAMPLING     true | false  -> kirim temperature/top_p (matikan jika model menolaknya)
  LLM_TIMEOUT_S         default 45
  LLM_REASONING_EFFORT  kosong | none | low | medium | high  -> dikirim sebagai reasoning_effort (openai_compatible)
  LLM_EXTRA_BODY        JSON tambahan yang digabung ke body request, mis. {"seed": 42}
  RAG_TOP_K             default 4
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def _load_dotenv(path: Path = ROOT / ".env") -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _bool(v: str | None, default: bool) -> bool:
    return default if v is None else v.strip().lower() in {"1", "true", "yes", "y"}


@dataclass
class LLMConfig:
    provider: str = "gemini"
    api_key: str = ""
    base_url: str = ""
    model: str = "gemini-3.5-flash-lite"
    temperature: float = 0.2
    top_p: float = 0.9
    max_tokens: int = 600
    max_tokens_field: str = "max_tokens"
    json_mode: bool = True
    send_sampling: bool = True
    timeout_s: float = 45.0
    top_k: int = 4
    reasoning_effort: str = ""
    extra_body: dict = field(default_factory=dict)
    extra_headers: dict = field(default_factory=dict)

    @classmethod
    def from_env(cls) -> "LLMConfig":
        _load_dotenv()
        e = os.environ.get
        return cls(
            provider=e("LLM_PROVIDER", "gemini").strip().lower(),
            api_key=e("LLM_API_KEY", ""),
            base_url=e("LLM_BASE_URL", "").rstrip("/"),
            model=e("LLM_MODEL", "gemini-3.5-flash-lite"),
            temperature=float(e("LLM_TEMPERATURE", "0.2")),
            top_p=float(e("LLM_TOP_P", "0.9")),
            max_tokens=int(e("LLM_MAX_TOKENS", "600")),
            max_tokens_field=e("LLM_MAX_TOKENS_FIELD", "max_tokens"),
            json_mode=_bool(e("LLM_JSON_MODE"), True),
            send_sampling=_bool(e("LLM_SEND_SAMPLING"), True),
            timeout_s=float(e("LLM_TIMEOUT_S", "45")),
            top_k=int(e("RAG_TOP_K", "4")),
            reasoning_effort=e("LLM_REASONING_EFFORT", "").strip(),
            extra_body=json.loads(e("LLM_EXTRA_BODY", "") or "{}"),
        )

    def public(self) -> dict:
        """Konfigurasi tanpa API key (aman untuk log / slide)."""
        d = self.__dict__.copy()
        d.pop("api_key", None)
        d.pop("extra_headers", None)
        return d
