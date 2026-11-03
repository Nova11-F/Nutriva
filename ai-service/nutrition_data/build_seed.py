"""
Bangun seed Supabase `foods` dan `recipes` Nutriva dari sumber yang dapat ditelusuri.

Sumber (prioritas)
  1. TKPI 2017 (Kemenkes RI, 2018; ISBN 978-602-416-407-2) -> sources/tkpi2017.csv (tools/extract_tkpi.py)
  2. USDA SR28 (2015, domain publik) -> sources/sr28_subset.csv, dipakai bila bahan tidak ada di TKPI
     atau baris TKPI gagal uji konsistensi (Atwater > 20% / proksimat di luar 100 +/- 3 g).
  Besi: bila TKPI dan USDA berbeda > 5x, dipakai USDA dan dicatat (nilai TKPI perlu verifikasi).
  recipes : Buku resep resmi Kemenkes RI 2022 & 2023 (lihat recipes_kemenkes.py).
  Seluruh baris TKPI lain yang lolos uji ikut di-seed sebagai bahan yang bisa dicari (kode TKPI_<kode>).

Pemakaian
  python build_seed.py                          # pakai sources/sr28_subset.csv
  python build_seed.py --abbrev /path/ABBREV.txt   # regenerasi subset dari file SR28 lengkap

Keluaran
  ../../supabase/seed/nutrition_seed.sql   (idempotent, upsert by code/slug)
  REPORT.md                                (QA: cakupan, plausibilitas, energi tercetak vs estimasi)
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

from recipes_kemenkes import AGE_GUIDE, RECIPES, SOURCES

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
SUBSET = HERE / "sources/sr28_subset.csv"
TKPI = HERE / "sources/tkpi2017.csv"
TKPI_CITATION = "Kemenkes RI (2018). Tabel Komposisi Pangan Indonesia 2017. ISBN 978-602-416-407-2."
TKPI_GROUP = {"A": "makanan pokok", "B": "makanan pokok", "C": "lauk nabati", "D": "sayuran", "E": "buah",
              "F": "lauk hewani", "G": "lauk hewani", "H": "lauk hewani", "J": "susu", "K": "lemak",
              "M": "gula & konfeksioneri", "N": "bumbu", "Q": "minuman"}
IRON_RATIO_LIMIT = 5.0
SQL_OUT = REPO / "supabase/seed/nutrition_seed.sql"
REPORT = HERE / "REPORT.md"

SR28_COLS = ("NDB_No Shrt_Desc Water Energ_Kcal Protein Lipid_Tot Ash Carbohydrt Fiber_TD Sugar_Tot Calcium Iron "
             "Magnesium Phosphorus Potassium Sodium Zinc Copper Manganese Selenium Vit_C Thiamin Riboflavin Niacin "
             "Panto_Acid Vit_B6 Folate_Tot Folic_Acid Food_Folate Folate_DFE Choline_Tot Vit_B12 Vit_A_IU Vit_A_RAE "
             "Retinol Alpha_Carot Beta_Carot Beta_Crypt Lycopene LutZea Vit_E Vit_D_mcg Vit_D_IU Vit_K FA_Sat FA_Mono "
             "FA_Poly Cholestrl GmWt_1 GmWt_Desc1 GmWt_2 GmWt_Desc2 Refuse_Pct").split()
KEEP = {"Energ_Kcal": "energy_kcal", "Protein": "protein_g", "Lipid_Tot": "fat_g", "Carbohydrt": "carbs_g",
        "Fiber_TD": "fiber_g", "Calcium": "calcium_mg", "Iron": "iron_mg", "Zinc": "zinc_mg", "Vit_A_RAE": "vit_a_rae_mcg"}
SR28_CITATION = ("US Department of Agriculture, Agricultural Research Service, Nutrient Data Laboratory (2015). "
                 "USDA National Nutrient Database for Standard Reference, Release 28.")

# Alergen utama (mengacu daftar Codex/FDA 'big 9' + moluska), label Bahasa Indonesia
ALLERGEN_BY_CODE = {
    "TELUR_AYAM": "telur", "TELUR_PUYUH": "telur", "MIE_TELUR": ["telur", "gandum"],
    "IKAN_KEMBUNG": "ikan", "IKAN_LELE": "ikan", "IKAN_NILA": "ikan", "IKAN_MUJAIR": "ikan", "IKAN_TUNA": "ikan",
    "IKAN_TONGKOL": "ikan", "IKAN_TENGGIRI": "ikan", "IKAN_KAKAP": "ikan", "UDANG": "udang/krustasea",
    "SUSU_SAPI": "susu", "KEJU_CHEDDAR": "susu", "YOGURT": "susu", "MENTEGA": "susu",
    "TEMPE": "kedelai", "TAHU": "kedelai", "KECAP_ASIN": ["kedelai", "gandum"],
    "TEPUNG_TERIGU": "gandum", "TEPUNG_ROTI": "gandum", "ROTI_TAWAR": "gandum", "KACANG_TANAH": "kacang tanah",
}
ALLERGEN_BY_TEXT = {"ikan": "ikan", "putih telur": "telur", "minyak wijen": "wijen", "saos tiram": "moluska",
                    "kecap manis": "kedelai", "rabuk ikan": "ikan", "kecap ikan": "ikan", "tepung bumbu": "gandum",
                    "susu": "susu", "keju": "susu", "mie instan": "gandum"}

PREMIUM = {"DAGING_SAPI", "UDANG", "IKAN_TENGGIRI", "IKAN_TUNA", "KEJU_CHEDDAR"}
CHICKEN = {"DAGING_AYAM", "DADA_AYAM", "AYAM_GILING"}


# ----------------------------------------------------------------------------- foods
def build_subset(abbrev: Path, ndbs: set[str]) -> None:
    raw = abbrev.read_bytes()
    sha = hashlib.sha256(raw).hexdigest()
    rows = []
    for line in raw.decode("latin-1").splitlines():
        f = [x.strip("~") for x in line.split("^")]
        if f[0] in ndbs:
            d = dict(zip(SR28_COLS, f))
            rows.append({"ndb_no": f[0], "description": d["Shrt_Desc"], **{v: d[k] for k, v in KEEP.items()}})
    missing = ndbs - {r["ndb_no"] for r in rows}
    if missing:
        raise SystemExit(f"NDB tidak ditemukan di SR28: {sorted(missing)}")
    SUBSET.parent.mkdir(parents=True, exist_ok=True)
    with SUBSET.open("w", newline="", encoding="utf-8") as fh:
        fh.write(f"# source: {SR28_CITATION} File ABBREV.txt sha256={sha}\n")
        w = csv.DictWriter(fh, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(sorted(rows, key=lambda r: r["ndb_no"]))


def load_subset() -> dict[str, dict]:
    with SUBSET.open(encoding="utf-8") as fh:
        lines = [l for l in fh if not l.startswith("#")]
    out = {}
    for r in csv.DictReader(lines):
        out[r["ndb_no"]] = {k: (float(v) if v not in ("", None) and k not in ("ndb_no", "description") else
                                (v if k in ("ndb_no", "description") else None)) for k, v in r.items()}
    return out


def load_tkpi_index() -> dict[str, dict]:
    """Bab 5 Indeks TKPI: nama Latin & nama Inggris (dicetak apa adanya, termasuk salah ketik sumber)."""
    p = HERE / "sources/tkpi2017_index.csv"
    with p.open(encoding="utf-8") as fh:
        return {r["kode"]: r for r in csv.DictReader(l for l in fh if not l.startswith("#"))}


def load_tkpi() -> dict[str, dict]:
    with TKPI.open(encoding="utf-8") as fh:
        rows = list(csv.DictReader(l for l in fh if not l.startswith("#")))
    return {r["kode"]: r for r in rows}


def _f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def tkpi_ok(r: dict) -> tuple[bool, str]:
    if any(_f(r.get(k)) is None for k in ("energi_kal", "protein_g", "lemak_g", "kh_g")):
        return False, "makronutrien tidak lengkap"
    if _f(r["atwater_dev_pct"]) is not None and _f(r["atwater_dev_pct"]) > 20:
        return False, f"energi tidak konsisten dengan P/L/KH (selisih {r['atwater_dev_pct']}%)"
    if _f(r["proximate_sum"]) is not None and abs(_f(r["proximate_sum"]) - 100) > 3:
        return False, f"jumlah proksimat {r['proximate_sum']} g (bukan ~100 g)"
    return True, ""


def composition(c: dict, tk: dict, sr: dict) -> dict:
    """Komposisi per 100 g BDD untuk satu bahan katalog, dengan jejak sumber per nilai."""
    notes = []
    row = tk.get(c.get("tkpi_code") or "")
    usda = sr.get(c.get("ndb_no") or "")
    if row:
        ok, why = tkpi_ok(row)
        if not ok:
            notes.append(f"TKPI {row['kode']} tidak dipakai: {why}")
            row = None
    if row:
        out = {"energy_kcal": _f(row["energi_kal"]), "protein_g": _f(row["protein_g"]), "fat_g": _f(row["lemak_g"]),
               "carbs_g": _f(row["kh_g"]), "iron_mg": _f(row["besi_mg"]),
               "extra": {"fiber_g": _f(row["serat_g"]), "calcium_mg": _f(row["kalsium_mg"]), "zinc_mg": _f(row["seng_mg"]),
                         "retinol_mcg": _f(row["retinol_mcg"]), "beta_carotene_mcg": _f(row["bkar_mcg"]),
                         "vit_c_mg": _f(row["vitc_mg"]), "edible_portion_pct": _f(row["bdd_pct"])},
               "source": f"TKPI 2017 {row['kode']} ({row['nama']}; data asal {row['sumber']})"}
        fe_u = usda["iron_mg"] if usda else None
        fe_t = out["iron_mg"]
        if fe_u and fe_t is not None and fe_t > 0 and max(fe_t / fe_u, fe_u / fe_t) > IRON_RATIO_LIMIT:
            notes.append(f"Besi TKPI {fe_t:g} mg berbeda >{IRON_RATIO_LIMIT:g}x dari USDA {fe_u:g} mg; dipakai USDA "
                         "sampai diverifikasi ahli gizi")
            out["iron_mg"] = fe_u
            out["extra"]["iron_source"] = f"USDA SR28 {c['ndb_no']}"
        elif fe_t is None and fe_u is not None:
            out["iron_mg"] = fe_u
            out["extra"]["iron_source"] = f"USDA SR28 {c['ndb_no']} (TKPI kosong)"
    elif usda:
        out = {k: usda[k] for k in ("energy_kcal", "protein_g", "fat_g", "carbs_g", "iron_mg")}
        out["extra"] = {k: usda[k] for k in ("fiber_g", "calcium_mg", "zinc_mg", "vit_a_rae_mcg")}
        out["source"] = f"USDA SR28 NDB {c['ndb_no']} ({usda['description']})"
    else:
        raise SystemExit(f"Tidak ada sumber komposisi untuk {c['code']}")
    out["notes"] = notes
    return out


def load_catalog() -> list[dict]:
    with (HERE / "foods_catalog.csv").open(encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def servings(spec: str) -> list[dict]:
    out = [{"label": "100 gram", "grams": 100}]
    for part in filter(None, (spec or "").split("|")):
        label, grams = part.rsplit("=", 1)
        out.append({"label": label.strip(), "grams": float(grams)})
    return out


# ----------------------------------------------------------------------------- recipes
def plausible(e: float, p: float, f: float) -> bool:
    """Energi dari protein+lemak (faktor Atwater 4/9) tidak boleh melebihi energi total (toleransi 5%)."""
    return 4 * p + 9 * f <= e * 1.05


def recipe_record(r: dict, comp: dict) -> tuple[dict, dict]:
    n = r["portions"]
    tot = {"energy_kcal": 0.0, "protein_g": 0.0, "fat_g": 0.0, "carbs_g": 0.0, "iron_mg": 0.0}
    g_mapped = g_known = g_iron = 0.0
    unmapped = []
    for text, code, grams in r["ingredients"]:
        if grams is None:
            if code or text:
                unmapped.append(text)
            continue
        g_known += grams
        if code is None:
            unmapped.append(text)
            continue
        cp = comp[code]
        for k in tot:
            tot[k] += (cp[k] or 0) * grams / 100
        g_mapped += grams
        if cp["iron_mg"] is not None:
            g_iron += grams
    est = {k: v / n for k, v in tot.items()}

    e, p, f = r["printed"]
    printed_ok = plausible(e, p, f) and not r.get("printed_suspect")
    if printed_ok:
        energy, protein, fat = e, p, f
        carbs = max(0.0, (e - 4 * p - 9 * f) / 4)
        basis = {"energy_protein_fat": "tercetak (Kemenkes)", "carbs": "turunan Atwater dari nilai tercetak"}
    else:
        energy, protein, fat, carbs = est["energy_kcal"], est["protein_g"], est["fat_g"], est["carbs_g"]
        basis = {"energy_protein_fat": "estimasi dari bahan (TKPI/USDA); nilai tercetak tidak plausibel",
                 "carbs": "estimasi dari bahan (TKPI/USDA)"}
    coverage = round(100 * g_mapped / g_known, 1) if g_known else 0.0
    iron_cov = round(100 * g_iron / g_known, 1) if g_known else 0.0
    # Besi hanya ditampilkan bila >= 80% berat bahan bergramasi punya data komposisi (selain itu terlalu bias rendah)
    iron = round(est["iron_mg"], 1) if iron_cov >= 80 else None
    basis["iron"] = ("estimasi dari bahan bergramasi (TKPI/USDA), batas bawah" if iron is not None
                     else "tidak dihitung: cakupan data bahan < 80%")
    notes = [r.get("note")] if r.get("note") else []
    ratio = est["energy_kcal"] / e if e else 0
    if printed_ok and coverage >= 90 and ratio > 1.5:
        notes.append(f"Energi 1/{n} resep menurut estimasi bahan ({est['energy_kcal']:.0f} kkal) jauh di atas nilai tercetak "
                     f"({e:g} kkal); porsi yang dimaksud buku kemungkinan lebih kecil dari 1/{n} resep. Perlu review ahli gizi.")
        iron = None   # besi per 1/n resep tidak sebanding dengan porsi tercetak
        basis["iron"] = "tidak dihitung: ukuran porsi tercetak tidak konsisten dengan resep"

    codes = {c for _, c, _ in r["ingredients"] if c}
    allergens = set()
    for c in codes:
        a = ALLERGEN_BY_CODE.get(c)
        allergens.update(a if isinstance(a, list) else ([a] if a else []))
    for text, code, _ in r["ingredients"]:
        if code is None:
            low = text.lower()
            allergens.update(v for k, v in ALLERGEN_BY_TEXT.items() if k in low)

    if codes & PREMIUM:
        tier = "premium"
    elif codes & CHICKEN:
        tier = "sedang"
    else:
        tier = "ekonomis"

    g = AGE_GUIDE[r["age"]]
    freq = g["frequency"] if r["kind"] == "utama" else (
        "Selingan: 1-2 kali/hari" if r["kind"] == "selingan" else "Lauk pendamping makan utama")
    src = SOURCES[r["src"]]
    rec = {
        "title": r["title"], "slug": r["slug"], "image_url": None,
        "min_age_months": r["age"][0], "max_age_months": r["age"][1], "budget_tier": tier,
        "portion_size": f"{g['portion']} · resep untuk {n} porsi" if r["kind"] == "utama" else f"Resep untuk {n} porsi",
        "meal_frequency": freq,
        "main_nutrients": {
            "per": "1 porsi",
            "calories": round(energy), "calories_kcal": round(energy, 1), "protein_g": round(protein, 1),
            "fat_g": round(fat, 1), "carbs_g": round(carbs, 1), "iron_mg": iron,
            "iron_coverage_pct": iron_cov, "texture": g["texture"], "basis": basis,
        },
        "ingredients": [t for t, _, _ in r["ingredients"]],
        "allergen_tags": sorted(allergens),
        "instructions": [{"step": i + 1, "text": s} for i, s in enumerate(r["steps"])],
        "source_authority": f"{src['citation']} hlm. {r['page']}",
        "validated_by": "Belum divalidasi ahli gizi Nutriva",
        "source_reference": src["url"],
        "data_notes": " ".join(notes) or None,
    }
    qa = {"slug": r["slug"], "src": f"{r['src']} hlm.{r['page']}", "printed": (e, p, f), "printed_ok": printed_ok,
          "est": est, "coverage": coverage, "unmapped": unmapped, "flag": len(notes) > (1 if r.get("note") else 0)}
    return rec, qa


# ----------------------------------------------------------------------------- SQL
def q(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        return repr(round(v, 2)) if isinstance(v, float) else str(v)
    return "'" + str(v).replace("'", "''") + "'"


def qjson(v) -> str:
    return q(json.dumps(v, ensure_ascii=False)) + "::jsonb"


def qarr(v: list[str]) -> str:
    return "ARRAY[" + ",".join(q(x) for x in v) + "]::text[]" if v else "'{}'::text[]"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--abbrev", type=Path, help="path ABBREV.txt SR28 lengkap untuk regenerasi subset")
    args = ap.parse_args()
    catalog = load_catalog()
    if args.abbrev:
        build_subset(args.abbrev, {c["ndb_no"] for c in catalog if c["ndb_no"]})
    sr = load_subset()
    tk = load_tkpi()
    tidx = load_tkpi_index()
    cat = {c["code"]: c for c in catalog}

    # validasi katalog
    for c in catalog:
        assert c["ndb_no"] in sr or c["tkpi_code"] in tk, c
        assert not c["ndb_no"] or c["ndb_no"] in sr, c
        assert not c["tkpi_code"] or c["tkpi_code"] in tk, c
        assert c["match_quality"] in {"exact", "close", "proxy"}, c
    for r in RECIPES:
        for _, code, _ in r["ingredients"]:
            assert code is None or code in cat, (r["slug"], code)

    comp = {c["code"]: composition(c, tk, sr) for c in catalog}

    def food_row(code, name, prep, category, serv, cp, mq, note, tkpi_code=""):
        ix = tidx.get(tkpi_code or "", {})
        return "(" + ", ".join([q(ix.get("spesies") or None), q(ix.get("nama_inggris") or None),
            q(code), q(name), q(prep), q(category), qjson(serv), q(cp["energy_kcal"]), q(cp["protein_g"]),
            q(cp["fat_g"]), q(cp["carbs_g"]), q(cp["iron_mg"]), qjson(cp["extra"]), q(cp["source"]), q(mq),
            q(" ".join(x for x in [note, *cp["notes"]] if x) or None),
        ]) + ")"

    foods_sql, recipes_sql = [], []
    for c in catalog:
        foods_sql.append(food_row(c["code"], c["name"], c["preparation_type"], c["category"], servings(c["servings"]),
                                  comp[c["code"]], c["match_quality"], c["note"] or None, c["tkpi_code"]))
    used = {c["tkpi_code"] for c in catalog if c["tkpi_code"]}
    tkpi_extra, tkpi_rejected = 0, []
    for kode, row in tk.items():
        if kode in used:
            continue
        ok, why = tkpi_ok(row)
        if not ok:
            tkpi_rejected.append((kode, row["nama"], why))
            continue
        pseudo = {"code": f"TKPI_{kode}", "tkpi_code": kode, "ndb_no": ""}
        cp = composition(pseudo, tk, sr)
        prep = "mentah/segar" if kode[1] == "R" else "olahan"
        foods_sql.append(food_row(f"TKPI_{kode}", row["nama"], prep, TKPI_GROUP.get(kode[0], "lainnya"),
                                  servings(""), cp, "exact", None, kode))
        tkpi_extra += 1

    qas = []
    for r in RECIPES:
        rec, qa = recipe_record(r, comp)
        qas.append(qa)
        recipes_sql.append("(" + ", ".join([
            q(rec["title"]), q(rec["slug"]), q(rec["image_url"]), q(rec["min_age_months"]), q(rec["max_age_months"]),
            q(rec["budget_tier"]), q(rec["portion_size"]), q(rec["meal_frequency"]), qjson(rec["main_nutrients"]),
            qarr(rec["ingredients"]), qarr(rec["allergen_tags"]), qjson(rec["instructions"]), q(rec["source_authority"]),
            q(rec["validated_by"]), q(rec["source_reference"]), q(rec["data_notes"]),
        ]) + ")")

    SQL_OUT.parent.mkdir(parents=True, exist_ok=True)
    SQL_OUT.write_text(f"""-- =============================================================================
