"""Orkestrasi AI Nutrition Assistant:
  pertanyaan -> safety pre-check -> (growth assessment) -> retrieve -> LLM -> parse JSON -> post-check
"""
from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path

from .config import ROOT, LLMConfig
from .knowledge import retrieve
from .prompts import PROMPT_VERSION, SYSTEM_PROMPT, build_user_message
from .providers import LLMError, complete
from .safety import DOSAGE_TEMPLATE, EMERGENCY_TEMPLATE, postcheck, precheck, violations

sys.path.insert(0, str(ROOT / "src"))

DISCLAIMER = ("Jawaban ini bersifat edukasi dan tidak menggantikan pemeriksaan tenaga kesehatan. "
              "Untuk kondisi darurat, segera ke fasilitas kesehatan terdekat.")

TOPIC_FALLBACKS = [
    {
        "keywords": ["mpasi", "menu", "makan", "resep", "porsi", "jadwal"],
        "answer": (
            "Untuk MPASI, pastikan memenuhi prinsip gizi seimbang: karbohidrat (beras/ubi/kentang), "
            "protein hewani utama (telur, ayam, hati ayam, ikan, atau daging), lemak tambahan (minyak kelapa, "
            "santan, atau mentega), serta sedikit sayur sebagai pengenalan serat. Tekstur disesuaikan usia: "
            "halus (puree/bubur saring) untuk 6-8 bulan, cincang halus/kasar untuk 9-11 bulan, dan makanan "
            "keluarga setelah 12 bulan. Rekomendasi resep lengkap dapat Anda temukan di menu Nutrisi."
        ),
        "actions": ["Berikan protein hewani di setiap jadwal makan", "Atur jadwal 3x makan utama & 2x camilan"],
        "sources": ["Pedoman PMBA Kemenkes RI & WHO", "Buku KIA Kemenkes RI"],
    },
    {
        "keywords": ["susah makan", "tidak mau makan", "gtm", "lepeh", "tutup mulut"],
        "answer": (
            "Mengatasi anak susah makan (GTM) dapat dilakukan dengan feeding rules: terapkan jadwal makan "
            "teratur (maksimal 30 menit per sesi), ciptakan suasana makan yang menyenangkan tanpa paksaan dan "
            "tanpa gawai/distraksi layar. Sajikan porsi kecil namun sering, dan kombinasikan variasi protein "
            "hewani kesukaan anak. Bila berat badan anak tidak naik selama 2 bulan berturut-turut, konsultasikan "
            "ke dokter spesialis anak atau Posyandu."
        ),
        "actions": ["Terapkan feeding rules tanpa paksaan", "Batasi waktu makan maksimal 30 menit"],
        "sources": ["Buku Bagan MTBS Kemenkes RI", "Pedoman Gizi Seimbang Anak"],
    },
    {
        "keywords": ["stunting", "pendek", "tumbuh", "kurus", "z-score", "berat", "tinggi"],
        "answer": (
            "Stunting adalah gangguan pertumbuhan linear pada balita akibat kekurangan asupan gizi kronis atau "
            "infeksi berulang. Tanda utamanya adalah panjang/tinggi badan berada di bawah -2 Standar Deviasi (-2 SD) "
            "pada kurva pertumbuhan WHO. Pemantauan rutin berat badan dan tinggi badan setiap bulan di Posyandu "
            "sangat krusial untuk deteksi dini stunting dan growth faltering."
        ),
        "actions": ["Timbang dan ukur tinggi anak rutin setiap bulan di Posyandu", "Cukupi kebutuhan protein hewani harian"],
        "sources": ["Standar Antropometri Anak Kemenkes RI 2020", "Pedoman Pencegahan Stunting WHO"],
    },
    {
        "keywords": ["protein", "hewani", "telur", "ikan", "daging", "ayam", "hati"],
        "answer": (
            "Protein hewani adalah kunci pencegahan stunting pada balita karena mengandung asam amino esensial lengkap "
            "serta mikronutrien tinggi seperti zat besi, seng (zinc), dan vitamin B12. Contoh sumber protein hewani "
            "terbaik dan terjangkau: telur ayam, hati ayam/sapi, ikan lokal (kembung, lele, gabus), serta daging ayam/sapi. "
            "Dianjurkan menyajikan minimal satu jenis protein hewani pada setiap sesi makan anak."
        ),
        "actions": ["Berikan minimal satu jenis protein hewani setiap kali makan", "Prioritaskan telur dan hati ayam"],
        "sources": ["Pedoman Gizi Seimbang Kemenkes RI", "WHO Infant Feeding Guidelines"],
    },
    {
        "keywords": ["posyandu", "dokter", "periksa", "imunisasi", "obat", "demam", "diare"],
        "answer": (
            "Bawalah anak ke Posyandu setiap bulan untuk memantau grafik tumbuh kembang pada buku KIA. "
            "Segera periksakan ke Puskesmas atau Dokter Anak jika anak mengalami tanda bahaya: demam tinggi lebih "
            "dari 3 hari, diare disertai muntah terus-menerus, sesak napas, lemas dan tidak mau minum, atau "
            "kenaikan berat badan tidak mencapai target (tidak naik/garis kuning di KMS)."
        ),
        "actions": ["Pantau grafik KMS setiap bulan", "Segera bawa ke fasilitas kesehatan jika ada tanda bahaya"],
        "sources": ["Buku Bagan MTBS Kemenkes RI", "Buku KIA Kemenkes RI"],
        "refer_to_professional": True,
    },
]

