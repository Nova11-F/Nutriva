import { children } from "../data/children";
import { delay, loadTable, saveTable } from "./fakeDb";

const KEY = "nutriva_children";
const getChildren = () => loadTable(KEY, children);

export const childService = {
  async getAllByUserId(userId) {
    await delay(300);
    return getChildren().filter((c) => c.userId === userId);
  },

  async create(userId, data) {
    await delay();
    const newChild = { id: Date.now(), userId, ...data };
    saveTable(KEY, [...getChildren(), newChild]);
    return newChild;
  },

  async update(id, data) {
    await delay();
    const updated = getChildren().map((c) => (c.id === id ? { ...c, ...data } : c));
    saveTable(KEY, updated);
    return updated.find((c) => c.id === id);
  },

  async remove(id) {
    await delay();
    saveTable(KEY, getChildren().filter((c) => c.id !== id));
  },
};