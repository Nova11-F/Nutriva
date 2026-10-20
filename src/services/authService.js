import { users } from "../data/users";
import { delay, loadTable, saveTable } from "./fakeDb";

const USERS_KEY = "nutriva_users";
const SESSION_KEY = "nutriva_session";

const getUsers = () => loadTable(USERS_KEY, users);

const withoutPassword = ({ password, ...rest }) => rest;

export const authService = {
  async register({ name, email, password }) {
    await delay();
    const all = getUsers();

    const emailTaken = all.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) throw new Error("Email sudah terdaftar");

    const newUser = { id: Date.now(), name, email, password };
    saveTable(USERS_KEY, [...all, newUser]);
    return withoutPassword(newUser);
  },

  async login({ email, password }) {
    await delay();
    const found = getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Email atau kata sandi salah");

    localStorage.setItem(SESSION_KEY, String(found.id));
    return withoutPassword(found);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async getSession() {
    const id = Number(localStorage.getItem(SESSION_KEY));
    if (!id) return null;
    const found = getUsers().find((u) => u.id === id);
    return found ? withoutPassword(found) : null;
  },


async updateProfile(userId, { phone, city, role }) {
  await delay();
  const updated = getUsers().map((u) =>
    u.id === userId ? { ...u, phone, city, role } : u
  );
  saveTable(USERS_KEY, updated);
  return withoutPassword(updated.find((u) => u.id === userId));
},

async changePassword(userId, { currentPassword, newPassword }) {
  await delay();
  const all = getUsers();
  const target = all.find((u) => u.id === userId);

  if (!target) throw new Error("Akun tidak ditemukan");
  if (target.password !== currentPassword) throw new Error("Kata sandi saat ini salah");

  saveTable(USERS_KEY, all.map((u) => (u.id === userId ? { ...u, password: newPassword } : u)));
},
};