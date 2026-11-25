"""Vercel ASGI entrypoint forwarding all requests to FastAPI `app.main:app`."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.main import app  # noqa: E402, F401
