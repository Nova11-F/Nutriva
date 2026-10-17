import { getAgeInMonths, todayISO } from "./formatDate";

const MAX_AGE_MONTHS = 60; 

function checkNumber(value, min, max, label, { required = true } = {}) {
  if (value === "" || value == null) return required ? `${label} wajib diisi` : undefined;
  const n = Number(value);
  if (Number.isNaN(n) || n < min || n > max) return `${label} harus antara ${min} dan ${max}`;
}

const clean = (errors) => Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg));

export function validateIdentity(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Nama anak wajib diisi";
  else if (v.name.trim().length > 50) e.name = "Maksimal 50 karakter";

  if (!v.birthDate) e.birthDate = "Tanggal lahir wajib diisi";
  else if (v.birthDate > todayISO()) e.birthDate = "Tanggal lahir tidak boleh di masa depan";
  else if (getAgeInMonths(v.birthDate) > MAX_AGE_MONTHS) e.birthDate = "Nutriva untuk anak usia di bawah 5 tahun";

  if (!v.gender) e.gender = "Pilih jenis kelamin";

  e.birthOrder = checkNumber(v.birthOrder, 1, 15, "Urutan anak");
  if (!e.birthOrder && !Number.isInteger(Number(v.birthOrder))) e.birthOrder = "Isi dengan bilangan bulat";
  return clean(e);
}

export function validateBody(v, { isEdit = false } = {}) {
  const e = {
    birthWeight: checkNumber(v.birthWeight, 0.5, 6, "Berat lahir", { required: false }),
    birthLength: checkNumber(v.birthLength, 30, 60, "Panjang lahir", { required: false }),
  };
  if (!isEdit) {
    e.weight = checkNumber(v.weight, 1, 30, "Berat badan");
    e.height = checkNumber(v.height, 30, 130, "Panjang/tinggi badan");
    e.headCircumference = checkNumber(v.headCircumference, 25, 60, "Lingkar kepala");
    if (!v.measuredAt) e.measuredAt = "Tanggal pengukuran wajib diisi";
    else if (v.measuredAt > todayISO()) e.measuredAt = "Tidak boleh di masa depan";
    else if (v.birthDate && v.measuredAt < v.birthDate) e.measuredAt = "Tidak boleh sebelum tanggal lahir";
  }
  return clean(e);
}

export function validateNutrition(v) {
  const e = {};
  if (!v.feedingType) e.feedingType = "Pilih pola pemberian makan";
  if (v.allergies.length === 0 && v.otherAllergies.length === 0) {
    e.allergies = 'Pilih alergi anak, atau "Tidak ada alergi"';
  }
  return e;
}

export function validateParent(v) {
  const e = {};
  const phone = v.phone.replace(/[\s-]/g, "");
  if (!phone) e.phone = "Nomor telepon wajib diisi";
  else if (!/^(\+62|62|0)8\d{8,11}$/.test(phone)) e.phone = "Format tidak valid, contoh: 081234567890";

  if (v.city.trim().length < 2) e.city = "Kota wajib diisi";
  if (!v.role) e.role = "Pilih peran Anda";
  return e;
}