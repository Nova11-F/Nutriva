/**
 * WHO Child Growth Standards (2006) z-score, usia 0–60 bulan.
 * Port 1:1 dari ai-service/src/growth.py (diuji silang lewat `npm run test:who`).
 *
 * Rumus LMS: z = ((X/M)^L − 1) / (L·S), atau ln(X/M)/S bila L = 0.
 * BB/U dan BB/TB memakai restricted z-score WHO di luar |z| > 3 (koreksi SD23).
 * Asumsi: < 24 bulan = panjang badan (berbaring), ≥ 24 bulan = tinggi badan (berdiri).
 * Usia dibulatkan ke bawah ke bulan penuh, sama dengan engine Python.
 */
import who from "../data/who/who_lms.json";

const T = who.tables;

export function sexKey(gender) {
  const g = String(gender ?? "").trim().toUpperCase();
  if (["M", "MALE", "L", "LAKI-LAKI", "BOY"].includes(g)) return "boys";
  if (["F", "FEMALE", "P", "PEREMPUAN", "GIRL"].includes(g)) return "girls";
  throw new Error(`gender tidak dikenali: ${gender}`);
}

/** "male"/"Laki-laki" -> "M", "female"/"Perempuan" -> "F" (kontrak API AI service). */
export function toApiGender(gender) {
  return sexKey(gender) === "boys" ? "M" : "F";
}

function rowByAge(table, ageMonth) {
  const m = Math.floor(ageMonth);
  const rows = table.filter((r) => r[0] === m);
  if (!rows.length) throw new Error(`usia ${ageMonth} bulan di luar rentang 0–60`);
  // tabel PB/TB-U memuat dua baris bulan 24: pertama = panjang, kedua = tinggi
  return m >= 24 ? rows[rows.length - 1] : rows[0];
}

function lmsZ(x, L, M, S, restricted = false) {
  if (x == null || !(x > 0) || Number.isNaN(x)) return NaN;
  let z = L === 0 ? Math.log(x / M) / S : (Math.pow(x / M, L) - 1) / (L * S);
  if (restricted && Math.abs(z) > 3) {
    const sd = (k) => (L !== 0 ? M * Math.pow(1 + L * S * k, 1 / L) : M * Math.exp(S * k));
    if (z > 3) z = 3 + (x - sd(3)) / (sd(3) - sd(2));
    else z = -3 + (x - sd(-3)) / (sd(-2) - sd(-3));
  }
  return z;
}

export function haz(ageMonth, gender, heightCm) {
  const [, L, M, S] = rowByAge(T.lhfa[sexKey(gender)], ageMonth);
  return lmsZ(heightCm, L, M, S);
}

export function waz(ageMonth, gender, weightKg) {
  const [, L, M, S] = rowByAge(T.wfa[sexKey(gender)], ageMonth);
  return lmsZ(weightKg, L, M, S, true);
}

export function whz(ageMonth, gender, heightCm, weightKg) {
  const sex = sexKey(gender);
  const [t, lo, hi] = Math.floor(ageMonth) < 24 ? [T.wfl[sex], 45, 110] : [T.wfh[sex], 65, 120];
  if (!(heightCm >= lo && heightCm <= hi)) return NaN;
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i];
    const b = t[i + 1];
    if (a[0] <= heightCm && heightCm <= b[0]) {
      const w = b[0] !== a[0] ? (heightCm - a[0]) / (b[0] - a[0]) : 0;
      const lerp = (k) => a[k] + w * (b[k] - a[k]);
      return lmsZ(weightKg, lerp(1), lerp(2), lerp(3), true);
    }
  }
  return NaN;
}

const round2 = (z) => (Number.isFinite(z) ? Math.round(z * 100) / 100 : null);

/** Kategori Permenkes RI No. 2/2020. */
export function classifyHaz(z) {
  if (!Number.isFinite(z)) return "Tidak dapat dihitung";
  if (z < -3) return "Sangat pendek";
  if (z < -2) return "Pendek";
  if (z <= 3) return "Normal";
  return "Tinggi";
}
export function classifyWaz(z) {
  if (!Number.isFinite(z)) return "Tidak dapat dihitung";
  if (z < -3) return "Berat badan sangat kurang";
  if (z < -2) return "Berat badan kurang";
  if (z <= 1) return "Berat badan normal";
  return "Risiko berat badan lebih";
}
export function classifyWhz(z) {
  if (!Number.isFinite(z)) return "Tidak dapat dihitung";
  if (z < -3) return "Gizi buruk";
  if (z < -2) return "Gizi kurang";
  if (z <= 1) return "Gizi baik";
  if (z <= 2) return "Berisiko gizi lebih";
  if (z <= 3) return "Gizi lebih";
  return "Obesitas";
}

/** Usia dalam bulan penuh pada tanggal tertentu (hari lahir belum lewat = belum genap). */
export function ageInMonthsAt(birthDate, atDate = new Date()) {
  const b = new Date(birthDate);
  const d = new Date(atDate);
  let m = (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth());
  if (d.getDate() < b.getDate()) m -= 1;
  return Math.max(0, m);
}

/**
 * Z-score + insight non-diagnostik untuk satu pengukuran.
 * Pesan sengaja tidak menyatakan diagnosis; status gizi ditetapkan tenaga kesehatan.
 */
export function assessMeasurement({ ageMonths, gender, weightKg, heightCm }) {
  if (ageMonths > 60) {
    return {
      zHaz: null, zWaz: null, zWhz: null, needsAttention: false, insightStatus: "normal_routine",
      insightMessage: "Standar WHO 2006 di Nutriva berlaku untuk usia 0–60 bulan.",
    };
  }
  const zH = haz(ageMonths, gender, heightCm);
  const zW = waz(ageMonths, gender, weightKg);
  const zWH = whz(ageMonths, gender, heightCm, weightKg);
  const low = [zH, zW, zWH].some((z) => Number.isFinite(z) && z < -2);
  const high = Number.isFinite(zWH) && zWH > 2;
  const implausible = [zH, zW, zWH].some((z) => Number.isFinite(z) && Math.abs(z) > 5);

  let insightMessage = "Pertumbuhan berada dalam rentang standar WHO. Lanjutkan penimbangan rutin tiap bulan.";
  if (implausible) {
    insightMessage = "Angka pengukuran tampak tidak biasa. Mohon cek ulang berat/tinggi badan dan tanggal lahir.";
  } else if (low) {
    insightMessage = "Ada indikator di bawah −2 SD standar WHO. Disarankan memeriksakan anak ke Posyandu/Puskesmas untuk penilaian langsung.";
  } else if (high) {
    insightMessage = "Berat menurut tinggi badan di atas +2 SD standar WHO. Disarankan konsultasi pola makan ke tenaga kesehatan.";
  }
  const needsAttention = low || high || implausible;
  return {
    zHaz: round2(zH), zWaz: round2(zW), zWhz: round2(zWH),
    needsAttention,
    insightStatus: needsAttention ? "early_awareness" : "normal_routine",
    insightMessage,
  };
}
