"""
Definisi fitur + preprocessing pipeline untuk Nutriva Stunting Early-Awareness Model.

Prinsip anti-leakage:
  Label "Stunting Risk" pada dataset Kaggle terbukti 100% identik dengan kategori
  WHO Height-for-Age z-score (HAZ): Low = HAZ >= -2, Medium = -3 <= HAZ < -2,
  High = HAZ < -3 (lihat reports/leakage_check.json). Karena itu tinggi & berat badan
  SAAT INI (Height, Weight) TIDAK dipakai sebagai fitur model ML. Status pertumbuhan
  aktual dihitung secara deterministik oleh WHO z-score engine (src/growth.py).
  Model ML hanya memakai faktor kelahiran, ibu, pola asuh, layanan kesehatan, dan
  lingkungan -> berguna untuk early awareness saat data pengukuran belum ada.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

TARGET = "Stunting Risk"
LABELS = ["Low", "Medium", "High"]          # urutan ordinal
LABEL2ID = {k: i for i, k in enumerate(LABELS)}

# Kolom mentah yang diterima model (kontrak input API memakai versi snake_case-nya)
RAW_NUMERIC = [
    "Child Age", "Birth Length", "Birth Weight", "Mother Age", "Mother Height",
    "ANC Visits", "Complementary Feeding Start Age", "Diarrhea Frequency",
]
RAW_CATEGORICAL = [
    "Gender", "Mother Education", "Exclusive Breastfeeding", "Immunization",
    "Drinking Water Source", "Sanitation", "Economic Level", "Residence Type",
    "Deworming Drug Consumption",
]
EXCLUDED_LEAKY = ["Height", "Weight"]       # dipakai WHO engine, bukan model ML

ORDINAL_MAPS = {
    "Mother Education": ["No Education", "Elementary/Middle School", "High School", "University"],
    "Economic Level": ["Low", "Middle", "High"],
    "Immunization": ["Not Immunized", "Incomplete", "Complete"],
}

# Fitur turunan (domain-driven, mengacu ambang yang umum dipakai Kemenkes/WHO)
ENGINEERED = [
    "flag_lbw",            # Berat lahir < 2,5 kg (BBLR)
    "flag_short_birth",    # Panjang lahir < 48 cm
    "flag_anc_lt4",        # Kunjungan ANC < 4 kali
    "flag_early_mpasi",    # MP-ASI dimulai < 6 bulan
    "flag_late_mpasi",     # MP-ASI dimulai > 6 bulan
    "flag_short_mother",   # Tinggi ibu < 150 cm
    "flag_teen_mother",    # Usia ibu < 20 tahun
    "wash_risk_score",     # 0-2: sanitasi tidak layak + air tidak terlindungi
    "age_group",           # 0: 0-5 bln, 1: 6-11, 2: 12-23, 3: 24-59
]


class NutrivaFeatureEngineer(BaseEstimator, TransformerMixin):
    """Menambah fitur turunan. Stateless -> aman dipakai di dalam Pipeline (tanpa leakage)."""

    def fit(self, X, y=None):
        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        X = X.copy()
        X["flag_lbw"] = (X["Birth Weight"] < 2.5).astype(float).where(X["Birth Weight"].notna())
        X["flag_short_birth"] = (X["Birth Length"] < 48).astype(float).where(X["Birth Length"].notna())
        X["flag_anc_lt4"] = (X["ANC Visits"] < 4).astype(float).where(X["ANC Visits"].notna())
        cf = X["Complementary Feeding Start Age"]
        X["flag_early_mpasi"] = (cf < 6).astype(float).where(cf.notna())
        X["flag_late_mpasi"] = (cf > 6).astype(float).where(cf.notna())
        X["flag_short_mother"] = (X["Mother Height"] < 150).astype(float).where(X["Mother Height"].notna())
        X["flag_teen_mother"] = (X["Mother Age"] < 20).astype(float).where(X["Mother Age"].notna())
        san = X["Sanitation"].map({"Unimproved": 1, "Improved": 0})
        wat = X["Drinking Water Source"].map({"Unprotected": 1, "Protected": 0})
        X["wash_risk_score"] = san.fillna(0) + wat.fillna(0)
        X["age_group"] = pd.cut(X["Child Age"], [-1, 5, 11, 23, 60], labels=False).astype(float)
        return X


def build_preprocessor(scale: bool = True) -> ColumnTransformer:
    ordinal_cols = list(ORDINAL_MAPS)
    nominal_cols = [c for c in RAW_CATEGORICAL if c not in ORDINAL_MAPS]
    num_steps = [("impute", SimpleImputer(strategy="median"))]
    if scale:
        num_steps.append(("scale", StandardScaler()))
    return ColumnTransformer(
        transformers=[
            ("num", Pipeline(num_steps), RAW_NUMERIC + ENGINEERED),
            ("ord", Pipeline([
                ("impute", SimpleImputer(strategy="most_frequent")),
                ("encode", OrdinalEncoder(categories=[ORDINAL_MAPS[c] for c in ordinal_cols],
                                          handle_unknown="use_encoded_value", unknown_value=np.nan)),
                ("impute2", SimpleImputer(strategy="most_frequent")),
            ]), ordinal_cols),
            ("nom", Pipeline([
                ("impute", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore", drop="if_binary")),
            ]), nominal_cols),
        ],
        verbose_feature_names_out=False,
    )


def build_pipeline(estimator, scale: bool = True) -> Pipeline:
    return Pipeline([
        ("features", NutrivaFeatureEngineer()),
        ("preprocess", build_preprocessor(scale=scale)),
        ("model", estimator),
    ])