-- Nutriva nutrition seed (DIHASILKAN OTOMATIS oleh ai-service/nutrition_data/build_seed.py — jangan edit manual)
-- Prasyarat: supabase_schema.sql + supabase/migrations/20261103b_nutrition_data.sql
-- foods   : {len(foods_sql)} bahan per 100 g BDD: {len(catalog)} bahan kurasi (dengan ukuran rumah tangga) + {tkpi_extra} bahan TKPI lain
--           Sumber utama {TKPI_CITATION} Pelengkap: {SR28_CITATION}
-- recipes : {len(recipes_sql)} resep balita dari buku resep resmi Kemenkes RI 2022 dan 2023
-- Status  : BELUM divalidasi ahli gizi Nutriva (lihat kolom validated_by).
-- Idempotent: upsert berdasarkan foods.code dan recipes.slug.
-- =============================================================================

INSERT INTO public.foods (scientific_name, name_en, code, name, preparation_type, category, serving_options, calories_per_100g, protein_per_100g,
  fat_per_100g, carbs_per_100g, iron_mg_per_100g, extra_nutrients_per_100g, source, match_quality, data_notes)
VALUES
{(","+chr(10)).join(foods_sql)}
ON CONFLICT (code) DO UPDATE SET
  scientific_name = EXCLUDED.scientific_name, name_en = EXCLUDED.name_en, name = EXCLUDED.name, preparation_type = EXCLUDED.preparation_type, category = EXCLUDED.category,
  serving_options = EXCLUDED.serving_options, calories_per_100g = EXCLUDED.calories_per_100g,
  protein_per_100g = EXCLUDED.protein_per_100g, fat_per_100g = EXCLUDED.fat_per_100g,
  carbs_per_100g = EXCLUDED.carbs_per_100g, iron_mg_per_100g = EXCLUDED.iron_mg_per_100g,
  extra_nutrients_per_100g = EXCLUDED.extra_nutrients_per_100g, source = EXCLUDED.source,
  match_quality = EXCLUDED.match_quality, data_notes = EXCLUDED.data_notes;