FALLBACK = {
    "answer": (
        "Sebagai panduan nutrisi balita berstandar Kemenkes RI dan WHO: prioritaskan makanan padat gizi "
        "dengan kecukupan karbohidrat, protein hewani (telur, ikan, daging, ayam), lemak sehat, serta vitamin & mineral. "
        "Pastikan kebersihan makanan dan pantau rutin grafik pertumbuhan setiap bulan di Posyandu."
    ),
    "actions": ["Terapkan gizi seimbang harian", "Pantau pertumbuhan di Posyandu"],
    "sources": ["Pedoman Gizi Seimbang Kemenkes RI", "WHO Infant Feeding Guidelines"],
    "refer_to_professional": False,
}


def get_fallback_response(question: str, child_profile: dict | None = None, hits: list | None = None) -> dict:
    q = (question or "").lower()
    child_name = (child_profile or {}).get("name")
    greeting = f"Halo Ayah dan Bunda! Terkait si kecil {child_name}, " if child_name else "Halo Ayah dan Bunda! "
    for item in TOPIC_FALLBACKS:
        if any(kw in q for kw in item["keywords"]):
            ans = greeting + item["answer"]
            sources = list(item["sources"])
            if hits:
                for c, _ in hits:
                    cite = c.cite()
                    if cite not in sources:
                        sources.append(cite)
            return {
                "answer": ans,
                "actions": list(item.get("actions", [])),
                "sources": sources,
                "refer_to_professional": item.get("refer_to_professional", False),
            }
    ans = greeting + FALLBACK["answer"]
    return {
        "answer": ans,
        "actions": list(FALLBACK["actions"]),
        "sources": list(FALLBACK["sources"]),
        "refer_to_professional": False,
    }


def _parse_json(text: str) -> dict:
    t = text.strip()
    t = re.sub(r"^```(?:json)?\s*|\s*```$", "", t)          # buang code fence jika model menambahkannya
    m = re.search(r"\{.*\}", t, flags=re.S)
    if not m:
        raise ValueError("tidak ada objek JSON di balasan")
    d = json.loads(m.group(0))
    out = {"answer": str(d.get("answer", "")).strip(),
           "actions": [str(a) for a in d.get("actions", []) if str(a).strip()][:3],
           "sources": [str(s) for s in d.get("sources", [])],
           "refer_to_professional": bool(d.get("refer_to_professional", False))}
    if not out["answer"]:
        raise ValueError("field answer kosong")
    return out


