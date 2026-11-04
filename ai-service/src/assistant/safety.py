"""Guardrail rule-based (pre-check sebelum LLM, post-check sesudah LLM).

Pre-check menentukan rute:
  emergency  -> jawaban template rujukan segera, LLM TIDAK dipanggil
  dosage     -> jawaban template "dosis ditentukan tenaga kesehatan", LLM TIDAK dipanggil
  diagnosis  -> LLM dipanggil, tapi dipaksa refer_to_professional=True + dilarang mendiagnosis
  off_topic  -> LLM dipanggil dengan instruksi menolak sopan (di luar topik gizi/tumbuh kembang)
  normal     -> LLM dipanggil biasa
Pola sengaja dibuat konservatif (lebih baik false positive daripada melewatkan kondisi darurat).
"""
from __future__ import annotations

import re

EMERGENCY = [
    r"kejang", r"step\b", r"sesak", r"napas\s*(cepat|berat|tersengal)", r"tidak\s*sadar", r"pingsan",
    r"muntah\s*(terus|berkali|tiap)", r"tidak\s*mau\s*(minum|menyusu|nyusu)", r"(mata|ubun-ubun)\s*cekung",
    r"bab\s*berdarah", r"(berak|feses|tinja)\s*(ber)?darah", r"demam\s*(tinggi|lebih dari\s*3|>\s*3|sampai\s*4[0-9])",
    r"lemas\s*sekali", r"sangat\s*lemas", r"dehidrasi", r"bibir\s*(biru|kebiruan)", r"keracunan",
    r"tertelan\s*(obat|baterai|koin|cairan)",
]
DOSAGE = [
    r"dosis", r"berapa\s*(mg|ml|tetes|sendok|kali\s*minum\s*obat)", r"\b\d+\s*(mg|mcg|iu)\b",
    r"obat\s*apa", r"antibiotik", r"paracetamol|parasetamol|ibuprofen|amoxicillin|amoksisilin",
    r"(suplemen|vitamin|obat|multivitamin|penambah\s*nafsu\s*makan)\s*(apa|yang\s*(bagus|ampuh|bikin))",
    r"boleh\s*minum\s*obat",
]
DIAGNOSIS = [
    r"(apakah|apa)\s*(anak|bayi)\s*(saya|aku|ku)?\s*(stunting|stunted|gizi\s*buruk|kurang\s*gizi|pendek|obesitas|wasting)",
    r"(anak|bayi)(ku|\s*saya|\s*aku)?\s*(stunting|kena\s*stunting|gizi\s*buruk)\s*(ga|gak|nggak|tidak|bukan)?\s*\??",
    r"diagnos", r"(sakit|penyakit)\s*apa", r"normal\s*(ga|gak|nggak|tidak)\b",
]
IN_SCOPE = [
    r"makan", r"mpasi|mp-asi|mp asi", r"\basi\b|menyusu|\bsusu", r"gizi|nutrisi", r"protein|telur|ikan|daging|sayur|buah",
    r"porsi|menu|resep", r"tumbuh|pertumbuhan|tinggi|berat|timbang|ukur|z-?score", r"stunting",
    r"posyandu|puskesmas|kia", r"imunisasi|vaksin|obat\s*cacing|vitamin", r"diare|sakit|demam",
    r"anak|bayi|balita|batita", r"cuci\s*tangan|air\s*minum|sanitasi", r"alergi|picky|pilih-pilih|susah",
]

# Hanya dicek pada rute diagnosis: kesimpulan "anak normal / tidak stunting" juga termasuk diagnosis (temuan D03)
_FORBIDDEN_DIAG_ROUTE = [
    r"(berada\s*(dalam|di)|masuk|termasuk)\s*(rentang|kategori|batas)\s*normal",
    r"\btidak\s*(mengalami\s*|termasuk\s*)?stunting\b", r"risiko\s*stunting\s*(nya\s*)?rendah",
    r"pertumbuhan(nya)?\s*(sudah\s*)?normal",
]

_FORBIDDEN_OUT = [
    (r"anak\s*(anda|ibu|bapak|kamu|ayah\s*bunda)\s*(sudah\s*|telah\s*|positif\s*)?(mengalami\s*|menderita\s*|terkena\s*)?"
     r"(stunting|gizi\s*buruk|wasting|obesitas)", "diagnosis"),
    (r"(di)?diagnosis\s*(anak|sebagai)", "diagnosis"),
    # temuan review manual eval 20261027_180220 (N01): "Rara usia 14 bulan mengalami stunting" lolos pola lama
    (r"\b(mengalami|menderita|terkena|positif|didiagnosis|divonis)\s+(stunting|gizi\s*buruk|wasting|obesitas|"
     r"kurang\s*gizi|malnutrisi)", "diagnosis"),
    (r"\b\d+([.,]\d+)?\s*(mg|mcg|iu|ml)\b(?!.*(buku kia|tenaga kesehatan))", "dosage"),
]

