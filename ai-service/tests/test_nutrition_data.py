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


def test_tkpi_extraction_matches_printed_table():
    tk = bs.load_tkpi()
    assert len(tk) == 1146                      # jumlah bahan TKPI 2017
    # dicocokkan manual dengan gambar halaman PDF (hlm. 9 dan 68 buku)
    a = tk["AR001"]
    assert (a["energi_kal"], a["protein_g"], a["lemak_g"], a["kh_g"], a["besi_mg"], a["bdd_pct"]) == \
        ("357", "8.4", "1.7", "77.1", "1.8", "100")
    assert tk["AR003"]["retinol_mcg"] == "" and tk["AR003"]["kartotal_mcg"] == "80"   # sel kosong tetap kosong
    assert tk["NR018"]["air_g"] == "55.0" and tk["DR035"]["vitc_mg"] == "164"          # angka terbungkus digabung
    ok = sum(1 for r in tk.values() if r["proximate_sum"] and abs(float(r["proximate_sum"]) - 100) <= 3)
    assert ok / len(tk) > 0.95


def comps():
    cat = bs.load_catalog()
    sr, tk = bs.load_subset(), bs.load_tkpi()
    return {c["code"]: bs.composition(c, tk, sr) for c in cat}


def test_catalog_integrity():
    cat = bs.load_catalog()
    sr, tk = bs.load_subset(), bs.load_tkpi()
    codes = [c["code"] for c in cat]
    assert len(codes) == len(set(codes))
    comp = comps()
    for c in cat:
        assert (c["ndb_no"] in sr or c["tkpi_code"] in tk) and c["match_quality"] in {"exact", "close", "proxy"}
        cp = comp[c["code"]]
        assert cp["energy_kcal"] > 0 and cp["source"]
        if c["match_quality"] == "proxy":
            assert c["note"].startswith("PROKSI"), c["code"]
        for sv in bs.servings(c["servings"]):
            assert 0 < sv["grams"] <= 1000


def test_tkpi_priority_and_iron_guard():
    comp = comps()
    assert comp["IKAN_KEMBUNG"]["source"].startswith("TKPI 2017 GR050")
    assert comp["TEPUNG_TERIGU"]["source"].startswith("USDA")          # sengaja: fortifikasi besi
    assert comp["MIE_TELUR"]["source"].startswith("USDA")              # TKPI AP022 gagal uji Atwater
    assert comp["SUSU_SAPI"]["iron_mg"] < 0.1                          # besi TKPI 1,7 mg ditolak (>5x USDA)


def test_recipes_integrity():
    comp = comps()
    slugs = [r["slug"] for r in RECIPES]
    assert len(slugs) == len(set(slugs)) == 30
    flagged = []
    for r in RECIPES:
        assert r["age"] in AGE_GUIDE and r["kind"] in {"utama", "selingan", "lauk"} and r["portions"] >= 1
        assert r["src"] in bs.SOURCES and r["steps"]
        rec, qa = bs.recipe_record(r, comp)
        assert rec["budget_tier"] in {"ekonomis", "sedang", "premium"}
        assert 0 < rec["main_nutrients"]["calories"] < 1000
        if not qa["printed_ok"]:
            flagged.append(r["slug"])
    # dua salah cetak yang diketahui di buku sumber
    assert sorted(flagged) == ["bubur-sup-ayam-kacang-merah", "nasi-bakar-ikan-tongkol-pepaya"]


def test_allergen_detection():
    comp = comps()
    by = {r["slug"]: r for r in RECIPES}
    rec, _ = bs.recipe_record(by["nasi-sup-tabas-udang-sayur"], comp)
    assert {"ikan", "udang/krustasea", "telur", "wijen", "kedelai"} <= set(rec["allergen_tags"])
    rec, _ = bs.recipe_record(by["mie-kukus-telur-puyuh"], comp)
    assert {"telur", "susu", "gandum"} <= set(rec["allergen_tags"])


def test_committed_seed_is_up_to_date():
    before = SEED.read_text(encoding="utf-8")
    subprocess.run([sys.executable, str(ND / "build_seed.py")], check=True, cwd=ND, capture_output=True)
    assert SEED.read_text(encoding="utf-8") == before, "seed SQL tidak sinkron; jalankan build_seed.py lalu commit"


def _csv(name):
    import csv
    with (ND / "sources" / name).open(encoding="utf-8") as fh:
        return list(csv.DictReader(l for l in fh if not l.startswith("#")))


def test_tkpi_appendix_complete_and_consistent():
    comp = bs.load_tkpi()
    idx, glo, cm = _csv("tkpi2017_index.csv"), _csv("tkpi2017_glossary.csv"), _csv("tkpi2017_code_map.csv")
    # jumlah = jumlah kode yang muncul di teks halaman masing-masing bab
    assert (len(idx), len(glo), len(cm)) == (623, 238, 1149)
    assert {r["kode"] for r in idx} <= set(comp) and {r["kode"] for r in glo} <= set(comp)
    # setiap bahan mentah (R) punya entri indeks
    assert {k for k in comp if k[1] == "R"} <= {r["kode"] for r in idx}
    # semua kode komposisi muncul di peta kode (termasuk 2 baris yang diambil dari teks)
    assert set(comp) <= {r["kode_baru"] for r in cm}
    # inkonsistensi yang tercetak di buku sumber, sengaja dipertahankan apa adanya
    by_new = {}
    for r in cm:
        by_new.setdefault(r["kode_baru"], []).append(r)
    assert len(by_new["AR001"]) == 2                                      # baris dobel tercetak di hlm. 116
    assert by_new["HR010"][0]["nama"].startswith("Telur burung puyuh")   # Bab 7 tertukar dengan Bab 4/5
    assert comp["HR011"]["nama"].startswith("Telur burung puyuh")
    assert "HP008" in by_new and "HP008" not in comp                      # tidak punya data komposisi
    assert {r["kode"]: r for r in idx}["DR008"]["spesies"] == "Amaranthus tricolor"
