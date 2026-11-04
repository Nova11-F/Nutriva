"""
Ekstraksi Tabel Komposisi Pangan Indonesia (TKPI) 2017 dari PDF resmi Kemenkes ke CSV.

Sumber: Kementerian Kesehatan RI, Ditjen Kesehatan Masyarakat, Direktorat Gizi Masyarakat (2018).
        Tabel Komposisi Pangan Indonesia 2017. Jakarta. ISBN 978-602-416-407-2.
        Halaman katalog: https://repository.kemkes.go.id/book/777

Metode: posisi kata (pdfplumber). Kolom nilai ditentukan dari pusat token satuan "(g)/(Kal)/(mg)/(mcg)"
di baris header setiap halaman (21 kolom) + kolom BDD di paling kanan. Sel kosong dibiarkan kosong (bukan 0).
Angka yang terbungkus dua baris di sel sempit (mis. "16" + "4") digabung.

QA yang dihitung per baris (tidak mengubah nilai sumber):
  proximate_sum  = air + protein + lemak + KH + abu (harus ~100 g)
  atwater_dev_pct = |E - (4P + 9L + 4KH)| / E * 100

Pemakaian: python tools/extract_tkpi.py /path/Tabel_Komposisi_Pangan_Indonesia_2017.pdf
"""
import csv
import hashlib
import json
import re
import sys
from pathlib import Path

import pdfplumber

OUT = Path(__file__).resolve().parent.parent / "sources/tkpi2017.csv"
COLS = "air_g energi_kal protein_g lemak_g kh_g serat_g abu_g kalsium_mg fosfor_mg besi_mg natrium_mg kalium_mg tembaga_mg seng_mg retinol_mcg bkar_mcg kartotal_mcg thiamin_mg riboflavin_mg niasin_mg vitc_mg bdd_pct".split()
UNITS = {"(g)", "(Kal)", "(mg)", "(mcg)"}
KRE = re.compile(r"[A-Z]{2}\d{3}$")


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def extract(pdf_path):
    rows = []; issues = []
    with pdfplumber.open(pdf_path) as pdf:
        for pi,pg in enumerate(pdf.pages):
            W=pg.extract_words(x_tolerance=1.5,y_tolerance=2)
            units=[w for w in W if w['text'] in UNITS]
            if len(units)<15: continue
            # unit row = mode top
            tops={}
            for u in units: tops.setdefault(round(u['top']),[]).append(u)
            urow=max(tops.values(),key=len)
            if len(urow)!=21: issues.append((pi+1,'units',len(urow))); continue
            centers=sorted((u['x0']+u['x1'])/2 for u in urow)
            centers.append(centers[-1]+ (centers[-1]-centers[-2])*1.6)  # kolom BDD di kanan VIT_C
            hdr={w['text']:w for w in W if w['text'] in ('KODE','NAMA','SUMBER') and w['top']<urow[0]['top']}
            xs_name=hdr['NAMA']['x0']-25; xs_sumber=hdr['SUMBER']['x0']-20; xs_val=centers[0]-15
            kodes=sorted([w for w in W if KRE.match(w['text']) and w['x0']<xs_name and w['top']>urow[0]['top']],key=lambda w:w['top'])
            for j,k in enumerate(kodes):
                lo=(kodes[j-1]['top']+k['top'])/2 if j else k['top']-14
                hi=(kodes[j+1]['top']+k['top'])/2 if j+1<len(kodes) else k['top']+14
                band=[w for w in W if lo<=w['top']<hi]
                name=' '.join(w['text'] for w in sorted([w for w in band if xs_name<=w['x0']<xs_sumber],key=lambda w:(round(w['top']),w['x0'])))
                sumber=' '.join(w['text'] for w in sorted([w for w in band if xs_sumber<=w['x0']<xs_val],key=lambda w:(round(w['top']),w['x0'])))
                vals=[w for w in W if abs(w['top']-k['top'])<9 and w['x0']>=xs_val]
                d={'kode':k['text'],'nama':name,'sumber':sumber,'page':pi+1}
                bycol={}
                for w in sorted(vals,key=lambda w:w['top']):
                    c=(w['x0']+w['x1'])/2
                    idx=21 if c>centers[20]+12 else min(range(21),key=lambda i:abs(centers[i]-c))
                    if idx<21 and abs(centers[idx]-c)>14: issues.append((pi+1,k['text'],'val',w['text'])); continue
                    bycol.setdefault(idx,[]).append(w['text'])
                for idx,toks in bycol.items():
                    v=''.join(toks)
                    if len(toks)>1 and not toks[0].endswith('.'): issues.append((pi+1,k['text'],'multi',toks))
                    d[COLS[idx]]=v
                rows.append(d)

    return rows, issues


def main():
    pdf_path = Path(sys.argv[1])
    sha = hashlib.sha256(pdf_path.read_bytes()).hexdigest()
    rows, issues = extract(pdf_path)
    for r in rows:
        p = [num(r.get(k)) for k in ("air_g", "protein_g", "lemak_g", "kh_g", "abu_g")]
        r["proximate_sum"] = round(sum(p), 1) if None not in p else ""
        e, pr, l, kh = (num(r.get(k)) for k in ("energi_kal", "protein_g", "lemak_g", "kh_g"))
        r["atwater_dev_pct"] = (round(abs(e - (4 * pr + 9 * l + 4 * kh)) / e * 100, 1)
                                if None not in (e, pr, l, kh) and e else "")
    fields = ["kode", "nama", "sumber", "page", *COLS, "proximate_sum", "atwater_dev_pct"]
    with OUT.open("w", newline="", encoding="utf-8") as fh:
        fh.write("# source: Kemenkes RI (2018). Tabel Komposisi Pangan Indonesia 2017. ISBN 978-602-416-407-2. "
                 f"PDF sha256={sha}. Diekstrak dengan tools/extract_tkpi.py\n")
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k, "") for k in fields})
    print(f"{len(rows)} baris -> {OUT}; catatan ekstraksi: {len(issues)}")


if __name__ == "__main__":
    main()
