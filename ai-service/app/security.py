"""Autentikasi: verifikasi access token Supabase milik user yang login di web Nutriva.

Token diverifikasi ke endpoint resmi Supabase Auth `GET {SUPABASE_URL}/auth/v1/user`, sehingga
service ini tidak perlu menyimpan JWT secret atau service-role key. Hasil verifikasi di-cache
singkat (default 60 detik) berdasarkan hash token agar tidak memanggil Supabase setiap request.
"""
from __future__ import annotations

import hashlib
import threading
import time
from dataclasses import dataclass

import httpx
from fastapi import Depends, HTTPException, Request, status

from .settings import Settings, get_settings


@dataclass(frozen=True)
class AuthUser:
    id: str

    @property
    def log_id(self) -> str:
        """ID pseudonim untuk log (bukan UUID asli)."""
        return hashlib.sha256(self.id.encode()).hexdigest()[:12]


class _TTLCache:
    def __init__(self, max_items: int = 10_000):
        self._d: dict[str, tuple[float, str]] = {}
        self._lock = threading.Lock()
        self._max = max_items

    def get(self, k: str) -> str | None:
        with self._lock:
            v = self._d.get(k)
            if not v:
                return None
            if v[0] < time.monotonic():
                self._d.pop(k, None)
                return None
            return v[1]

    def set(self, k: str, user_id: str, ttl: float) -> None:
        with self._lock:
            if len(self._d) >= self._max:          # buang entri kedaluwarsa, lalu yang tertua
                now = time.monotonic()
                for key in [k2 for k2, (exp, _) in self._d.items() if exp < now]:
                    self._d.pop(key, None)
                while len(self._d) >= self._max:
                    self._d.pop(next(iter(self._d)))
            self._d[k] = (time.monotonic() + ttl, user_id)

    def clear(self) -> None:
        with self._lock:
            self._d.clear()


token_cache = _TTLCache()
_http = httpx.Client(timeout=5.0)


def _unauthorized(msg: str = "Sesi tidak valid. Silakan login ulang.") -> HTTPException:
    return HTTPException(status.HTTP_401_UNAUTHORIZED, detail=msg, headers={"WWW-Authenticate": "Bearer"})


def verify_supabase_token(token: str, s: Settings) -> str:
    key = hashlib.sha256(token.encode()).hexdigest()
    cached = token_cache.get(key)
    if cached:
        return cached
    try:
        r = _http.get(f"{s.supabase_url}/auth/v1/user", timeout=s.auth_timeout_s,
                      headers={"apikey": s.supabase_anon_key, "Authorization": f"Bearer {token}"})
    except httpx.HTTPError as e:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Layanan autentikasi tidak dapat dihubungi.") from e
    if r.status_code in (401, 403):
        raise _unauthorized()
    if r.status_code != 200:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, detail="Verifikasi sesi gagal.")
    user_id = (r.json() or {}).get("id")
    if not user_id:
        raise _unauthorized()
    token_cache.set(key, user_id, s.auth_cache_ttl_s)
    return user_id


def current_user(request: Request, s: Settings = Depends(get_settings)) -> AuthUser:
    if s.auth_mode == "disabled":
        user = AuthUser(id="local-dev")
    else:
        h = request.headers.get("authorization", "")
        if not h.lower().startswith("bearer ") or len(h) < 20:
            raise _unauthorized("Header Authorization: Bearer <token> wajib ada.")
        user = AuthUser(id=verify_supabase_token(h.split(" ", 1)[1].strip(), s))
    request.state.user_log_id = user.log_id
    return user
