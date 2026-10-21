import { fakeReplies, fallbackReply } from "../data/chatMessages";
import { delay, loadTable, saveTable } from "./fakeDb";

const KEY = "nutriva_chats";

const getTable = () => loadTable(KEY, {});

export const assistantService = {
  async getHistory(childId) {
    await delay(300);
    return getTable()[childId] ?? [];
  },

  async sendMessage(childId, text) {
    await delay(900 + Math.random() * 700); 

    const lower = text.toLowerCase();
    const matched = fakeReplies.find((r) => r.keywords.some((k) => lower.includes(k)));

    const now = Date.now();
    const userMsg = { id: now, role: "user", text, createdAt: new Date(now).toISOString() };
    const botMsg = {
      id: now + 1,
      role: "bot",
      text: matched ? matched.reply : fallbackReply,
      createdAt: new Date(now + 1).toISOString(),
    };

    const table = getTable();
    saveTable(KEY, { ...table, [childId]: [...(table[childId] ?? []), userMsg, botMsg] });
    return botMsg;
  },

  async clearHistory(childId) {
    await delay(200);
    const { [childId]: _removed, ...rest } = getTable();
    saveTable(KEY, rest);
  },
};