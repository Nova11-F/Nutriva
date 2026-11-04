"""
Tahap Model: pemilihan algoritma, training, evaluasi, hyperparameter tuning, penyimpanan.

Objective   : klasifikasi 3 kelas status pertumbuhan (Low / Medium / High) dari faktor
              non-antropometri (kelahiran, ibu, pola asuh, layanan kesehatan, lingkungan).
Metrik utama: Macro-F1 (kelas tidak seimbang 3,9:1); metrik pendamping: Balanced Accuracy,
              Recall kelas High (screening: false negative lebih mahal), ROC-AUC OvR.
Protokol    : stratified hold-out 80/20 (seed 42) -> 5-fold stratified CV pada train untuk
              seleksi & tuning -> test set dipakai SEKALI untuk laporan akhir.
"""
from __future__ import annotations

import json
import platform
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sklearn
import xgboost
from scipy.stats import loguniform, randint, uniform
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, balanced_accuracy_score, classification_report,
                             confusion_matrix, f1_score, make_scorer, recall_score, roc_auc_score)
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold, cross_validate
from sklearn.tree import DecisionTreeClassifier
from sklearn.utils.class_weight import compute_sample_weight
from xgboost import XGBClassifier

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from features import (LABELS, LABEL2ID, RAW_CATEGORICAL, RAW_NUMERIC, TARGET,  # noqa: E402
                      build_pipeline)

SEED = 42
FIG = ROOT / "reports/figures"
REP = ROOT / "reports"
MOD = ROOT / "models"
for p in (FIG, MOD):
    p.mkdir(parents=True, exist_ok=True)

GREEN, DARK, YEL, RED, GREY = "#00B964", "#2E6B4A", "#F2B544", "#E5604D", "#9AA5A0"
plt.rcParams.update({"font.size": 11, "axes.spines.top": False, "axes.spines.right": False,
                     "figure.dpi": 150, "savefig.bbox": "tight"})

recall_high = make_scorer(recall_score, labels=[LABEL2ID["High"]], average="macro")
SCORING = {"macro_f1": "f1_macro", "balanced_acc": "balanced_accuracy",
           "recall_high": recall_high, "accuracy": "accuracy"}


def load():
    tr = pd.read_csv(ROOT / "data/processed/train.csv")
    te = pd.read_csv(ROOT / "data/processed/test.csv")
    cols = RAW_NUMERIC + RAW_CATEGORICAL
    return (tr[cols], tr[TARGET].map(LABEL2ID).values, te[cols], te[TARGET].map(LABEL2ID).values,
            tr, te)


def cv_eval(pipe, X, y, cv, fit_params=None):
    r = cross_validate(pipe, X, y, cv=cv, scoring=SCORING, params=fit_params or {}, n_jobs=-1)
    return {k.replace("test_", ""): (float(np.mean(v)), float(np.std(v)))
            for k, v in r.items() if k.startswith("test_")}


def test_metrics(y_true, y_pred, proba=None):
    m = {
        "accuracy": accuracy_score(y_true, y_pred),
        "balanced_accuracy": balanced_accuracy_score(y_true, y_pred),
        "macro_f1": f1_score(y_true, y_pred, average="macro"),
        "weighted_f1": f1_score(y_true, y_pred, average="weighted"),
        "recall_high": recall_score(y_true, y_pred, labels=[2], average="macro"),
        "per_class": classification_report(y_true, y_pred, target_names=LABELS, output_dict=True,
                                           zero_division=0),
        "confusion_matrix": confusion_matrix(y_true, y_pred, labels=[0, 1, 2]).tolist(),
    }
    if proba is not None:
        m["roc_auc_ovr_macro"] = roc_auc_score(y_true, proba, multi_class="ovr", average="macro")
        # Binary view untuk screening: stunted (Medium+High) vs tidak
        m["roc_auc_stunted_vs_normal"] = roc_auc_score((y_true >= 1).astype(int), proba[:, 1:].sum(1))
    return {k: (round(v, 4) if isinstance(v, float) else v) for k, v in m.items()}


def bootstrap_ci(y_true, y_pred, n=1000, seed=SEED):
    rng = np.random.default_rng(seed)
    idx = np.arange(len(y_true))
    s = [f1_score(y_true[b], y_pred[b], average="macro")
         for b in (rng.choice(idx, len(idx), replace=True) for _ in range(n))]
    return [round(float(np.percentile(s, 2.5)), 4), round(float(np.percentile(s, 97.5)), 4)]


