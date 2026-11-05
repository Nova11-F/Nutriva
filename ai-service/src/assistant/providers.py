"""Adapter provider LLM. Semua mengembalikan (teks_balasan, usage_dict).

- gemini            : Google Gemini API (POST {base_url}/models/{model}:generateContent). Base LLM resmi Nutriva.
- openai_compatible : endpoint POST {base_url}/chat/completions (format OpenAI Chat Completions).
                      Dipakai juga oleh banyak provider lain yang menyediakan endpoint kompatibel OpenAI.
- anthropic         : Anthropic Messages API, POST https://api.anthropic.com/v1/messages
- mock              : balasan deterministik untuk test offline (BUKAN output LLM sungguhan)
"""
from __future__ import annotations

import json

import httpx

from .config import LLMConfig


class LLMError(RuntimeError):
    pass


def _gemini(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    """Google Gemini API (generateContent). Base LLM resmi Nutriva.

    Key dikirim via header `x-goog-api-key` (bukan query string) agar tidak bocor ke log URL.
    `LLM_EXTRA_BODY` digabung ke `generationConfig`, mis. {"thinkingConfig": {"thinkingBudget": 0}}.
    """
    if not (cfg.api_key and cfg.model):
        raise LLMError("LLM_API_KEY dan LLM_MODEL wajib diisi untuk gemini")
    base = cfg.base_url or "https://generativelanguage.googleapis.com/v1beta"
    gen: dict = {"maxOutputTokens": cfg.max_tokens}
    if cfg.send_sampling:
        gen.update(temperature=cfg.temperature, topP=cfg.top_p)
    if cfg.json_mode:
        gen["responseMimeType"] = "application/json"
    gen.update(cfg.extra_body)
    body = {"systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": gen}
    headers = {"x-goog-api-key": cfg.api_key, "Content-Type": "application/json", **cfg.extra_headers}
    models_to_try = [cfg.model]
    for m in ["gemini-3.5-flash", "gemini-flash-lite-latest"]:
        if m not in models_to_try:
            models_to_try.append(m)

    last_err = None
    r = None
    for i, model_name in enumerate(models_to_try):
        try:
            r = httpx.post(f"{base}/models/{model_name}:generateContent", json=body, headers=headers, timeout=cfg.timeout_s)
            if r.status_code < 400:
                break
            last_err = f"HTTP {r.status_code}: {r.text[:500]}"
            if r.status_code in (429, 503) and i < len(models_to_try) - 1:
                import time
                time.sleep(0.5)
        except Exception as e:
            last_err = str(e)
    else:
        raise LLMError(last_err or "Gagal memanggil Gemini API")
    data = r.json()
    cands = data.get("candidates") or []
    if not cands:
        fb = data.get("promptFeedback", {})
        raise LLMError(f"Gemini tidak mengembalikan kandidat (blockReason={fb.get('blockReason')})")
    parts = (cands[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
    if not text:
        raise LLMError(f"Gemini mengembalikan jawaban kosong (finishReason={cands[0].get('finishReason')})")
    um = data.get("usageMetadata", {})
    return text, {"input_tokens": um.get("promptTokenCount"), "output_tokens": um.get("candidatesTokenCount")}


def _openai_compatible(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    if not (cfg.base_url and cfg.api_key and cfg.model):
        raise LLMError("LLM_BASE_URL, LLM_API_KEY, dan LLM_MODEL wajib diisi untuk openai_compatible")
    body = {"model": cfg.model,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            cfg.max_tokens_field: cfg.max_tokens}
    if cfg.send_sampling:
        body.update(temperature=cfg.temperature, top_p=cfg.top_p)
    if cfg.json_mode:
        body["response_format"] = {"type": "json_object"}
    if cfg.reasoning_effort:
        body["reasoning_effort"] = cfg.reasoning_effort
    body.update(cfg.extra_body)
    headers = {"Authorization": f"Bearer {cfg.api_key}", "Content-Type": "application/json", **cfg.extra_headers}
    r = httpx.post(f"{cfg.base_url}/chat/completions", json=body, headers=headers, timeout=cfg.timeout_s)
    if r.status_code >= 400:
        raise LLMError(f"HTTP {r.status_code}: {r.text[:500]}")
    data = r.json()
    try:
        text = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e:
        raise LLMError(f"format respons tidak dikenali: {json.dumps(data)[:500]}") from e
    return text or "", data.get("usage", {})


def _anthropic(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    if not (cfg.api_key and cfg.model):
        raise LLMError("LLM_API_KEY dan LLM_MODEL wajib diisi untuk anthropic")
    base = cfg.base_url or "https://api.anthropic.com/v1"
    body = {"model": cfg.model, "max_tokens": cfg.max_tokens, "system": system,
            "messages": [{"role": "user", "content": user}]}
    if cfg.send_sampling:
        body["temperature"] = cfg.temperature
    body.update(cfg.extra_body)
    headers = {"x-api-key": cfg.api_key, "anthropic-version": "2023-06-01", "content-type": "application/json",
               **cfg.extra_headers}
    r = httpx.post(f"{base}/messages", json=body, headers=headers, timeout=cfg.timeout_s)
    if r.status_code >= 400:
        raise LLMError(f"HTTP {r.status_code}: {r.text[:500]}")
    data = r.json()
    text = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
    return text, data.get("usage", {})


def _mock(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    import re
    labels = re.findall(r'<doc label="([^"]+)">', user)
    route = re.search(r"<rute>(.*?)</rute>", user).group(1)
    if route == "off_topic":
        ans = "Maaf, aku hanya bisa membantu soal gizi, pola makan, dan tumbuh kembang anak."
    else:
        ans = "[MOCK] Ini contoh jawaban tiruan untuk menguji alur sistem, bukan jawaban LLM sungguhan."
    out = {"answer": ans, "actions": ["[MOCK] Langkah contoh"], "sources": labels[:1],
           "refer_to_professional": route == "diagnosis"}
    return json.dumps(out, ensure_ascii=False), {"input_tokens": 0, "output_tokens": 0}


PROVIDERS = {"gemini": _gemini, "google": _gemini,
             "openai_compatible": _openai_compatible, "openai": _openai_compatible,
             "anthropic": _anthropic, "mock": _mock}


def complete(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    fn = PROVIDERS.get(cfg.provider)
    if fn is None:
        raise LLMError(f"LLM_PROVIDER tidak dikenal: {cfg.provider} (pilih: {', '.join(PROVIDERS)})")
    return fn(cfg, system, user)