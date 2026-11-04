"""
Tahap Data -> dataset final siap-latih (ready-to-train).

Input : data/raw/childhood_stunting_dataset.csv (Kaggle "Childhood Stunting Risk Factors",
        victoriahayes, n=2.523)
Output: data/processed/{train,test}.csv, data/processed/full_with_zscores.csv,
        reports/data_quality.json, reports/leakage_check.json

Langkah: validasi skema -> cek duplikat & anomali biologis -> hitung WHO z-score
-> audit label vs HAZ -> stratified split 80/20 (seed 42). Imputasi & scaling TIDAK
dilakukan di sini; dilakukan di dalam Pipeline agar statistik hanya dipelajari dari data train.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from features import TARGET, LABELS, RAW_NUMERIC, RAW_CATEGORICAL, EXCLUDED_LEAKY  # noqa: E402
from growth import haz, waz, whz  # noqa: E402

RAW = ROOT / "data/raw/childhood_stunting_dataset.csv"
OUT = ROOT / "data/processed"
REP = ROOT / "reports"
SEED = 42


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    REP.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(RAW)
    sha = hashlib.sha256(RAW.read_bytes()).hexdigest()[:16]

    expected = set(RAW_NUMERIC + RAW_CATEGORICAL + EXCLUDED_LEAKY + [TARGET])
    missing_cols = expected - set(df.columns)
    assert not missing_cols, f"kolom hilang: {missing_cols}"
    assert set(df[TARGET].unique()) <= set(LABELS)

    n0 = len(df)
    dup = int(df.duplicated().sum())
    df = df.drop_duplicates()
    anomaly = (df["Height"] < df["Birth Length"]) | (df["Weight"] < df["Birth Weight"])
    df["flag_bio_anomaly"] = anomaly.astype(int)

    # WHO z-scores (untuk audit label + untuk evaluasi growth engine)
    df["HAZ"] = [haz(a, g, h) for a, g, h in zip(df["Child Age"], df["Gender"], df["Height"])]
    df["WAZ"] = [waz(a, g, w) for a, g, w in zip(df["Child Age"], df["Gender"], df["Weight"])]
    df["WHZ"] = [whz(a, g, h, w) for a, g, h, w in
                 zip(df["Child Age"], df["Gender"], df["Height"], df["Weight"])]

    # ---- Audit label: apakah "Stunting Risk" = kategori HAZ WHO? ----
    rule = np.select([df["HAZ"] < -3, df["HAZ"] < -2], ["High", "Medium"], default="Low")
    agree = float((rule == df[TARGET]).mean())
    ranges = df.groupby(TARGET)["HAZ"].agg(["min", "max", "count"]).round(3)
    leakage = {
        "finding": "Label 'Stunting Risk' identik dengan kategori WHO HAZ (TB/U)",
        "rule": {"Low": "HAZ >= -2", "Medium": "-3 <= HAZ < -2", "High": "HAZ < -3"},
        "agreement_rate": agree,
        "haz_range_per_label": ranges.reset_index().to_dict(orient="records"),
        "implication": ("Model yang memakai Height+Age+Gender hanya mereplikasi rumus WHO. "
                        "Height & Weight dikeluarkan dari fitur model ML; status aktual "
                        "dihitung deterministik oleh WHO z-score engine."),
    }
    (REP / "leakage_check.json").write_text(json.dumps(leakage, indent=2, ensure_ascii=False))

    quality = {
        "source": "Kaggle - Childhood Stunting Risk Factors (victoriahayes)",
        "raw_sha256_16": sha,
        "rows_raw": n0,
        "full_duplicates_removed": dup,
        "rows_final": len(df),
        "bio_anomaly_rows_flagged": int(anomaly.sum()),
        "missing_per_column": {k: int(v) for k, v in df.isna().sum().items() if v > 0},
        "class_distribution": df[TARGET].value_counts().reindex(LABELS).to_dict(),
        "imbalance_ratio_low_to_high": round(df[TARGET].value_counts()["Low"] /
                                             df[TARGET].value_counts()["High"], 2),
        "missing_strategy": "Median (numerik) / modus (kategorikal), di-fit hanya pada train di dalam Pipeline",
        "imbalance_strategy": "class_weight='balanced' / sample_weight, dibandingkan dengan tanpa pembobotan",
    }
    (REP / "data_quality.json").write_text(json.dumps(quality, indent=2, ensure_ascii=False))

    train, test = train_test_split(df, test_size=0.2, stratify=df[TARGET], random_state=SEED)
    train.to_csv(OUT / "train.csv", index=False)
    test.to_csv(OUT / "test.csv", index=False)
    df.to_csv(OUT / "full_with_zscores.csv", index=False)
    print(json.dumps(quality, indent=2))
    print(f"Label vs WHO-HAZ agreement: {agree:.4f}")
    print(f"train={len(train)} test={len(test)}")


if __name__ == "__main__":
    main()