EMERGENCY_TEMPLATE = {
    "answer": ("Kondisi yang Anda ceritakan bisa termasuk tanda bahaya. Mohon segera bawa anak ke Puskesmas, "
               "IGD rumah sakit, atau dokter terdekat sekarang. Jangan menunggu dan jangan hanya mengandalkan "
               "informasi dari aplikasi."),
    "actions": ["Segera ke fasilitas kesehatan terdekat atau hubungi layanan darurat 119",
                "Bawa Buku KIA anak saat berangkat"],
    "sources": [],
    "refer_to_professional": True,
}
DOSAGE_TEMPLATE = {
    "answer": ("Nutriva tidak memberikan dosis obat, vitamin, atau suplemen karena jenis dan dosisnya harus "
               "disesuaikan dengan berat badan dan kondisi anak oleh tenaga kesehatan. Silakan tanyakan ke dokter, "
               "bidan, atau apoteker."),
    "actions": ["Tanyakan dosis ke dokter, bidan, atau apoteker", "Bawa Buku KIA dan catatan berat badan terakhir anak"],
    "sources": [],
    "refer_to_professional": True,
}


def _any(patterns: list[str], text: str) -> bool:
    return any(re.search(p, text) for p in patterns)


def precheck(question: str) -> str:
    q = question.lower()
    if _any(EMERGENCY, q):
        return "emergency"
    if _any(DOSAGE, q):
        return "dosage"
    if _any(DIAGNOSIS, q):
        return "diagnosis"
    if not _any(IN_SCOPE, q):
        return "off_topic"
    return "normal"


def violations(answer: dict, route: str) -> list[str]:
    """Cek cepat pelanggaran isi (dipakai service untuk memutuskan retry dengan koreksi)."""
    text = " ".join([answer.get("answer", "")] + list(answer.get("actions", []))).lower()
    v = [f"forbidden_{k}" for p, k in _FORBIDDEN_OUT if re.search(p, text)]
    if route == "diagnosis" and _any(_FORBIDDEN_DIAG_ROUTE, text):
        v.append("forbidden_diagnosis")
    return sorted(set(v))


def postcheck(answer: dict, allowed_sources: list[str], route: str) -> tuple[dict, list[str]]:
    """Validasi output LLM. Mengembalikan (jawaban yang sudah diamankan, daftar pelanggaran)."""
    flags: list[str] = []
    text = " ".join([answer.get("answer", "")] + list(answer.get("actions", []))).lower()
    for pat, kind in _FORBIDDEN_OUT:
        if re.search(pat, text):
            flags.append(f"forbidden_{kind}")
    if route == "diagnosis" and _any(_FORBIDDEN_DIAG_ROUTE, text) and "forbidden_diagnosis" not in flags:
        flags.append("forbidden_diagnosis")
    raw_srcs = list(dict.fromkeys(answer.get("sources", [])))          # buang duplikat
    srcs = [s for s in raw_srcs if s in allowed_sources]
    if len(srcs) != len(raw_srcs):
        flags.append("source_not_in_context")
    answer["sources"] = srcs
    # frontend menampilkan teks polos: buang penanda markdown sederhana
    answer["answer"] = re.sub(r"(\*\*|__)(.+?)\1", r"\2", answer.get("answer", ""))
    answer["actions"] = [re.sub(r"(\*\*|__)(.+?)\1", r"\2", a) for a in answer.get("actions", [])]
    if route == "diagnosis" and not answer.get("refer_to_professional"):
        answer["refer_to_professional"] = True
        flags.append("forced_referral")
    if len(answer.get("answer", "").split()) > 200:
        flags.append("too_long")
    if any(f.startswith("forbidden_") for f in flags):
        # jangan pernah tampilkan diagnosis/dosis ke pengguna
        safe = DOSAGE_TEMPLATE if "forbidden_dosage" in flags else {
            "answer": ("Penetapan status gizi atau stunting hanya bisa dilakukan tenaga kesehatan melalui "
                       "pengukuran langsung. Silakan periksakan anak ke Posyandu atau Puskesmas."),
            "actions": ["Ukur tinggi dan timbang berat badan anak di Posyandu",
                        "Diskusikan hasilnya dengan bidan atau petugas gizi Puskesmas"],
            "sources": [], "refer_to_professional": True}
        answer = {**safe}
    return answer, flags
