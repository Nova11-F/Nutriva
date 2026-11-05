"""
WHO Child Growth Standards (2006) z-score calculator, usia 0-60 bulan.

Sumber tabel LMS: WHO Child Growth Standards, diambil dari paket open-source
`pygrowup` v0.8.2 (folder who_tables/). Rumus LMS (WHO, 2006):
    z = ((X / M) ** L - 1) / (L * S)          , L != 0
    z = ln(X / M) / S                          , L == 0
Untuk WFA/WFH, WHO merekomendasikan restricted z-score di luar |z|>3
(koreksi SD23); diimplementasikan di `_lms_z(..., restricted=True)`.

Asumsi: usia < 24 bulan diukur sebagai panjang badan (recumbent length),
usia >= 24 bulan sebagai tinggi badan (standing height).
"""
from __future__ import annotations

import json
import math
from functools import lru_cache
from pathlib import Path

TABLE_DIR = Path(__file__).resolve().parent.parent / "who_tables"


@lru_cache(maxsize=None)
def _load(name: str) -> list[dict]:
    with open(TABLE_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def _sex_key(gender: str) -> str:
    g = str(gender).strip().upper()
    if g in {"M", "MALE", "L", "LAKI-LAKI", "BOY"}:
        return "boys"
    if g in {"F", "FEMALE", "P", "PEREMPUAN", "GIRL"}:
        return "girls"
    raise ValueError(f"gender tidak dikenali: {gender!r}")


def _row_by_age(table: list[dict], age_month: int) -> dict:
    # Tabel lhfa 0-5 memuat dua baris bulan 24: pertama = length, kedua = height.
    rows = [r for r in table if int(r["Month"]) == int(age_month)]
    if not rows:
        raise ValueError(f"usia {age_month} bulan di luar rentang 0-60")
    return rows[-1] if age_month >= 24 else rows[0]


def _lms_z(x: float, L: float, M: float, S: float, restricted: bool = False) -> float:
    if x is None or x <= 0 or math.isnan(x):
        return float("nan")
    z = math.log(x / M) / S if L == 0 else ((x / M) ** L - 1) / (L * S)
    if restricted and abs(z) > 3:
        def sd(k):  # nilai pada z = k
            return M * (1 + L * S * k) ** (1 / L) if L != 0 else M * math.exp(S * k)
        if z > 3:
            sd23 = sd(3) - sd(2)
            z = 3 + (x - sd(3)) / sd23
        else:
            sd23 = sd(-2) - sd(-3)
            z = -3 + (x - sd(-3)) / sd23
    return z


def haz(age_month: int, gender: str, height_cm: float) -> float:
    """Height/Length-for-Age z-score (indikator stunting)."""
    t = _load(f"lhfa_{_sex_key(gender)}_0_5_zscores.json")
    r = _row_by_age(t, age_month)
    return _lms_z(height_cm, float(r["L"]), float(r["M"]), float(r["S"]))


def waz(age_month: int, gender: str, weight_kg: float) -> float:
    """Weight-for-Age z-score (indikator underweight)."""
    t = _load(f"wfa_{_sex_key(gender)}_0_5_zscores.json")
    r = _row_by_age(t, age_month)
    return _lms_z(weight_kg, float(r["L"]), float(r["M"]), float(r["S"]), restricted=True)


def whz(age_month: int, gender: str, height_cm: float, weight_kg: float) -> float:
    """Weight-for-Length/Height z-score (indikator wasting). Interpolasi linear antar baris 0,5 cm."""
    sex = _sex_key(gender)
    if age_month < 24:
        t, key, lo, hi = _load(f"wfl_{sex}_0_2_zscores.json"), "Length", 45.0, 110.0
    else:
        t, key, lo, hi = _load(f"wfh_{sex}_2_5_zscores.json"), "Height", 65.0, 120.0
    if not (lo <= height_cm <= hi):
        return float("nan")
    xs = [float(r[key]) for r in t]
    # cari interval
    for i in range(len(xs) - 1):
        if xs[i] <= height_cm <= xs[i + 1]:
            a, b = t[i], t[i + 1]
            w = (height_cm - xs[i]) / (xs[i + 1] - xs[i]) if xs[i + 1] != xs[i] else 0.0
            L = float(a["L"]) + w * (float(b["L"]) - float(a["L"]))
            M = float(a["M"]) + w * (float(b["M"]) - float(a["M"]))
            S = float(a["S"]) + w * (float(b["S"]) - float(a["S"]))
            return _lms_z(weight_kg, L, M, S, restricted=True)
    return float("nan")


def classify_haz(z: float) -> str:
    """Kategori Permenkes RI No. 2/2020 untuk TB/U (PB/U)."""
    if math.isnan(z):
        return "Tidak dapat dihitung"
    if z < -3:
        return "Sangat pendek (severely stunted)"
    if z < -2:
        return "Pendek (stunted)"
    if z <= 3:
        return "Normal"
    return "Tinggi"


def classify_waz(z: float) -> str:
    if math.isnan(z):
        return "Tidak dapat dihitung"
    if z < -3:
        return "Berat badan sangat kurang"
    if z < -2:
        return "Berat badan kurang"
    if z <= 1:
        return "Berat badan normal"
    return "Risiko berat badan lebih"


def classify_whz(z: float) -> str:
    if math.isnan(z):
        return "Tidak dapat dihitung"
    if z < -3:
        return "Gizi buruk (severely wasted)"
    if z < -2:
        return "Gizi kurang (wasted)"
    if z <= 1:
        return "Gizi baik (normal)"
    if z <= 2:
        return "Berisiko gizi lebih"
    if z <= 3:
        return "Gizi lebih (overweight)"
    return "Obesitas"


if __name__ == "__main__":
    # Sanity check: anak tepat di median WHO harus z ~ 0
    print(round(haz(0, "M", 49.8842), 3), round(haz(24, "M", 87.1161), 3), round(waz(12, "F", 8.9481), 3))
