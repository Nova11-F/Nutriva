"""Uji dataset nutrisi (foods & recipes) yang menjadi seed Supabase."""
import subprocess
import sys
from pathlib import Path

ND = Path(__file__).resolve().parent.parent / "nutrition_data"
sys.path.insert(0, str(ND))

import build_seed as bs  # noqa: E402
from recipes_kemenkes import AGE_GUIDE, RECIPES  # noqa: E402

SEED = ND.parent.parent / "supabase/seed/nutrition_seed.sql"


def test_sr28_snapshot_values():
    sr = bs.load_subset()
    egg = sr["01123"]  # SR28 Egg, whole, raw, fresh
    assert (egg["energy_kcal"], egg["protein_g"], egg["fat_g"], egg["iron_mg"]) == (143, 12.56, 9.51, 1.75)


def test_catalog_integrity():
    cat = bs.load_catalog()
    sr = bs.load_subset()
    codes = [c["code"] for c in cat]
    assert len(codes) == len(set(codes))
    for c in cat:
        assert c["ndb_no"] in sr and c["match_quality"] in {"exact", "close", "proxy"}
        if c["match_quality"] == "proxy":
            assert c["note"].startswith("PROKSI"), c["code"]
        for s in bs.servings(c["servings"]):
            assert 0 < s["grams"] <= 1000


def test_recipes_integrity():
    cat = {c["code"]: c for c in bs.load_catalog()}
    sr = bs.load_subset()
    slugs = [r["slug"] for r in RECIPES]
    assert len(slugs) == len(set(slugs)) == 30
    flagged = []
    for r in RECIPES:
        assert r["age"] in AGE_GUIDE and r["kind"] in {"utama", "selingan", "lauk"} and r["portions"] >= 1
        assert r["src"] in bs.SOURCES and r["steps"]
        rec, qa = bs.recipe_record(r, cat, sr)
        assert rec["budget_tier"] in {"ekonomis", "sedang", "premium"}
        assert 0 < rec["main_nutrients"]["calories"] < 1000
        if not qa["printed_ok"]:
            flagged.append(r["slug"])
    # dua salah cetak yang diketahui di buku sumber
    assert sorted(flagged) == ["bubur-sup-ayam-kacang-merah", "nasi-bakar-ikan-tongkol-pepaya"]


def test_allergen_detection():
    cat = {c["code"]: c for c in bs.load_catalog()}
    sr = bs.load_subset()
    by = {r["slug"]: r for r in RECIPES}
    rec, _ = bs.recipe_record(by["nasi-sup-tabas-udang-sayur"], cat, sr)
    assert {"ikan", "udang/krustasea", "telur", "wijen", "kedelai"} <= set(rec["allergen_tags"])
    rec, _ = bs.recipe_record(by["mie-kukus-telur-puyuh"], cat, sr)
    assert {"telur", "susu", "gandum"} <= set(rec["allergen_tags"])


def test_committed_seed_is_up_to_date():
    before = SEED.read_text(encoding="utf-8")
    subprocess.run([sys.executable, str(ND / "build_seed.py")], check=True, cwd=ND, capture_output=True)
    assert SEED.read_text(encoding="utf-8") == before, "seed SQL tidak sinkron; jalankan build_seed.py lalu commit"
