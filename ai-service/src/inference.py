"""
Nutriva AI inference service (hybrid):
  1) WHO z-score engine  -> status pertumbuhan aktual (jika tinggi/berat tersedia)  [deterministik]
  2) ML early-awareness  -> probabilitas Low/Medium/High dari faktor non-antropometri [Random Forest]
  3) Action layer         -> pesan ramah orang tua + next action; TIDAK membuat diagnosis.

Aturan prioritas: bila pengukuran tersedia, status WHO yang menjadi acuan utama; output ML
ditampilkan sebagai 'profil faktor risiko', bukan diagnosis.
"""
from __future__ import annotations

import json
import math
import sys
from functools import lru_cache
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from features import LABELS, RAW_CATEGORICAL, RAW_NUMERIC  # noqa: E402
from growth import classify_haz, classify_waz, classify_whz, haz, waz, whz  # noqa: E402

META_PATH = ROOT / "models/model_metadata.json"

# snake_case (kontrak API) -> nama kolom training
FIELD_MAP = {
    "child_age_months": "Child Age", "gender": "Gender", "birth_length_cm": "Birth Length",
    "birth_weight_kg": "Birth Weight", "mother_age": "Mother Age", "mother_education": "Mother Education",
    "mother_height_cm": "Mother Height", "anc_visits": "ANC Visits",
    "exclusive_breastfeeding": "Exclusive Breastfeeding",
    "complementary_feeding_start_months": "Complementary Feeding Start Age",
    "immunization": "Immunization", "diarrhea_frequency": "Diarrhea Frequency",
    "drinking_water_source": "Drinking Water Source", "sanitation": "Sanitation",
    "economic_level": "Economic Level", "residence_type": "Residence Type",
    "deworming": "Deworming Drug Consumption",
}

# Faktor yang dapat ditindaklanjuti -> saran edukatif (bahasa awam, non-diagnostik)
ACTIONABLE = [
    (lambda r: r.get("ANC Visits") is not None and r["ANC Visits"] < 4,
     "Riwayat kunjungan ANC < 4 kali", "Diskusikan riwayat kehamilan dengan bidan/Posyandu saat penimbangan berikutnya."),
    (lambda r: r.get("Complementary Feeding Start Age") is not None and r["Complementary Feeding Start Age"] != 6,
     "MP-ASI tidak dimulai tepat usia 6 bulan", "Pastikan MP-ASI kaya protein hewani sesuai usia; konsultasikan tekstur & porsi."),
    (lambda r: r.get("Sanitation") == "Unimproved",
     "Sanitasi belum layak", "Cuci tangan pakai sabun sebelum menyiapkan makanan & setelah dari toilet."),
    (lambda r: r.get("Drinking Water Source") == "Unprotected",
     "Sumber air minum tidak terlindungi", "Masak air minum hingga mendidih sebelum diberikan."),
    (lambda r: r.get("Immunization") in {"Incomplete", "Not Immunized"},
     "Imunisasi belum lengkap", "Cek jadwal imunisasi di buku KIA dan lengkapi di Posyandu/Puskesmas."),
    (lambda r: r.get("Deworming Drug Consumption") == "No",
     "Belum minum obat cacing", "Tanyakan jadwal obat cacing di Posyandu (umumnya mulai usia 12 bulan)."),
    (lambda r: (r.get("Diarrhea Frequency") or 0) >= 3,
     "Diare berulang", "Diare berulang perlu diperiksakan ke tenaga kesehatan."),
    (lambda r: r.get("Birth Weight") is not None and r["Birth Weight"] < 2.5,
     "Berat lahir rendah (< 2,5 kg)", "Pantau pertumbuhan lebih rutin (tiap bulan) bersama kader Posyandu."),
]

DISCLAIMER = ("Hasil ini adalah alat bantu edukasi, bukan diagnosis medis. "
              "Untuk penilaian status gizi, konsultasikan ke tenaga kesehatan/Posyandu/Puskesmas.")


@lru_cache(maxsize=1)
def load_model():
    meta = json.loads(META_PATH.read_text())
    model = joblib.load(ROOT / "models" / meta.get("file", "nutriva_stunting_risk_v1.joblib"))
    return model, meta


def _nan_to_none(x):
    return None if x is None or (isinstance(x, float) and math.isnan(x)) else round(float(x), 2)


