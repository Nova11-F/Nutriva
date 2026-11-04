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
FALLBACK = {"answer": ("Maaf, asisten sedang tidak dapat menjawab. Silakan coba lagi nanti atau tanyakan "
                       "langsung ke bidan / kader Posyandu."),
            "actions": [], "sources": [], "refer_to_professional": False}


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
        resp = dict(FALLBACK)
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
