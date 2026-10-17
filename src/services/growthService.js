import { growthRecords } from "../data/growthRecords";
import { delay, loadTable, saveTable } from "./fakeDb";

const KEY = "nutriva_growth";
const getRecords = () => loadTable(KEY, growthRecords);

const byDateAsc = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

export const growthService = {
  async getByChild(childId) {
    await delay(300);
    return getRecords()
      .filter((r) => r.childId === childId)
      .sort(byDateAsc);
  },

  async getLatest(childId) {
    await delay(200);
    const list = getRecords()
      .filter((r) => r.childId === childId)
      .sort(byDateAsc);
    return list.at(-1) ?? null;
  },

  async add({ childId, date, weight, height, headCircumference }) {
    await delay();
    const all = getRecords();

    if (all.some((r) => r.childId === childId && r.date === date)) {
      throw new Error("Pengukuran pada tanggal ini sudah ada");
    }

    const newRecord = {
      id: Date.now(),
      childId,
      date,
      weight,
      height,
      headCircumference: headCircumference ?? null,
    };
    saveTable(KEY, [...all, newRecord]);
    return newRecord;
  },

  async update(id, data) {
    await delay();
    const all = getRecords();
    const target = all.find((r) => r.id === id);
    if (!target) throw new Error("Data pengukuran tidak ditemukan");

    if (
      data.date &&
      all.some((r) => r.id !== id && r.childId === target.childId && r.date === data.date)
    ) {
      throw new Error("Pengukuran pada tanggal ini sudah ada");
    }

    const updated = all.map((r) => (r.id === id ? { ...r, ...data } : r));
    saveTable(KEY, updated);
    return updated.find((r) => r.id === id);
  },

  async remove(id) {
    await delay();
    saveTable(KEY, getRecords().filter((r) => r.id !== id));
  },

  async removeByChild(childId) {
    await delay(200);
    saveTable(KEY, getRecords().filter((r) => r.childId !== childId));
  },
};