import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  ShieldAlert,
  Sparkles,
  Pencil,
  Clock,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const children = [
  {
    id: 1,
    initial: "RA",
    name: "Rayyan Al-Fatih",
    age: "18 bulan",
    allergy: null,
  },
  {
    id: 2,
    initial: "AH",
    name: "Aisha Humaira",
    age: "6 bulan",
    allergy: "Putih Telur",
  },
];

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const sessionTypes = ["Makan Utama", "Selingan", "ASI / Susu"];

const recommendations = [
  "Nasi Tim Hati Ayam & Wortel Gurih",
  "Puree Alpukat Santan & Potongan Buah Naga",
  "Semur Ayam Kampung + 2 Telur Puyuh + Buncis Iris",
  "Bola Daging Sapi Cincang, Kentang Halus, Wortel Parut Rebus",
];

const initialSessions = [
  {
    id: 1,
    time: "07:00",
    type: "Makan Utama",
    menu: recommendations[0],
    custom: false,
  },
  {
    id: 2,
    time: "09:30",
    type: "Selingan",
    menu: recommendations[1],
    custom: false,
  },
  {
    id: 3,
    time: "12:00",
    type: "Makan Utama",
    menu: recommendations[2],
    custom: false,
  },
  { id: 4, time: "15:30", type: "Selingan", menu: "", custom: true },
  {
    id: 5,
    time: "18:30",
    type: "Makan Utama",
    menu: recommendations[3],
    custom: false,
  },
];

const periods = [
  {
    value: "day",
    title: "Hari ini saja",
    desc: "Jadwal berlaku untuk satu hari.",
  },
  {
    value: "week",
    title: "Mingguan",
    desc: "Jadwal diulang pada hari yang dipilih.",
  },
];

const fieldStyle =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";

export default function CreateMealPlanPage() {
  const navigate = useNavigate();
  const [childId, setChildId] = useState(1);
  const [period, setPeriod] = useState("day");
  const [activeDays, setActiveDays] = useState(["Senin"]);
  const [sessions, setSessions] = useState(initialSessions);

  const toggleDay = (d) =>
    setActiveDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const updateSession = (id, patch) =>
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );

  const removeSession = (id) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  const addSession = () =>
    setSessions((prev) => [
      ...prev,
      { id: Date.now(), time: "", type: "Selingan", menu: "", custom: false },
    ]);

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-5 px-4 py-6 md:px-6">
        <div className="flex items-center justify-between">
          <div>
          <h2 className="text-2xl font-bold text-text">Buat Jadwal Makan</h2>
          <p className="text-sm text-gray-500">
            Atur berapa kali anak makan dan pilih menu dari rekomendasi atau
            buat sendiri.
          </p>
          </div>
          <div>
            <Button
              variant="noborder"
              onClick={() => navigate("/nutrition")}
              className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4 md:size-6" /> Kembali
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">1. Pilih Anak</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {children.map((c) => {
              const active = c.id === childId;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setChildId(c.id)}
                  className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-primary bg-soft"
                      : "border-gray-200 bg-surface hover:border-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-primary">
                      {c.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-500">{c.age}</p>
                    </div>
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border ${
                        active
                          ? "border-primary bg-primary text-surface"
                          : "border-gray-300 text-transparent"
                      }`}
                    >
                      <Check size={14} />
                    </span>
                  </div>

                  {c.allergy ? (
                    <span className="flex w-fit items-center gap-1 rounded-full border border-warning bg-yellow-50 px-3 py-1 text-xs font-medium text-warning">
                      <ShieldAlert size={12} /> Alergi: {c.allergy}
                    </span>
                  ) : (
                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      Tidak ada alergi tercatat
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Periode */}
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-text">2. Periode Jadwal</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {periods.map((p) => {
              const active = period === p.value;
              return (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                    active
                      ? "border-primary bg-soft"
                      : "border-gray-200 bg-surface hover:border-primary"
                  }`}
                >
                  <input
                    type="radio"
                    name="period"
                    value={p.value}
                    checked={active}
                    onChange={() => setPeriod(p.value)}
                    className="mt-1 accent-green-700"
                  />
                  <div>
                    <p className="font-semibold text-text">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>

          {period === "week" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500">
                Pilih hari yang memakai jadwal ini:
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => {
                  const on = activeDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleDay(d)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                        on
                          ? "border-primary bg-primary text-surface"
                          : "border-gray-200 bg-surface text-gray-600 hover:border-primary"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 3. Susun jadwal */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">
                3. Susun Jadwal Makan
              </h3>
              <p className="text-xs text-gray-500">
                {sessions.length} sesi makan per hari
              </p>
            </div>
          </div>

          <Card className="flex flex-col gap-3">
            {sessions.map((s, i) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-surface">
                    {i + 1}
                  </span>

                  <div className="relative">
                    <Clock
                      size={14}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="time"
                      value={s.time}
                      onChange={(e) =>
                        updateSession(s.id, { time: e.target.value })
                      }
                      aria-label={`Jam sesi ${i + 1}`}
                      className={`${fieldStyle} w-32 pl-8`}
                    />
                  </div>

                  <select
                    value={s.type}
                    onChange={(e) =>
                      updateSession(s.id, { type: e.target.value })
                    }
                    aria-label={`Jenis sesi ${i + 1}`}
                    className={`${fieldStyle} w-auto`}
                  >
                    {sessionTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => removeSession(s.id)}
                    aria-label={`Hapus sesi ${i + 1}`}
                    className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-danger"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>

                <div className="flex flex-col gap-2 md:flex-row">
                  {s.custom ? (
                    <input
                      value={s.menu}
                      onChange={(e) =>
                        updateSession(s.id, { menu: e.target.value })
                      }
                      placeholder="Tulis menu buatan sendiri, contoh: Bubur kacang hijau + pisang"
                      aria-label={`Menu sesi ${i + 1}`}
                      className={`${fieldStyle} flex-1`}
                    />
                  ) : (
                    <select
                      value={s.menu}
                      onChange={(e) =>
                        updateSession(s.id, { menu: e.target.value })
                      }
                      aria-label={`Menu sesi ${i + 1}`}
                      className={`${fieldStyle} flex-1`}
                    >
                      <option value="">Pilih menu rekomendasi</option>
                      {recommendations.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateSession(s.id, { custom: false, menu: "" })
                      }
                      aria-pressed={!s.custom}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                        !s.custom
                          ? "border-primary bg-soft text-primary"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      <Sparkles size={12} /> Dari Nutriva
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSession(s.id, { custom: true, menu: "" })
                      }
                      aria-pressed={s.custom}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold ${
                        s.custom
                          ? "border-primary bg-soft text-primary"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      <Pencil size={12} /> Kustom
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSession}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition hover:border-primary hover:text-primary"
            >
              <Plus size={16} /> Tambah Sesi / Slot Waktu Khusus
            </button>
          </Card>
        </section>

        {/* Aksi */}
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/nutrition")}
          >
            Batal
          </Button>
          <Button type="button">Simpan Jadwal</Button>
        </div>
      </div>
    </>
  );
}
