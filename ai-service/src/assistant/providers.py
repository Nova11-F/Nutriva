"""Adapter provider LLM. Semua mengembalikan (teks_balasan, usage_dict).

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


PROVIDERS = {"openai_compatible": _openai_compatible, "openai": _openai_compatible,
             "anthropic": _anthropic, "mock": _mock}


def complete(cfg: LLMConfig, system: str, user: str) -> tuple[str, dict]:
    fn = PROVIDERS.get(cfg.provider)
    if fn is None:
        raise LLMError(f"LLM_PROVIDER tidak dikenal: {cfg.provider} (pilih: {', '.join(PROVIDERS)})")
    return fn(cfg, system, user)
