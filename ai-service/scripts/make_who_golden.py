"""Buat fixture golden z-score WHO dari engine Python, dipakai `npm run test:who` di frontend
untuk memastikan port JavaScript (src/lib/whoGrowth.js) identik dengan engine Python."""
import json
import math
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from growth import haz, waz, whz  # noqa: E402

OUT = ROOT / "tests/fixtures/who_golden.json"


def cases(seed: int = 7, n: int = 600):
    rnd = random.Random(seed)
    edge = [(0, "M", 49.8842, 3.3464), (24, "M", 87.1161, 12.1515), (23, "F", 80.0, 9.0), (60, "F", 110.0, 18.0),
            (6, "F", 55.0, 4.0), (36, "M", 120.0, 30.0), (12, "M", 60.0, 5.0), (30, "F", 64.0, 7.0)]
    out = [dict(age=a, gender=g, height=h, weight=w) for a, g, h, w in edge]
    for _ in range(n):
        a = rnd.randint(0, 60)
        g = rnd.choice(["M", "F"])
        base_h = 50 + 25 * (min(a, 12) / 12) + 0.75 * max(0, a - 12)
        h = round(base_h + rnd.gauss(0, 5), 1)
        w = round(max(1.5, 3.3 + 0.55 * min(a, 12) + 0.18 * max(0, a - 12) + rnd.gauss(0, 1.5)), 2)
        out.append(dict(age=a, gender=g, height=h, weight=w))
    return out


def nz(z):
    return None if math.isnan(z) else z


def main():
    rows = []
    for c in cases():
        rows.append({**c, "haz": nz(haz(c["age"], c["gender"], c["height"])),
                     "waz": nz(waz(c["age"], c["gender"], c["weight"])),
                     "whz": nz(whz(c["age"], c["gender"], c["height"], c["weight"]))})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(rows))
    print(f"{len(rows)} kasus -> {OUT}")


if __name__ == "__main__":
    main()
