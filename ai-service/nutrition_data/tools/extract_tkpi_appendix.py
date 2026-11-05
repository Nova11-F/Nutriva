"""
Ekstraksi tabel lampiran TKPI 2017 (Kemenkes RI, 2018; ISBN 978-602-416-407-2) ke CSV.

  Bab 5 Indeks (hlm. PDF 71-99)     -> sources/tkpi2017_index.csv     kode, nama, spesies, genus, famili, nama Inggris
  Bab 6 Glosari (hlm. PDF 100-115)  -> sources/tkpi2017_glossary.csv  kode, nama daerah/lokal, deskripsi masakan
  Bab 7 Kode (hlm. PDF 116-134)     -> sources/tkpi2017_code_map.csv  kode lama (TKPI 2009), kode baru, nama, kelompok, jenis

Tabel komposisi (Bab 4, hlm. PDF 16-70) diekstrak oleh tools/extract_tkpi.py. Halaman 135 kosong.
Tabel di bab ini bergaris sehingga dibaca dengan pdfplumber.extract_tables(); sel kosong ('') dipertahankan.

Pemakaian: python tools/extract_tkpi_appendix.py /path/Tabel_Komposisi_Pangan_Indonesia_2017.pdf
"""
import csv
import hashlib
import re
import sys
from pathlib import Path

import pdfplumber

SRC = Path(__file__).resolve().parent.parent / "sources"
KRE = re.compile(r"^[A-Z][RP]\d{3}$")
SECTION = re.compile(r"^\s*(\d+)\.(\d+)\.\s+(.+?)\s*$")


def clean(x):
    return " ".join((x or "").split())


def page_section(page, chapter):
    """Judul subbab di halaman, mis. '5.3. KACANG, BIJI, BEAN' -> 'KACANG, BIJI, BEAN'."""
    found = []
    for line in (page.extract_text() or "").splitlines():
        m = SECTION.match(line)
        if m and m.group(1) == str(chapter):
            found.append(clean(m.group(3)))
    return found


def header(path, sha, what):
    return f"# source: Kemenkes RI (2018). Tabel Komposisi Pangan Indonesia 2017, {what}. PDF sha256={sha}. " \
           f"Diekstrak dengan tools/extract_tkpi_appendix.py\n"


def main():
    pdf_path = Path(sys.argv[1])
    sha = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    index, glossary, codes, notes = [], [], [], []
    with pdfplumber.open(pdf_path) as pdf:
        group = {5: "", 6: "", 7: ""}
        for pno in range(71, 135):
            page = pdf.pages[pno - 1]
            chap = 5 if pno <= 99 else (6 if pno <= 115 else 7)
            secs = page_section(page, chap)
            for t in page.extract_tables():
                kind = "TUNGGAL/SINGLE"
                for r in t:
                    cells = [clean(x) for x in r if x is not None]
                    if chap == 5 and len(cells) == 6 and KRE.match(cells[0]):
                        index.append(dict(zip(["kode", "nama", "spesies", "genus", "famili", "nama_inggris"], cells),
                                          page=pno))
                    elif chap == 6 and len(cells) == 3 and cells[0] != "KODE":
                        if KRE.match(cells[0]):
                            glossary.append({"kode": cells[0], "nama_daerah": cells[1], "deskripsi": cells[2], "page": pno})
                        elif glossary and not cells[0]:          # lanjutan baris dari halaman sebelumnya
                            prev = glossary[-1]
                            prev["nama_daerah"] = clean(prev["nama_daerah"] + " " + cells[1])
                            prev["deskripsi"] = clean(prev["deskripsi"] + " " + cells[2])
                            notes.append(f"glosari hlm.{pno}: baris tanpa kode digabung ke {prev['kode']}")
                        else:
                            notes.append(f"glosari hlm.{pno}: baris tidak dikenali {cells}")
                    elif chap == 7:
                        if len(cells) == 1 and cells[0]:
                            kind = cells[0]
                        elif len(cells) == 3 and KRE.match(cells[1]):
                            codes.append({"kode_lama": cells[0], "kode_baru": cells[1], "nama": cells[2],
                                          "jenis": "", "page": pno})
            if chap == 7:
                # cadangan berbasis teks: sel tabel yang tergabung (merged) bisa membuat baris terlewat
                got = {(c["kode_lama"], c["kode_baru"]) for c in codes}
                for line in (page.extract_text(layout=True) or "").splitlines():
                    for m in re.finditer(r"(ID[A-Z]\d{3})\s+([A-Z][RP]\d{3})\s+(.+?)(?=\s{2,}ID[A-Z]\d{3}|\s{2,}[A-Z][RP]\d{3}"
                                         r"|\s{3,}\S|$)", line):
                        if (m.group(1), m.group(2)) not in got:
                            codes.append({"kode_lama": m.group(1), "kode_baru": m.group(2), "nama": clean(m.group(3)),
                                          "jenis": "TUNGGAL/SINGLE" if m.group(2)[1] == "R" else "OLAHAN/PRODUK/KOMPOSIT", "page": pno})
                            notes.append(f"kode hlm.{pno}: {m.group(1)}->{m.group(2)} diambil dari teks (sel tabel tergabung)")
            if secs:
                group[chap] = secs[-1]
            # kelompok: kode huruf pertama lebih andal daripada judul halaman (satu halaman bisa memuat 2-3 subbab)
    gname = {"A": "Serealia", "B": "Umbi berpati", "C": "Kacang, biji, bean", "D": "Sayuran", "E": "Buah",
             "F": "Daging, unggas", "G": "Ikan, kerang, udang", "H": "Telur", "J": "Susu", "K": "Lemak dan minyak",
             "M": "Gula, sirup, konfeksioneri", "N": "Bumbu", "Q": "Minuman"}
    for rows in (index, glossary):
        for r in rows:
            r["kelompok"] = gname.get(r["kode"][0], "")
    for r in codes:
        r["kelompok"] = gname.get(r["kode_baru"][0], "")
        # jenis mengikuti sistem kode TKPI (Tabel 2): huruf kedua R = tunggal/mentah, P = olahan
        r["jenis"] = "TUNGGAL/SINGLE" if r["kode_baru"][1] == "R" else "OLAHAN/PRODUK/KOMPOSIT"

    out = [("tkpi2017_index.csv", index, ["kode", "nama", "spesies", "genus", "famili", "nama_inggris", "kelompok", "page"],
            "Bab 5 Indeks"),
           ("tkpi2017_glossary.csv", glossary, ["kode", "nama_daerah", "deskripsi", "kelompok", "page"], "Bab 6 Glosari"),
           ("tkpi2017_code_map.csv", codes, ["kode_lama", "kode_baru", "nama", "jenis", "kelompok", "page"], "Bab 7 Kode")]
    for fname, rows, fields, what in out:
        with (SRC / fname).open("w", newline="", encoding="utf-8") as fh:
            fh.write(header(pdf_path, sha, what))
            w = csv.DictWriter(fh, fieldnames=fields)
            w.writeheader()
            w.writerows(rows)
        print(f"{fname}: {len(rows)} baris")
    for n in notes:
        print("catatan:", n)


if __name__ == "__main__":
    main()
