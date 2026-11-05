// Uji silang z-score WHO: port JS (src/lib/whoGrowth.js) vs engine Python (fixture golden).
// Jalankan: npm run test:who
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/lib/whoGrowth.js"), "utf8");
const data = readFileSync(join(root, "src/data/who/who_lms.json"), "utf8");
// Node belum bisa impor JSON tanpa import attributes; sisipkan data sebagai konstanta.
const patched = src.replace(/import who from "[^"]+";/, `const who = ${data};`);
const dir = mkdtempSync(join(tmpdir(), "who-"));
const file = join(dir, "whoGrowth.mjs");
writeFileSync(file, patched);
const who = await import(pathToFileURL(file).href);

const golden = JSON.parse(readFileSync(join(root, "ai-service/tests/fixtures/who_golden.json"), "utf8"));
let fail = 0;
const same = (a, b) => (a === null ? Number.isNaN(b) : Math.abs(a - b) < 1e-9);
for (const r of golden) {
  const got = {
    haz: who.haz(r.age, r.gender, r.height),
    waz: who.waz(r.age, r.gender, r.weight),
    whz: who.whz(r.age, r.gender, r.height, r.weight),
  };
  for (const k of ["haz", "waz", "whz"]) {
    if (!same(r[k], got[k])) {
      fail++;
      if (fail <= 5) console.error(`MISMATCH ${k}`, r, got[k]);
    }
  }
}
// sanity: usia & mapping gender
const checks = [
  [who.ageInMonthsAt("2024-01-31", "2024-02-29"), 0],
  [who.ageInMonthsAt("2024-01-15", "2025-01-15"), 12],
  [who.toApiGender("Laki-laki"), "M"],
  [who.toApiGender("female"), "F"],
];
checks.forEach(([got, exp], i) => {
  if (got !== exp) {
    fail++;
    console.error(`sanity #${i} gagal: ${got} !== ${exp}`);
  }
});
if (fail) {
  console.error(`${fail} kegagalan dari ${golden.length * 3 + checks.length} cek`);
  process.exit(1);
}
console.log(`OK: ${golden.length} kasus x 3 indikator identik dengan engine Python (+${checks.length} sanity)`);
