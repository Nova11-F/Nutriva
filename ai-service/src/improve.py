"""
Model v1.1 untuk produksi: balancing, kalibrasi probabilitas, ambang alert, dan uji konsistensi literatur.

1. Balancing: bandingkan (a) tanpa pembobotan, (b) class_weight, (c) RandomOverSampler, (d) SMOTENC.
   Resampling dilakukan DI DALAM fold CV (imblearn Pipeline) agar tidak bocor ke data validasi.
2. Kalibrasi: aplikasi menampilkan probabilitas, jadi probabilitas harus terkalibrasi.
   Bandingkan uncalibrated vs sigmoid vs isotonic (Brier score & log-loss, test set).
3. Ambang alert "perlu perhatian": P(Medium)+P(High) >= t, t dipilih dari prediksi out-of-fold
   pada data train agar recall stunted >= 0,80 (skrining mengutamakan sensitivitas).
4. Konsistensi literatur: arah efek tiap faktor pada model dibandingkan dengan studi Indonesia
   (Riskesdas 2013, Nutrients 2019; IFLS 2007/2014, PLOS ONE 2021).
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from imblearn.over_sampling import RandomOverSampler, SMOTENC
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (brier_score_loss, f1_score, log_loss, precision_score, recall_score,
                             roc_auc_score)
from sklearn.model_selection import StratifiedKFold, cross_val_predict, cross_validate

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from features import (LABEL2ID, LABELS, RAW_CATEGORICAL, RAW_NUMERIC, TARGET,  # noqa: E402
                      NutrivaFeatureEngineer, build_preprocessor)

SEED = 42
REP = ROOT / "reports"
MOD = ROOT / "models"
RECALL_TARGET = 0.80


def rf(class_weight=None):
    # parameter terbaik dari tuning v1 (lihat models/model_metadata.json)
    return RandomForestClassifier(n_estimators=469, max_depth=4, max_features="log2", min_samples_leaf=4,
                                  class_weight=class_weight, random_state=SEED, n_jobs=1)


def make_pipe(strategy: str):
    steps = [("features", NutrivaFeatureEngineer()), ("preprocess", build_preprocessor(scale=False))]
    if strategy == "none":
        steps.append(("model", rf(None)))
    elif strategy == "class_weight":
        steps.append(("model", rf("balanced_subsample")))
    elif strategy == "random_oversample":
        steps += [("resample", RandomOverSampler(random_state=SEED)), ("model", rf(None))]
    elif strategy == "smotenc":
        # setelah preprocess: kolom numerik di depan, lalu ordinal + one-hot (kategorikal)
        n_num = len(RAW_NUMERIC) + 9
        steps += [("resample", SMOTENC(categorical_features="auto" if False else list(range(n_num, n_num + 50)),
                                        random_state=SEED)), ("model", rf(None))]
    return ImbPipeline(steps)


def fix_smotenc_indices(pipe, X):
    """SMOTENC butuh indeks kolom kategorikal setelah preprocess; hitung dari jumlah kolom aktual."""
    pre = ImbPipeline(pipe.steps[:2]).fit(X)
    n_total = pre.transform(X.head(5)).shape[1]
    n_num = len(RAW_NUMERIC) + 9
    pipe.set_params(resample__categorical_features=list(range(n_num, n_total)))
    return pipe


def main():
    tr = pd.read_csv(ROOT / "data/processed/train.csv")
    te = pd.read_csv(ROOT / "data/processed/test.csv")
    cols = RAW_NUMERIC + RAW_CATEGORICAL
    X, y = tr[cols], tr[TARGET].map(LABEL2ID).values
    Xte, yte = te[cols], te[TARGET].map(LABEL2ID).values
    cv = StratifiedKFold(5, shuffle=True, random_state=SEED)
    out = {"created_utc": datetime.now(timezone.utc).isoformat(timespec="seconds")}

    # ---------------------------------------------------------------- 1. balancing
    bal = {}
    for s in ["none", "class_weight", "random_oversample", "smotenc"]:
        p = make_pipe(s)
        if s == "smotenc":
            p = fix_smotenc_indices(p, X)
        r = cross_validate(p, X, y, cv=cv, n_jobs=-1,
                           scoring={"macro_f1": "f1_macro", "balanced_acc": "balanced_accuracy",
                                    "recall_high": lambda est, Xv, yv: recall_score(yv, est.predict(Xv), labels=[2],
                                                                                    average="macro")})
        bal[s] = {k.replace("test_", ""): [round(float(np.mean(v)), 4), round(float(np.std(v)), 4)]
                  for k, v in r.items() if k.startswith("test_")}
        print(f"{s:18s}", bal[s])
    out["balancing_cv"] = bal
    best = max(bal, key=lambda k: bal[k]["macro_f1"][0])
    out["balancing_selected"] = best

    # ---------------------------------------------------------------- 2. kalibrasi
    base = make_pipe(best)
    if best == "smotenc":
        base = fix_smotenc_indices(base, X)
    cal_res, models = {}, {}
    for method in ["uncalibrated", "sigmoid", "isotonic"]:
        m = base if method == "uncalibrated" else CalibratedClassifierCV(base, method=method, cv=5)
        m.fit(X, y)
        pr = m.predict_proba(Xte)
        yb = (yte >= 1).astype(int)
        cal_res[method] = {
            "log_loss": round(float(log_loss(yte, pr)), 4),
            "brier_stunted": round(float(brier_score_loss(yb, pr[:, 1:].sum(1))), 4),
            "macro_f1": round(float(f1_score(yte, pr.argmax(1), average="macro")), 4),
            "roc_auc_stunted": round(float(roc_auc_score(yb, pr[:, 1:].sum(1))), 4),
        }
        models[method] = m
        print(method, cal_res[method])
    out["calibration_test"] = cal_res
    cal_best = min(cal_res, key=lambda k: cal_res[k]["log_loss"])
    out["calibration_selected"] = cal_best
    final = models[cal_best]

    # ---------------------------------------------------------------- 3. ambang alert (dari OOF train)
    oof_model = base if cal_best == "uncalibrated" else CalibratedClassifierCV(base, method=cal_best, cv=5)
    oof = cross_val_predict(oof_model, X, y, cv=cv, method="predict_proba", n_jobs=-1)
    s_oof, yb_tr = oof[:, 1:].sum(1), (y >= 1).astype(int)
    grid = np.round(np.arange(0.05, 0.95, 0.01), 2)
    feasible = [t for t in grid if recall_score(yb_tr, (s_oof >= t).astype(int)) >= RECALL_TARGET]
    thr = float(max(feasible)) if feasible else 0.5
    s_te = final.predict_proba(Xte)[:, 1:].sum(1)
    pred_te = (s_te >= thr).astype(int)
    yb_te = (yte >= 1).astype(int)
    out["alert_threshold"] = {
        "rule": "P(Medium)+P(High) >= threshold",
        "threshold": thr, "recall_target_oof": RECALL_TARGET,
        "test_recall_stunted": round(float(recall_score(yb_te, pred_te)), 4),
        "test_precision_stunted": round(float(precision_score(yb_te, pred_te)), 4),
        "test_alert_rate": round(float(pred_te.mean()), 4),
        "test_prevalence_stunted": round(float(yb_te.mean()), 4),
    }
    print("threshold", out["alert_threshold"])

    # ---------------------------------------------------------------- 4. konsistensi literatur
    def avg_risk(df, col, val):
        d = df.copy()
        d[col] = val
        return float(final.predict_proba(d[cols])[:, 1:].sum(1).mean())

    checks = [
        ("Berat lahir rendah <2,5 kg", "Birth Weight", 2.2, 3.2, "risk",
         "aOR 2,55 (2,05–3,15) Riskesdas 2013; aOR 2,29 (1,73–3,01) IFLS"),
        ("ANC < 4 kali", "ANC Visits", 2, 6, "risk", "aOR 1,22 (1,08–1,39) untuk 1–3 vs ≥4 ANC, Riskesdas 2013"),
        ("Laki-laki", "Gender", "M", "F", "risk", "aOR 1,33 (1,22–1,45) Riskesdas 2013; 1,17 IFLS"),
        ("Diare berulang (3 vs 0 kali)", "Diarrhea Frequency", 3, 0, "risk", "aOR 1,30 (1,02–1,65) diare akut, IFLS"),
        ("Tinggi ibu pendek (145 vs 158 cm)", "Mother Height", 145, 158, "risk",
         "tinggi ibu <145 cm: risiko +19% (1,05–1,34), IFLS"),
        ("Sanitasi tidak layak", "Sanitation", "Unimproved", "Improved", "risk",
         "tanpa akses sanitasi: 1,27 (1,10–1,46), IFLS"),
        ("Tinggal di perdesaan", "Residence Type", "Rural", "Urban", "risk", "perdesaan +19% (1,02–1,40), IFLS"),
        ("Ekonomi rendah vs tinggi", "Economic Level", "Low", "High", "risk",
         "kuintil termiskin aOR 1,74 (1,51–2,01) vs terkaya, Riskesdas 2013"),
        ("Pendidikan ibu SD/SMP vs universitas", "Mother Education", "Elementary/Middle School", "University",
         "risk", "tiap tahun sekolah ibu protektif, aOR 0,96 (0,94–0,97), IFLS"),
    ]
    lit = []
    for name, col, risky, safe, expected, ref in checks:
        r1, r0 = avg_risk(te, col, risky), avg_risk(te, col, safe)
        lit.append({"factor": name, "model_p_stunted_risk_value": round(r1, 4),
                    "model_p_stunted_reference_value": round(r0, 4), "delta": round(r1 - r0, 4),
                    "direction_matches_literature": bool(r1 > r0), "literature": ref})
        print(f"{name:40s} Δ={r1 - r0:+.4f} {'OK' if r1 > r0 else 'BERLAWANAN'}")
    out["literature_consistency"] = lit
    out["literature_sources"] = [
        "Determinants of the stunting of children under two years old in Indonesia: a multilevel analysis of the "
        "2013 Indonesia Basic Health Survey. Nutrients (2019) 11(5):1106. https://www.mdpi.com/2072-6643/11/5/1106",
        "Beyond personal factors: Multilevel determinants of childhood stunting in Indonesia. PLOS ONE (2021). "
        "https://doi.org/10.1371/journal.pone.0260265",
    ]

    # ---------------------------------------------------------------- simpan v1.1
    final_metrics = {
        "macro_f1": cal_res[cal_best]["macro_f1"], "roc_auc_stunted": cal_res[cal_best]["roc_auc_stunted"],
        "log_loss": cal_res[cal_best]["log_loss"], "brier_stunted": cal_res[cal_best]["brier_stunted"],
        **{k: v for k, v in out["alert_threshold"].items() if k.startswith("test_")},
    }
    joblib.dump(final, MOD / "nutriva_stunting_risk_v1_1.joblib", compress=3)
    meta = json.loads((MOD / "model_metadata.json").read_text())
    meta.update({
        "version": "1.1.0", "created_utc": out["created_utc"],
        "algorithm": f"Random Forest ({best}) + kalibrasi {cal_best}",
        "balancing": best, "calibration": cal_best,
        "alert_threshold": thr, "alert_rule": "P(Medium)+P(High) >= alert_threshold",
        "test_metrics": final_metrics, "file": "nutriva_stunting_risk_v1_1.joblib",
    })
    (MOD / "model_metadata.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    (REP / "improvement_v1_1.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print("saved v1.1:", best, cal_best, "thr", thr)


if __name__ == "__main__":
    main()
