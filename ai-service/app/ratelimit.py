"""Rate limit sliding window per user (in-memory, cukup untuk 1 replika HF Space).
Untuk >1 replika, ganti backend ke Redis/Upstash dengan antarmuka yang sama."""
from __future__ import annotations

import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, status


class SlidingWindowLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque] = defaultdict(deque)
        self._lock = threading.Lock()

    def check(self, key: str, limit: int, window_s: float = 60.0) -> None:
        if limit <= 0:
            return
        now = time.monotonic()
        with self._lock:
            q = self._hits[key]
            while q and q[0] <= now - window_s:
                q.popleft()
            if len(q) >= limit:
                retry = max(1, int(q[0] + window_s - now) + 1)
                raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS,
                                    detail=f"Terlalu banyak permintaan. Coba lagi dalam {retry} detik.",
                                    headers={"Retry-After": str(retry)})
            q.append(now)

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


limiter = SlidingWindowLimiter()
