"""Fixture golden harus selalu sinkron dengan engine Python (regenerasi: python scripts/make_who_golden.py)."""
import json
import math
from pathlib import Path

from growth import haz, waz, whz

FIX = Path(__file__).parent / "fixtures/who_golden.json"


def _eq(a, b):
    return (a is None and math.isnan(b)) or (a is not None and abs(a - b) < 1e-9)


def test_golden_fixture_in_sync():
    rows = json.loads(FIX.read_text())
    assert len(rows) > 500
    for r in rows:
        assert _eq(r["haz"], haz(r["age"], r["gender"], r["height"]))
        assert _eq(r["waz"], waz(r["age"], r["gender"], r["weight"]))
        assert _eq(r["whz"], whz(r["age"], r["gender"], r["height"], r["weight"]))
