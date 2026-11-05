"""Konfigurasi service dari environment variable (12-factor). Tidak ada secret yang di-hardcode."""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache


def _bool(v: str | None, default: bool) -> bool:
    return default if v is None or v == "" else v.strip().lower() in {"1", "true", "yes", "y", "on"}


def _list(v: str | None) -> list[str]:
    return [x.strip().rstrip("/") for x in (v or "").split(",") if x.strip()]


@dataclass(frozen=True)
class Settings:
    app_env: str = "development"                # development | production
    allowed_origins: list[str] = field(default_factory=list)
    allowed_origin_regex: str = ""              # mis. ^https://nutriva-.*\.vercel\.app$ untuk preview deploy
    auth_mode: str = "supabase"                 # supabase | disabled (khusus lokal/test)
    supabase_url: str = ""
    supabase_anon_key: str = ""
    auth_cache_ttl_s: int = 60
    auth_timeout_s: float = 5.0
    rate_chat_per_min: int = 10
    rate_assess_per_min: int = 60
    max_concurrent_llm: int = 4
    llm_queue_wait_s: float = 10.0
    max_body_bytes: int = 32_768
    enable_docs: bool = True
    expose_debug_meta: bool = False
    log_level: str = "INFO"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    def validate(self) -> None:
        """Gagal saat startup bila konfigurasi produksi tidak aman (fail fast, bukan fail open)."""
        if not self.is_production:
            return
        problems = []
        if self.auth_mode != "supabase":
            problems.append("AUTH_MODE wajib 'supabase' di production")
        if not self.supabase_url or not self.supabase_anon_key:
            problems.append("SUPABASE_URL dan SUPABASE_ANON_KEY wajib diisi")
        if not self.allowed_origins and not self.allowed_origin_regex:
            problems.append("ALLOWED_ORIGINS wajib diisi")
        if "*" in self.allowed_origins:
            problems.append("ALLOWED_ORIGINS tidak boleh '*' di production")
        if self.expose_debug_meta:
            problems.append("EXPOSE_DEBUG_META harus false di production")
        if problems:
            raise RuntimeError("Konfigurasi production tidak valid: " + "; ".join(problems))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    e = os.environ.get
    env = e("APP_ENV", "development").strip().lower()
    return Settings(
        app_env=env,
        allowed_origins=_list(e("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")),
        allowed_origin_regex=e("ALLOWED_ORIGIN_REGEX", "").strip(),
        auth_mode=e("AUTH_MODE", "supabase").strip().lower(),
        supabase_url=e("SUPABASE_URL", "").strip().rstrip("/"),
        supabase_anon_key=e("SUPABASE_ANON_KEY", "").strip(),
        auth_cache_ttl_s=int(e("AUTH_CACHE_TTL_S", "60")),
        auth_timeout_s=float(e("AUTH_TIMEOUT_S", "5")),
        rate_chat_per_min=int(e("RATE_LIMIT_CHAT_PER_MIN", "10")),
        rate_assess_per_min=int(e("RATE_LIMIT_ASSESS_PER_MIN", "60")),
        max_concurrent_llm=int(e("MAX_CONCURRENT_LLM", "4")),
        llm_queue_wait_s=float(e("LLM_QUEUE_WAIT_S", "10")),
        max_body_bytes=int(e("MAX_BODY_BYTES", "32768")),
        enable_docs=_bool(e("ENABLE_DOCS"), env != "production"),
        expose_debug_meta=_bool(e("EXPOSE_DEBUG_META"), False),
        log_level=e("LOG_LEVEL", "INFO").upper(),
    )
