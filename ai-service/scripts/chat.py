"""Chat interaktif di terminal untuk mencoba AI Assistant.

    python scripts/chat.py            # tanpa konteks anak
    python scripts/chat.py --siti     # pakai contoh profil + data pertumbuhan persona Siti (anak 14 bulan)
    python scripts/chat.py --debug    # tampilkan meta (rute, sumber, flags, token, latensi)
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from assistant import ask  # noqa: E402
from assistant.config import LLMConfig  # noqa: E402

SITI_PROFILE = {"name": "Rara", "age_months": 14, "gender": "F"}
SITI_GROWTH = {"child_age_months": 14, "gender": "F", "height_cm": 71.0, "weight_kg": 7.9, "birth_weight_kg": 2.4,
               "anc_visits": 3, "complementary_feeding_start_months": 5, "immunization": "Incomplete",
               "drinking_water_source": "Unprotected", "deworming": "No"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--siti", action="store_true")
    ap.add_argument("--debug", action="store_true")
    a = ap.parse_args()
    cfg = LLMConfig.from_env()
    print(f"Provider: {cfg.provider} · model: {cfg.model}  (ketik 'keluar' untuk berhenti)\n")
    while True:
        try:
            q = input("Kamu: ").strip()
        except (EOFError, KeyboardInterrupt):
            break
        if q.lower() in {"keluar", "exit", "quit"}:
            break
        if not q:
            continue
        r = ask(q, SITI_PROFILE if a.siti else None, SITI_GROWTH if a.siti else None, cfg)
        print(f"\nNutriva: {r['answer']}")
        for act in r.get("actions", []):
            print(f"  • {act}")
        if r.get("sources"):
            print("  Sumber:", "; ".join(r["sources"]))
        if r["refer_to_professional"]:
            print("  ⚕ Disarankan konsultasi ke tenaga kesehatan / Posyandu.")
        if a.debug:
            m = {k: v for k, v in r["meta"].items() if k != "raw_output"}
            print(json.dumps(m, indent=1, ensure_ascii=False))
        print()


if __name__ == "__main__":
    main()