def main():
    t0 = time.time()
    X, y, Xte, yte, tr_full, te_full = load()
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    sw = compute_sample_weight("balanced", y)
    results = {"protocol": {"train_n": int(len(y)), "test_n": int(len(yte)), "cv": "StratifiedKFold(5, seed=42)",
                            "selection_metric": "macro_f1"}}

    # ---------------------------------------------------------------- 0. Leakage demo
    leak_cols = ["Child Age", "Height", "Gender"]
    Xl = tr_full[leak_cols].assign(Gender=(tr_full["Gender"] == "M").astype(int))
    Xl_te = te_full[leak_cols].assign(Gender=(te_full["Gender"] == "M").astype(int))
    dt = DecisionTreeClassifier(random_state=SEED).fit(Xl, y)
    who_rule = np.select([te_full["HAZ"] < -3, te_full["HAZ"] < -2], [2, 1], default=0)
    results["leakage_demo"] = {
        "decision_tree_age_height_gender_test_macro_f1": round(f1_score(yte, dt.predict(Xl_te), average="macro"), 4),
        "who_haz_rule_test_macro_f1": round(f1_score(yte, who_rule, average="macro"), 4),
        "note": "Akurasi tinggi di sini adalah ilusi: model hanya mempelajari ulang rumus WHO HAZ.",
    }
    print("Leakage demo:", results["leakage_demo"])

    # ---------------------------------------------------------------- 1. Baselines (default params)
    candidates = {
        "Dummy (majority)": (DummyClassifier(strategy="most_frequent"), True, None),
        "Logistic Regression": (LogisticRegression(max_iter=3000, random_state=SEED), True, None),
        "Logistic Regression (balanced)": (LogisticRegression(max_iter=3000, class_weight="balanced",
                                                              random_state=SEED), True, None),
        "Random Forest (balanced)": (RandomForestClassifier(n_estimators=400, class_weight="balanced",
                                                            random_state=SEED, n_jobs=1), False, None),
        "HistGradientBoosting (balanced)": (HistGradientBoostingClassifier(class_weight="balanced",
                                                                           random_state=SEED), False, None),
        "XGBoost (sample-weighted)": (XGBClassifier(objective="multi:softprob", eval_metric="mlogloss",
                                                    random_state=SEED, n_jobs=1, tree_method="hist"),
                                      False, "sw"),
    }
    baseline = {}
    for name, (est, scale, w) in candidates.items():
        pipe = build_pipeline(est, scale=scale)
        fp = {"model__sample_weight": sw} if w == "sw" else None
        baseline[name] = cv_eval(pipe, X, y, cv, fp)
        print(f"{name:35s} macroF1={baseline[name]['macro_f1'][0]:.3f}±{baseline[name]['macro_f1'][1]:.3f}"
              f"  recallHigh={baseline[name]['recall_high'][0]:.3f}")
    results["cv_baseline"] = baseline

    # ---------------------------------------------------------------- 2. Hyperparameter tuning (top-2)
    search_spaces = {
        "Logistic Regression (balanced)": (
            LogisticRegression(max_iter=5000, class_weight="balanced", random_state=SEED, solver="saga"), True, None,
            {"model__C": loguniform(1e-3, 1e2), "model__l1_ratio": uniform(0, 1)}),
        "Random Forest (balanced)": (
            RandomForestClassifier(class_weight="balanced", random_state=SEED, n_jobs=1), False, None,
            {"model__n_estimators": randint(200, 800), "model__max_depth": [None, 4, 6, 8, 12, 16],
             "model__min_samples_leaf": randint(1, 30), "model__max_features": ["sqrt", "log2", 0.3, 0.5],
             "model__class_weight": ["balanced", "balanced_subsample"]}),
        "HistGradientBoosting (balanced)": (
            HistGradientBoostingClassifier(class_weight="balanced", random_state=SEED), False, None,
            {"model__learning_rate": loguniform(0.01, 0.3), "model__max_depth": [None, 2, 3, 4, 6],
             "model__max_leaf_nodes": randint(4, 48), "model__min_samples_leaf": randint(10, 120),
             "model__l2_regularization": loguniform(1e-4, 10), "model__max_iter": randint(100, 600)}),
        "XGBoost (sample-weighted)": (
            XGBClassifier(objective="multi:softprob", eval_metric="mlogloss", random_state=SEED,
                          n_jobs=1, tree_method="hist"), False, "sw",
            {"model__n_estimators": randint(100, 700), "model__learning_rate": loguniform(0.01, 0.3),
             "model__max_depth": randint(2, 7), "model__min_child_weight": loguniform(1, 30),
             "model__subsample": uniform(0.6, 0.4), "model__colsample_bytree": uniform(0.5, 0.5),
             "model__reg_lambda": loguniform(1e-2, 50), "model__gamma": loguniform(1e-3, 5)}),
    }
    ranked = sorted([k for k in search_spaces], key=lambda k: -baseline[k]["macro_f1"][0])
    top2 = ranked[:2]
    tuned = {}
    for name in top2:
        est, scale, w, space = search_spaces[name]
        pipe = build_pipeline(est, scale=scale)
        rs = RandomizedSearchCV(pipe, space, n_iter=40, scoring=SCORING, refit="macro_f1", cv=cv,
                                random_state=SEED, n_jobs=-1)
        fp = {"model__sample_weight": sw} if w == "sw" else {}
        rs.fit(X, y, **fp)
        i = rs.best_index_
        cvr = rs.cv_results_
        tuned[name] = {
            "best_params": {k.replace("model__", ""): (v.item() if hasattr(v, "item") else v)
                            for k, v in rs.best_params_.items()},
            "cv": {m: (float(cvr[f"mean_test_{m}"][i]), float(cvr[f"std_test_{m}"][i])) for m in SCORING},
            "estimator": rs.best_estimator_,
        }
        print(f"TUNED {name}: macroF1={tuned[name]['cv']['macro_f1'][0]:.3f}  params={tuned[name]['best_params']}")

    # ---------------------------------------------------------------- 3. Pilih final, evaluasi test SEKALI
    final_name = max(tuned, key=lambda k: tuned[k]["cv"]["macro_f1"][0])
    final_pipe = tuned[final_name]["estimator"]
    # Pembanding before/after tuning di test (model default dilatih ulang pada seluruh train)
    est, scale, w, _ = search_spaces[final_name]
    default_pipe = build_pipeline(candidates[final_name][0], scale=scale)
    fp = {"model__sample_weight": sw} if w == "sw" else {}
    default_pipe.fit(X, y, **fp)
    pred_def, proba_def = default_pipe.predict(Xte), default_pipe.predict_proba(Xte)
    pred, proba = final_pipe.predict(Xte), final_pipe.predict_proba(Xte)
    dummy_pred = np.zeros_like(yte)

    results["final_model"] = final_name
    results["tuning"] = {k: {kk: vv for kk, vv in v.items() if kk != "estimator"} for k, v in tuned.items()}
    results["test"] = {
        "dummy_majority": test_metrics(yte, dummy_pred),
        "before_tuning": test_metrics(yte, pred_def, proba_def),
        "after_tuning": test_metrics(yte, pred, proba),
    }
    results["test"]["after_tuning"]["macro_f1_bootstrap_95ci"] = bootstrap_ci(yte, pred)
    results["test"]["before_tuning"]["macro_f1_bootstrap_95ci"] = bootstrap_ci(yte, pred_def)

    # ---------------------------------------------------------------- 4. Interpretabilitas
    pi = permutation_importance(final_pipe, Xte, yte, scoring="f1_macro", n_repeats=20,
                                random_state=SEED, n_jobs=-1)
    imp = (pd.DataFrame({"feature": Xte.columns, "mean": pi.importances_mean, "std": pi.importances_std})
           .sort_values("mean", ascending=False))
    results["permutation_importance_test"] = imp.round(4).to_dict(orient="records")

    # ---------------------------------------------------------------- 5. Simpan model + metadata
    version = "1.0.0"
    joblib.dump(final_pipe, MOD / "nutriva_stunting_risk_v1.joblib", compress=3)
    meta = {
        "model_name": "nutriva-stunting-early-awareness",
        "version": version,
        "created_utc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "algorithm": final_name,
        "best_params": results["tuning"][final_name]["best_params"],
        "labels": LABELS,
        "input_features": RAW_NUMERIC + RAW_CATEGORICAL,
        "excluded_features": {"Height": "label leakage (label = kategori WHO HAZ)",
                              "Weight": "berkorelasi kuat dgn Height, dipakai WHO engine"},
        "test_metrics": {k: results["test"]["after_tuning"][k] for k in
                         ["accuracy", "balanced_accuracy", "macro_f1", "recall_high", "roc_auc_ovr_macro",
                          "roc_auc_stunted_vs_normal", "macro_f1_bootstrap_95ci"]},
        "env": {"python": platform.python_version(), "scikit-learn": sklearn.__version__,
                "xgboost": xgboost.__version__, "pandas": pd.__version__, "numpy": np.__version__},
        "data_sha256_16": json.loads((REP / "data_quality.json").read_text())["raw_sha256_16"],
    }
    (MOD / "model_metadata.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    results["runtime_sec"] = round(time.time() - t0, 1)
    (REP / "metrics.json").write_text(json.dumps(results, indent=2, ensure_ascii=False, default=str))

    make_figures(results, baseline, yte, pred, proba, imp, tuned, final_name)
    print(json.dumps({k: results["test"][k]["macro_f1"] for k in results["test"]}, indent=2))
    print("final:", final_name, "runtime", results["runtime_sec"], "s")


# ==================================================================== figures
def make_figures(results, baseline, yte, pred, proba, imp, tuned, final_name):
    # (a) perbandingan model (CV)
    names = list(baseline)
    mu = [baseline[n]["macro_f1"][0] for n in names]
    sd = [baseline[n]["macro_f1"][1] for n in names]
    order = np.argsort(mu)
    fig, ax = plt.subplots(figsize=(8, 4.2))
    cols = [GREY if "Dummy" in names[i] else (GREEN if names[i] == final_name else DARK) for i in order]
    ax.barh([names[i] for i in order], [mu[i] for i in order], xerr=[sd[i] for i in order], color=cols,
            capsize=3)
    for k, i in enumerate(order):
        ax.text(mu[i] + sd[i] + 0.01, k, f"{mu[i]:.3f}", va="center", fontsize=10)
    ax.set_xlabel("Macro-F1 (5-fold CV, mean ± std)")
    ax.set_xlim(0, 0.8)
    ax.set_title("Perbandingan algoritma (parameter default)", loc="left", fontweight="bold")
    fig.savefig(FIG / "01_model_comparison_cv.png"); plt.close(fig)

    # (b) before vs after tuning (test)
    b, a = results["test"]["before_tuning"], results["test"]["after_tuning"]
    mets = ["accuracy", "balanced_accuracy", "macro_f1", "recall_high"]
    lab = ["Accuracy", "Balanced Acc.", "Macro-F1", "Recall High"]
    x = np.arange(len(mets))
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(x - 0.2, [b[m] for m in mets], 0.4, color=GREY, label="Sebelum tuning")
    ax.bar(x + 0.2, [a[m] for m in mets], 0.4, color=GREEN, label="Sesudah tuning")
    for i, m in enumerate(mets):
        ax.text(i - 0.2, b[m] + 0.01, f"{b[m]:.3f}", ha="center", fontsize=9)
        ax.text(i + 0.2, a[m] + 0.01, f"{a[m]:.3f}", ha="center", fontsize=9)
    ax.set_xticks(x, lab); ax.set_ylim(0, 1); ax.legend(frameon=False)
    ax.set_title(f"{final_name}: sebelum vs sesudah tuning (test set, n={len(yte)})", loc="left",
                 fontweight="bold")
    fig.savefig(FIG / "02_tuning_before_after.png"); plt.close(fig)

    # (c) confusion matrix
    cm = np.array(results["test"]["after_tuning"]["confusion_matrix"])
    cmn = cm / cm.sum(1, keepdims=True)
    fig, ax = plt.subplots(figsize=(4.8, 4.2))
    ax.imshow(cmn, cmap="Greens", vmin=0, vmax=1)
    for i in range(3):
        for j in range(3):
            ax.text(j, i, f"{cm[i, j]}\n({cmn[i, j]:.0%})", ha="center", va="center",
                    color="white" if cmn[i, j] > 0.55 else "black", fontsize=10)
    ax.set_xticks(range(3), LABELS); ax.set_yticks(range(3), LABELS)
    ax.set_xlabel("Prediksi"); ax.set_ylabel("Aktual")
    ax.set_title("Confusion matrix (test)", loc="left", fontweight="bold")
    for s in ax.spines.values():
        s.set_visible(False)
    fig.savefig(FIG / "03_confusion_matrix.png"); plt.close(fig)

    # (d) permutation importance
    top = imp.head(10).iloc[::-1]
    fig, ax = plt.subplots(figsize=(7.5, 4.2))
    ax.barh(top["feature"], top["mean"], xerr=top["std"], color=GREEN, capsize=3)
    ax.axvline(0, color="black", lw=0.6)
    ax.set_xlabel("Penurunan Macro-F1 jika fitur diacak (permutation importance, test)")
    ax.set_title("Faktor yang paling memengaruhi prediksi", loc="left", fontweight="bold")
    fig.savefig(FIG / "04_permutation_importance.png"); plt.close(fig)

    # (e) leakage demo
    ld = results["leakage_demo"]
    vals = [ld["who_haz_rule_test_macro_f1"], ld["decision_tree_age_height_gender_test_macro_f1"],
            results["test"]["after_tuning"]["macro_f1"], results["test"]["dummy_majority"]["macro_f1"]]
    labs = ["Rumus WHO HAZ\n(tanpa ML)", "Decision Tree\n(Usia+Tinggi+JK)", "Model Nutriva\n(tanpa Tinggi/Berat)",
            "Dummy\n(mayoritas)"]
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.bar(labs, vals, color=[DARK, RED, GREEN, GREY])
    for i, v in enumerate(vals):
        ax.text(i, v + 0.015, f"{v:.3f}", ha="center")
    ax.set_ylim(0, 1.1); ax.set_ylabel("Macro-F1 (test)")
    ax.set_title("Kenapa kami tidak memakai model 'akurasi ~100%'", loc="left", fontweight="bold")
    fig.savefig(FIG / "05_leakage_demo.png"); plt.close(fig)


if __name__ == "__main__":
    main()
