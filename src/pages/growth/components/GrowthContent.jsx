import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Pencil, Plus, ShieldCheck, Trash2, TriangleAlert, ChevronRight, Users } from "lucide-react";
import Header from "../../../components/navigation/Header";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const children = [
  { id: 1, initial: "RA", name: "Rayyan Al-Fatih", age: "18 Bln", weight: "9.7 kg"},
  { id: 2, initial: "AH", name: "Aisha Humaira", age: "6 Bln", weight: "7.2 kg" },
];

const latest = {
  date: "17 Oktober 2026",
  metrics: [
    {
      label: "Berat Badan",
      value: "9.7",
      unit: "kg",
      delta: "+0.4 kg dari pengukuran sebelumnya",
    },
    {
      label: "Panjang / Tinggi Badan",
      value: "79.5",
      unit: "cm",
      delta: "+1.0 cm dari pengukuran sebelumnya",
    },
    {
      label: "Lingkar Kepala",
      value: "46.8",
      unit: "cm",
      delta: "+0.3 cm dari pengukuran sebelumnya",
    },
  ],
};

const records = [
  {
    id: 1,
    date: "2026-05-17",
    label: "Mei",
    weight: 8.4,
    height: 74.0,
    head: 45.2,
    note: "Posyandu",
  },
  {
    id: 2,
    date: "2026-06-17",
    label: "Jun",
    weight: 8.7,
    height: 75.2,
    head: 45.6,
    note: "",
  },
  {
    id: 3,
    date: "2026-07-17",
    label: "Jul",
    weight: 9.0,
    height: 76.4,
    head: 45.9,
    note: "Sedang batuk pilek",
  },
  {
    id: 4,
    date: "2026-08-17",
    label: "Agu",
    weight: 9.2,
    height: 77.3,
    head: 46.2,
    note: "",
  },
  {
    id: 5,
    date: "2026-09-17",
    label: "Sep",
    weight: 9.3,
    height: 78.5,
    head: 46.5,
    note: "",
  },
  {
    id: 6,
    date: "2026-10-17",
    label: "Okt",
    weight: 9.7,
    height: 79.5,
    head: 46.8,
    note: "Posyandu",
  },
];

const chartTabs = [
  { key: "weight", title: "Berat Badan", unit: "kg", color: "#15803d" },
  { key: "height", title: "Panjang / Tinggi", unit: "cm", color: "#0ea5e9" },
  { key: "head", title: "Lingkar Kepala", unit: "cm", color: "#f59e0b" },
];

const detections = [
  {
    label: "Tinggi menurut Umur (TB/U)",
    status: "Normal",
    tone: "ok",
    zscore: "-0.8 SD",
  },
  {
    label: "Berat menurut Umur (BB/U)",
    status: "Berat badan normal",
    tone: "ok",
    zscore: "-0.4 SD",
  },
  {
    label: "Berat menurut Tinggi (BB/TB)",
    status: "Gizi baik",
    tone: "ok",
    zscore: "0.1 SD",
  },
];