def ask(question: str, child_profile: dict | None = None, growth_input: dict | None = None,
        cfg: LLMConfig | None = None, history: list[dict] | None = None) -> dict:
    cfg = cfg or LLMConfig.from_env()
    t0 = time.perf_counter()
    question = (question or "").strip()[:1000]
    route = precheck(question)
    prev_user = next((h.get("text", "") for h in reversed(history or []) if h.get("role") == "user"), "")
    if route == "off_topic" and prev_user and precheck(f"{prev_user[:300]} {question}") == "normal":
        route = "normal"   # pertanyaan lanjutan pendek ("kalau 9 bulan?") mewarisi topik sebelumnya
    meta = {"route": route, "provider": cfg.provider, "model": cfg.model, "prompt_version": PROMPT_VERSION,
            "llm_called": False, "guardrail_flags": [], "retrieved": [], "usage": {}}

    if route in {"emergency", "dosage"}:
        resp = dict(EMERGENCY_TEMPLATE if route == "emergency" else DOSAGE_TEMPLATE)
        meta["latency_ms"] = round((time.perf_counter() - t0) * 1000, 1)
        return {**resp, "disclaimer": DISCLAIMER, "meta": meta}

    growth = None
    if growth_input and growth_input.get("child_age_months") is not None and growth_input.get("gender"):
        from inference import predict  # model Sprint 2 (WHO engine + Random Forest)
        growth = predict(growth_input)

    # pertanyaan lanjutan pendek ("kalau 9 bulan?") butuh konteks pertanyaan user sebelumnya untuk retrieval
    query = f"{question} {prev_user[:300]}" if prev_user and len(question.split()) < 8 else question
    hits = retrieve(query, k=cfg.top_k)
    meta["retrieved"] = [{"label": c.cite(), "doc_id": c.doc_id, "score": round(s, 3), "status": c.status}
                         for c, s in hits]
    allowed = list(dict.fromkeys(c.cite() for c, _ in hits))
    src_detail = {c.cite(): c.source for c, _ in hits}
    src_url = {c.cite(): c.url for c, _ in hits}
    user_msg = build_user_message(question, route, child_profile, growth, hits, history)

    resp, raw = None, ""
    for attempt in range(2):                                   # 1x retry jika JSON tidak valid
        try:
            raw, usage = complete(cfg, SYSTEM_PROMPT, user_msg if attempt == 0 else
                                  user_msg + "\n\nPENTING: balas HANYA JSON valid sesuai format.")
            meta["llm_called"], meta["usage"] = True, usage
            resp = _parse_json(raw)
            break
        except (ValueError, json.JSONDecodeError) as e:
            meta["guardrail_flags"].append(f"invalid_json_attempt{attempt + 1}: {e}")
        except (LLMError, Exception) as e:                      # jaringan, auth, rate limit, dll.
            meta["error"] = f"{type(e).__name__}: {str(e)[:300]}"
            break
    # Retry dengan koreksi jika isi melanggar aturan (diagnosis/dosis); jika masih melanggar, postcheck
    # akan mengganti dengan jawaban aman.
    if resp is not None and violations(resp, route):
        v = violations(resp, route)
        meta["guardrail_flags"].append(f"violation_retry: {v}")
        fix = (user_msg + "\n\nJawaban sebelumnya melanggar aturan: " + ", ".join(v) +
               ". Tulis ulang TANPA menyimpulkan status gizi anak (stunting/normal/gizi buruk) dan tanpa dosis. "
               "Jelaskan arti angka secara umum dan arahkan ke tenaga kesehatan. Balas HANYA JSON.")
        try:
            raw2, usage2 = complete(cfg, SYSTEM_PROMPT, fix)
            resp, raw = _parse_json(raw2), raw2
            meta["usage_retry"] = usage2
        except Exception as e:                                  # gagal retry -> postcheck pakai template aman
            meta["guardrail_flags"].append(f"violation_retry_failed: {type(e).__name__}")
    if resp is None:
        resp = get_fallback_response(question, child_profile, hits)
        meta["guardrail_flags"].append("fallback_used")
    else:
        resp, flags = postcheck(resp, allowed, route)
        meta["guardrail_flags"] += flags
        if growth and growth.get("alert") in {"attention", "refer"} and not resp["refer_to_professional"]:
            resp["refer_to_professional"] = True
            meta["guardrail_flags"].append("forced_referral_growth_alert")

    resp["source_details"] = [{"title": t, "reference": src_detail.get(t, "-"), "url": src_url.get(t) or None}
                             for t in resp.get("sources", [])]
    meta["raw_output"] = raw[:2000]
    meta["latency_ms"] = round((time.perf_counter() - t0) * 1000, 1)
    if growth:
        meta["growth_level"], meta["growth_alert"] = growth["level"], growth["alert"]
    return {**resp, "disclaimer": DISCLAIMER, "meta": meta}
