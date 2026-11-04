import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

# Lingkungan test: auth dimatikan, LLM mock. Diset SEBELUM app diimpor.
os.environ.update({"APP_ENV": "test", "AUTH_MODE": "disabled", "LLM_PROVIDER": "mock",
                   "RATE_LIMIT_CHAT_PER_MIN": "1000", "RATE_LIMIT_ASSESS_PER_MIN": "1000",
                   "ALLOWED_ORIGINS": "http://localhost:5173"})

import pytest  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_limiter():
    from app.ratelimit import limiter
    limiter.reset()
    yield
