"""Knowledge base + retriever TF-IDF (offline, tanpa embedding API).

Alasan TF-IDF untuk MVP: knowledge base kecil (puluhan paragraf), tidak butuh API tambahan,
deterministik, mudah di-debug. Bisa diganti embedding + vector DB saat KB membesar.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .config import ROOT

KB_DIR = ROOT / "knowledge_base"

# Stopword Bahasa Indonesia minimal (cukup untuk TF-IDF skala kecil)
STOPWORDS = """yang dan di ke dari untuk dengan pada adalah ini itu atau juga dalam akan bisa sudah
saya aku kamu anak anaknya apa apakah bagaimana gimana berapa kapan kenapa mengapa ya tidak tak
jika kalau agar supaya sebaiknya seperti oleh karena masih lebih sangat bu pak dok kak mau""".split()


@dataclass
class Chunk:
    doc_id: str
    title: str
    source: str
    status: str
    text: str

    topics: str = ""
    url: str = ""

    def cite(self) -> str:
        return self.title


SYNONYMS = [  # normalisasi variasi penulisan sebelum TF-IDF (diterapkan ke dokumen & query)
    (r"mp[\s-]?asi", "mpasi"), (r"makanan pendamping asi", "mpasi"), (r"\bstunted\b", "stunting"),
    (r"\b(pendek|kerdil)\b", "pendek stunting"), (r"\b(gtm|gerakan tutup mulut)\b", "susah makan"),
    (r"\bpicky( eater)?\b", "pilih-pilih susah makan"), (r"\b(bb|berat badan)\b", "berat"),
    (r"\b(tb|tinggi badan|panjang badan)\b", "tinggi"), (r"\bvaksin(asi)?\b", "imunisasi"),
    (r"\b(mencret|bab cair)\b", "diare"), (r"\bnyusu\b", "menyusu"),
    (r"\b(tanda(-tanda)?|ciri(-ciri)?|gejala)\b", "tanda"),
    (r"\b(ber)?risiko\b", "faktor risiko"),
]


def normalize(text: str) -> str:
    t = text.lower()
    for pat, rep in SYNONYMS:
        t = re.sub(pat, rep, t)
    # stemming ringan: buang akhiran kepemilikan (-nya, -ku, -mu) pada kata >= 6 huruf
    return re.sub(r"\b(\w{4,}?)(nya|ku|mu)\b", r"\1", t)


def _parse(path: Path) -> list[Chunk]:
    raw = path.read_text(encoding="utf-8")
    meta, body = {}, raw
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, flags=re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"')
        body = m.group(2)
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    return [Chunk(meta.get("id", path.stem), meta.get("title", path.stem), meta.get("source", "-"),
                  meta.get("status", "-"), p, meta.get("topics", ""),
                  meta.get("source_url", "").split(" ; ")[0].strip()) for p in paras]


@lru_cache(maxsize=1)
def load_kb() -> tuple[list[Chunk], tuple[TfidfVectorizer, TfidfVectorizer], tuple[np.ndarray, np.ndarray]]:
    chunks: list[Chunk] = []
    for p in sorted(KB_DIR.glob("*.md")):
        if p.name.lower() == "readme.md":
            continue
        chunks.extend(_parse(p))
    if not chunks:
        raise RuntimeError(f"knowledge base kosong: {KB_DIR}")
    vec_body = TfidfVectorizer(lowercase=True, stop_words=STOPWORDS, ngram_range=(1, 2), sublinear_tf=True)
    vec_meta = TfidfVectorizer(lowercase=True, stop_words=STOPWORDS, ngram_range=(1, 2), sublinear_tf=True)
    # Pisahkan skor isi paragraf (body) dan metadata dokumen (title/topics) agar paragraf pendek tidak menutupi paragraf inti yang panjang
    mat_body = vec_body.fit_transform([normalize(c.text) for c in chunks])
    mat_meta = vec_meta.fit_transform([normalize(f"{c.title}. {c.topics}") for c in chunks])
    return chunks, (vec_body, vec_meta), (mat_body, mat_meta)


def retrieve(query: str, k: int = 4, min_score: float = 0.03, max_per_doc: int = 2) -> list[tuple[Chunk, float]]:
    """Top-k paragraf, maksimal `max_per_doc` paragraf per dokumen agar konteks beragam."""
    chunks, (vec_body, vec_meta), (mat_body, mat_meta) = load_kb()
    nq = normalize(query)
    sim_body = cosine_similarity(vec_body.transform([nq]), mat_body).ravel()
    sim_meta = cosine_similarity(vec_meta.transform([nq]), mat_meta).ravel()
    sims = 0.65 * sim_body + 0.35 * sim_meta
    out, per_doc = [], {}
    for i in np.argsort(-sims):
        if sims[i] < min_score or len(out) >= k:
            break
        d = chunks[i].doc_id
        if per_doc.get(d, 0) >= max_per_doc:
            continue
        per_doc[d] = per_doc.get(d, 0) + 1
        out.append((chunks[i], float(sims[i])))
    return out
