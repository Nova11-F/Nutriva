export function getAgeInMonths(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

export function formatAge(months) {
  if (months < 24) return `${months} bulan`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? `${years} tahun ${rest} bulan` : `${years} tahun`;
}

export function formatMonthYear(isoDate) {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export function todayISO() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}