INSERT INTO public.recipes (title, slug, image_url, min_age_months, max_age_months, budget_tier, portion_size,
  meal_frequency, main_nutrients, ingredients, allergen_tags, instructions, source_authority, validated_by,
  source_reference, data_notes)
VALUES
{(","+chr(10)).join(recipes_sql)}
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, min_age_months = EXCLUDED.min_age_months, max_age_months = EXCLUDED.max_age_months,
  budget_tier = EXCLUDED.budget_tier, portion_size = EXCLUDED.portion_size, meal_frequency = EXCLUDED.meal_frequency,
  main_nutrients = EXCLUDED.main_nutrients, ingredients = EXCLUDED.ingredients, allergen_tags = EXCLUDED.allergen_tags,
  instructions = EXCLUDED.instructions, source_authority = EXCLUDED.source_authority,
  validated_by = EXCLUDED.validated_by, source_reference = EXCLUDED.source_reference, data_notes = EXCLUDED.data_notes;
""", encoding="utf-8")

    write_report(catalog, comp, qas, tkpi_extra, tkpi_rejected)
    print(f"foods={len(foods_sql)} recipes={len(recipes_sql)} -> {SQL_OUT.relative_to(REPO)}")


def write_report(catalog, comp, qas, tkpi_extra, tkpi_rejected) -> None:
    mq = {k: sum(1 for c in catalog if c["match_quality"] == k) for k in ("exact", "close", "proxy")}
    src_t = sum(1 for c in catalog if comp[c["code"]]["source"].startswith("TKPI"))
    ok = [x for x in qas if x["printed_ok"]]
    ape = sorted(abs(x["est"]["energy_kcal"] - x["printed"][0]) / x["printed"][0] * 100 for x in ok)
    med = ape[len(ape) // 2] if ape else float("nan")
    full = sorted(abs(x["est"]["energy_kcal"] - x["printed"][0]) / x["printed"][0] * 100
                  for x in ok if x["coverage"] >= 95)
    med_full = full[len(full) // 2] if full else float("nan")
    lines = [
        "# Laporan QA seed nutrisi Nutriva", "",
        "Dihasilkan otomatis oleh `build_seed.py`. Angka di bawah dihitung ulang setiap build.", "",
        "## Foods", "",
        f"- {len(catalog)} bahan kurasi: sumber TKPI 2017 {src_t}, USDA SR28 {len(catalog) - src_t}. "
        f"Kecocokan nama/jenis: exact {mq['exact']}, close {mq['close']}, proxy {mq['proxy']}.",
        f"- {tkpi_extra} bahan TKPI lain lolos uji dan ikut di-seed untuk pencarian (kode `TKPI_<kode>`, ukuran 100 g).",
        f"- {len(tkpi_rejected)} baris TKPI ditolak uji konsistensi (Atwater > 20% atau proksimat di luar 100 +/- 3 g). "
        "Nilai sumber tidak diubah; baris ini hanya tidak di-seed.", "",
        "### Catatan per bahan kurasi", "", "| kode | sumber | catatan |", "|---|---|---|",
    ]
    for c in catalog:
        cp = comp[c["code"]]
        if cp["notes"] or not cp["source"].startswith("TKPI"):
            lines.append(f"| {c['code']} | {cp['source']} | {' '.join(cp['notes']) or c['note']} |")
    lines += ["", "### Baris TKPI yang ditolak", "", "| kode | nama | alasan |", "|---|---|---|"]
    lines += [f"| {k} | {n} | {w} |" for k, n, w in tkpi_rejected]
    lines += ["", "## Recipes", "",
              f"- {len(qas)} resep; nilai tercetak plausibel: {len(ok)}; diganti estimasi bahan: {len(qas) - len(ok)}.",
              f"- Energi estimasi-dari-bahan vs tercetak: median selisih absolut {med:.0f}% (n = {len(ape)}); "
              f"untuk resep dengan cakupan gram >= 95%: {med_full:.0f}% (n = {len(full)}). Estimasi cenderung lebih rendah "
              "karena minyak goreng, kaldu, dan bumbu tanpa gram tidak ikut dihitung.", "",
              "| resep | sumber | E/P/L tercetak | E/P/L estimasi | plausibel | cakupan gram (%) | cek porsi |",
              "|---|---|---|---|---|---|---|"]
    for x in qas:
        e, p, f = x["printed"]
        s = x["est"]
        lines.append(f"| {x['slug']} | {x['src']} | {e:g}/{p:g}/{f:g} | {s['energy_kcal']:.0f}/{s['protein_g']:.1f}/"
                     f"{s['fat_g']:.1f} | {'ya' if x['printed_ok'] else 'TIDAK'} | {x['coverage']} | {'PERIKSA' if x['flag'] else ''} |")
    lines += ["", "`cakupan gram` = persen berat bahan bergramasi yang punya komposisi di katalog; besi resep adalah "
              "estimasi dari bagian itu saja (batas bawah)."]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
