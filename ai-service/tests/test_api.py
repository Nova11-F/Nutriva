"""Uji kontrak API + sanity check WHO engine. Jalankan: python -m pytest -q"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import pandas as pd  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from growth import haz, waz  # noqa: E402

client = TestClient(app)
BASE = {"child_age_months": 14, "gender": "F", "birth_length_cm": 47.5, "birth_weight_kg": 2.4,
        "mother_age": 24, "mother_education": "High School", "mother_height_cm": 149, "anc_visits": 3,
        "exclusive_breastfeeding": "No", "complementary_feeding_start_months": 5, "immunization": "Incomplete",
        "diarrhea_frequency": 2, "drinking_water_source": "Unprotected", "sanitation": "Improved",
        "economic_level": "Low", "residence_type": "Rural", "deworming": "No"}


def test_who_median_is_zero():
    assert abs(haz(0, "M", 49.8842)) < 1e-6
    assert abs(waz(12, "F", 8.9481)) < 1e-6


def test_who_engine_reproduces_dataset_label():
    df = pd.read_csv(ROOT / "data/processed/full_with_zscores.csv")
    rule = df["HAZ"].apply(lambda z: "High" if z < -3 else ("Medium" if z < -2 else "Low"))
    assert (rule == df["Stunting Risk"]).mean() == 1.0


def test_health():
    r = client.get("/health").json()
    assert r["status"] == "ok" and r["model_version"] == "1.1.0"


def test_zscores_endpoint_matches_engine():
    r = client.post("/v1/growth/zscores", json={"child_age_months": 0, "gender": "M", "height_cm": 49.8842})
    assert r.status_code == 200 and r.json()["haz"]["z"] == 0.0
    assert client.post("/v1/growth/zscores", json={"child_age_months": 10, "gender": "M"}).status_code == 422


def test_ml_only_never_refers():
    r = client.post("/v1/growth/assess", json=BASE).json()
    assert r["alert"] in {"info", "attention"}
    assert r["risk_model"]["early_awareness"] == (r["risk_model"]["risk_score"] >= r["risk_model"]["alert_threshold"])


def test_unknown_fields_rejected():
    assert client.post("/v1/growth/assess", json={**BASE, "name": "Rara"}).status_code == 422


def test_assess_with_measurement_uses_who():
    r = client.post("/v1/growth/assess", json={**BASE, "height_cm": 71.0, "weight_kg": 7.9})
    assert r.status_code == 200
    body = r.json()
    assert body["basis"] == "who_measurement"
    assert body["level"] in {"Low", "Medium", "High"}
    assert abs(sum(body["risk_model"]["probabilities"].values()) - 1) < 1e-3
    assert "bukan diagnosis" in body["disclaimer"]


def test_assess_without_measurement_uses_ml():
    r = client.post("/v1/growth/assess", json=BASE)
    assert r.status_code == 200 and r.json()["basis"] == "ml_risk_profile"
    assert r.json()["growth_status"] is None


def test_missing_optional_fields_are_imputed():
    r = client.post("/v1/growth/assess", json={"child_age_months": 30, "gender": "M"})
    assert r.status_code == 200


def test_invalid_input_rejected():
    assert client.post("/v1/growth/assess", json={**BASE, "child_age_months": 80}).status_code == 422
    assert client.post("/v1/growth/assess", json={**BASE, "gender": "X"}).status_code == 422
    assert client.post("/v1/growth/assess", json={**BASE, "height_cm": 45.0}).status_code == 422


def test_model_info_has_no_env_details():
    m = client.get("/v1/model-info").json()
    assert m["version"] == "1.1.0" and m["alert_threshold"] == 0.31 and "env" not in m