const tones = {
  ok: "bg-green-50 border-green-200 text-green-700",
  warn: "bg-yellow-50 border-yellow-300 text-warning",
  bad: "bg-red-50 border-red-200 text-danger",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function GrowthContent() {
  const navigate = useNavigate();
  const [childId, setChildId] = useState(1);
  const [tab, setTab] = useState("weight");

  const activeTab = chartTabs.find((t) => t.key === tab);
  const history = [...records].reverse();

  return (
    <>
      <Header variant="pertumbuhan" />
      <div className="flex flex-col gap-5 px-4 pb-6 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Pemantauan Pertumbuhan
            </h2>
            <p className="text-sm text-gray-500">
              Pantau berat, tinggi, dan status gizi anak dari waktu ke waktu.
            </p>
          </div>
          <Button
            onClick={() =>
              navigate("/growth/measurement", { state: { from: "/growth" } })
            }
            className="flex w-full items-center justify-center gap-2 md:w-fit"
          >
            <Plus size={16} /> Catat Pengukuran
          </Button>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Pilih Balita{" "}
              <span className="ml-1 rounded bg-gray-100 px-1.5">
                {children.length} Anak
              </span>
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {children.map((p) => {
              const active = p.id === childId;
              return (
                <Card
                  key={p.id}
                  variant={active ? "success" : "default"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => setChildId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setChildId(p.id);
                    }
                  }}
                  className="flex cursor-pointer justify-center flex-col gap-3 transition hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-sm font-bold text-primary">
                      {p.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.age} · {p.weight}
                      </p>
                    </div>
                    {active && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-surface">
                        Aktif
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}

            <Card variant="soft" className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text">
                <Users size={16} className="text-primary" /> Punya Balita Lain?
              </div>
              <p className="text-xs text-gray-600">
                Daftarkan anak lainnya untuk pemantauan pertumbuhan yang
                terpisah.
              </p>
              <button
                onClick={() =>
                  navigate("/onboarding", { state: { from: "/growth" } })
                }
                className="mt-auto flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-primary"
              >
                Daftarkan Profil Anak Baru <ChevronRight size={12} />
              </button>
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text">Antropometri Terakhir</h3>
            <span className="text-xs text-gray-500">Diukur {latest.date}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {latest.metrics.map((m) => (
              <Card
                key={m.label}
                variant="silver"
                className="flex flex-col gap-1"
              >
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {m.label}
                </p>
                <p className="text-3xl font-bold text-text">
                  {m.value}{" "}
                  <span className="text-sm font-medium text-gray-500">
                    {m.unit}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{m.delta}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-text">
                Grafik Riwayat Pengukuran
              </h3>
              <p className="text-xs text-gray-500">
                Perubahan {activeTab.title.toLowerCase()} setiap bulan.
              </p>
            </div>
            <div className="flex w-fit gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
              {chartTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  aria-pressed={tab === t.key}
                  className={`rounded-md px-3 py-1.5 transition ${
                    tab === t.key
                      ? "bg-surface text-text shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={records}
                margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  unit={` ${activeTab.unit}`}
                  width={64}
                />
                <Tooltip
                  formatter={(v) => [`${v} ${activeTab.unit}`, activeTab.title]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={tab}
                  name={activeTab.title}
                  stroke={activeTab.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-text">Deteksi Stunting</h3>
              <p className="text-xs text-gray-500">
                Berdasarkan antropometri terakhir dan standar pertumbuhan anak
                WHO.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {detections.map((d) => (
              <div
                key={d.label}
                className={`flex flex-col gap-1 rounded-xl border p-4 ${tones[d.tone]}`}
              >
                <p className="text-[11px] font-semibold uppercase opacity-80">
                  {d.label}
                </p>
                <p className="text-lg font-bold">{d.status}</p>
                <p className="text-xs opacity-80">Z-score: {d.zscore}</p>
              </div>
            ))}
          </div>

          <Card
            variant="success"
            padding="sm"
            className="flex items-start gap-2 text-xs text-gray-600"
          >
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-primary" />
            Hasil ini bersifat edukatif dan bukan diagnosis. Jika status berada
            di bawah normal atau pertumbuhan melambat, konsultasikan ke
            posyandu, puskesmas, atau dokter anak.
          </Card>
        </Card>

        <Card className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text">Riwayat Pengukuran</h3>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4 font-semibold">Tanggal</th>
                  <th className="py-2 pr-4 font-semibold">Berat (kg)</th>
                  <th className="py-2 pr-4 font-semibold">PB/TB (cm)</th>
                  <th className="py-2 pr-4 font-semibold">
                    Lingkar Kepala (cm)
                  </th>
                  <th className="py-2 pr-4 font-semibold">Keterangan</th>
                  <th className="py-2 pr-4 justify-center flex font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-text">
                      {formatDate(r.date)}
                    </td>
                    <td className="py-3 pr-4 ">{r.weight}</td>
                    <td className="py-3 pr-4">{r.height}</td>
                    <td className="py-3 pr-4">{r.head}</td>
                    <td className="py-3 pr-4 text-gray-500">{r.note || "-"}</td>
                    <td className="py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          aria-label="Ubah"
                          className="text-gray-400"
                          onClick={() =>
                            navigate(`/growth/measurement?edit=${r.id}`, {
                              state: { from: "/growth" },
                            })
                          }
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          aria-label="Hapus"
                          className="text-gray-400"
                          variant="danger"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {history.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-text">
                    {formatDate(r.date)}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      aria-label="Ubah"
                      className="text-gray-400 "
                      onClick={() =>
                        navigate(`/growth/measurement?edit=${r.id}`, {
                          state: { from: "/growth" },
                        })
                      }
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      aria-label="Hapus"
                      className="text-gray-400"
                      variant="danger"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-gray-500">Berat</p>
                    <p className="font-bold text-text">{r.weight} kg</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-gray-500">PB/TB</p>
                    <p className="font-bold text-text">{r.height} cm</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-gray-500">L. Kepala</p>
                    <p className="font-bold text-text">{r.head} cm</p>
                  </div>
                </div>
                {r.note && <p className="text-xs text-gray-500">{r.note}</p>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