def growth_status(age: int, gender: str, height: float | None, weight: float | None) -> dict | None:
    if height is None and weight is None:
        return None
    out = {}
    raw_haz = None
    if height is not None:
        z = raw_haz = haz(age, gender, height)
        out["haz"] = {"z": _nan_to_none(z), "category": classify_haz(z)}
    if weight is not None:
        z = waz(age, gender, weight)
        out["waz"] = {"z": _nan_to_none(z), "category": classify_waz(z)}
    if height is not None and weight is not None:
        z = whz(age, gender, height, weight)
        out["whz"] = {"z": _nan_to_none(z), "category": classify_whz(z)}
    if raw_haz is not None and not math.isnan(raw_haz):
        z = raw_haz  # pakai nilai mentah (bukan yang dibulatkan) agar batas -2/-3 tepat
        out["stunting_level"] = "High" if z < -3 else ("Medium" if z < -2 else "Low")
    out["standard"] = "WHO Child Growth Standards 2006 / Permenkes RI No. 2 Tahun 2020"
    return out


def predict(payload: dict) -> dict:
    model, meta = load_model()
    row = {col: payload.get(key) for key, col in FIELD_MAP.items()}
    X = pd.DataFrame([row], columns=RAW_NUMERIC + RAW_CATEGORICAL)
    X = X.astype(object).where(X.notna(), np.nan)   # None -> NaN agar di-impute pipeline
    for c in RAW_NUMERIC:
        X[c] = pd.to_numeric(X[c], errors="coerce")
    proba = model.predict_proba(X)[0]
    probs = {lab: round(float(p), 4) for lab, p in zip(LABELS, proba)}
    ml_level = LABELS[int(proba.argmax())]
    thr = float(meta.get("alert_threshold", 0.5))
    risk_score = float(proba[1] + proba[2])          # P(Medium)+P(High), terkalibrasi (v1.1)
    ml_alert = risk_score >= thr

    growth = growth_status(int(payload["child_age_months"]), payload["gender"],
                           payload.get("height_cm"), payload.get("weight_kg"))
    factors = [{"factor": name, "suggestion": tip} for cond, name, tip in ACTIONABLE if cond(row)]

    # Level akhir: ukuran aktual (WHO) > profil risiko (ML)
    if growth and growth.get("stunting_level"):
        final_level, basis = growth["stunting_level"], "who_measurement"
        if final_level == "Low":
            alert, msg = "info", "Tinggi badan sesuai usia dalam batas standar WHO. Lanjutkan pemantauan rutin tiap bulan."
        elif final_level == "Medium":
            alert, msg = "attention", ("Perlu perhatian. Disarankan memeriksakan pertumbuhan anak ke Posyandu/"
                                       "Puskesmas dalam waktu dekat dan memperbaiki faktor yang bisa diubah.")
        else:
            alert, msg = "refer", ("Perlu pemeriksaan tenaga kesehatan. Segera kunjungi Puskesmas/dokter anak "
                                   "untuk penilaian langsung.")
    else:
        # Tanpa pengukuran, ML hanya memberi 'early awareness': tidak pernah 'refer'.
        final_level, basis = ml_level, "ml_risk_profile"
        if ml_alert:
            alert, msg = "attention", ("Profil faktor risiko anak perlu perhatian. Ukur tinggi dan berat badan "
                                       "di Posyandu agar status pertumbuhan bisa dinilai dengan standar WHO.")
        else:
            alert, msg = "info", ("Profil faktor risiko tidak menunjukkan sinyal khusus. Tetap ukur tinggi dan "
                                  "berat badan rutin tiap bulan.")
    return {
        "level": final_level,
        "basis": basis,
        "alert": alert,
        "message": msg,
        "growth_status": growth,
        "risk_model": {"predicted_level": ml_level, "probabilities": probs,
                       "risk_score": round(risk_score, 4), "alert_threshold": thr, "early_awareness": ml_alert,
                       "model_version": meta["version"], "algorithm": meta["algorithm"]},
        "modifiable_factors": factors,
        "disclaimer": DISCLAIMER,
    }


if __name__ == "__main__":
    demo = {"child_age_months": 14, "gender": "F", "birth_length_cm": 47.5, "birth_weight_kg": 2.4,
            "mother_age": 24, "mother_education": "High School", "mother_height_cm": 149,
            "anc_visits": 3, "exclusive_breastfeeding": "No", "complementary_feeding_start_months": 5,
            "immunization": "Incomplete", "diarrhea_frequency": 2, "drinking_water_source": "Unprotected",
            "sanitation": "Improved", "economic_level": "Low", "residence_type": "Rural", "deworming": "No",
            "height_cm": 71.0, "weight_kg": 7.9}
    print(json.dumps(predict(demo), indent=2, ensure_ascii=False))
