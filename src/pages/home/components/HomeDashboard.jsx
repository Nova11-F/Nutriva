import Header from "../../../components/navigation/Header";
import Greeting from "../../../components/ui/Greeting";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { ChartLine, Plus, Info, ShieldAlert, Sparkles, Check } from "lucide-react";

const tabs = [
  { name: "Rayyan", age: "18 Bln", active: false },
  { name: "Aisha", age: "6 Bln", active: true },
];

const metrics = [
  { label: "Berat Badan (BB)", value: "7.2", unit: "kg", badge: "WHO Normal", delta: "+0.4 kg dari bulan lalu" },
  { label: "Panjang Badan (PB)", value: "66.0", unit: "cm", badge: "Normal", delta: "+1.2 cm dari bulan lalu" },
  { label: "Lingkar Kepala (LK)", value: "42.5", unit: "cm", badge: "Normal", delta: "+0.5 cm dari bulan lalu" },
];

const needs = [
  { label: "Energi Total", value: 600, target: 650, unit: "kkal" },
  { label: "Protein Harian", value: 10, target: 12, unit: "g" },
  { label: "Zat Besi (Fe)", value: 8.5, target: 11, unit: "mg" },
  { label: "ASI & Cairan", value: 700, target: 850, unit: "ml" },
];

const meals = [
  { time: "07:00", title: "ASI Eksklusif Sesi Pagi", name: "Menyusu langsung atau ASIP", note: "Susui sesuai permintaan anak.", done: true },
  { time: "10:00", title: "MPASI Utama", name: "Puree Daging Sapi, Sumsum & Labu Kuning", note: "Tekstur halus, tambahkan 1 sdt minyak.", next: true },
  { time: "14:30", title: "Camilan Sore", name: "Puree Alpukat Mentega & ASI", note: "Lemak sehat untuk energi tambahan." },
  { time: "17:00", title: "MPASI Sore", name: "Bubur Saring Hati Ayam Brokoli", note: "Hati ayam kaya zat besi." },
  { time: "20:00", title: "ASI Pengantar Tidur", name: "Menyusu sebelum tidur", note: "Susui sesuai permintaan anak." },
];

export default function HomeDashboard({ child }) {
  const name = child?.name ?? "Aisha";

  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 px-4 pb-6 md:px-6">
      <Greeting />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.name}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium cursor-pointer ${
                t.active ? "border-primary bg-primary text-surface" : "border-gray-200 bg-surface text-gray-600"
              }`}
            >
              {t.name} ({t.age})
              {t.active && <span className="rounded bg-white/20 px-1.5 text-[10px] font-semibold uppercase">Profil aktif</span>}
            </button>
          ))}
          <button className="flex shrink-0 items-center gap-1 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 cursor-pointer">
            <Plus size={14} /> Tambah Balita
          </button>
        </div>

        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-soft text-lg font-bold text-primary">
              AN
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-text">{name} Nur Medina</h2>
                <span className="rounded-full bg-soft px-3 py-0.5 text-xs font-semibold text-primary">
                  Status Gizi (WHO) Normal
                </span>
              </div>
              <p className="text-sm text-gray-500">Perempuan · 6 Bulan (Lahir 24 April 2026)</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-warning bg-yellow-50 px-3 py-1 text-xs font-medium text-warning">
                  Alergi: Putih Telur
                </span>
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary">
                  Fase MPASI: Pemula (Purée / Saring Lembut)
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ChartLine size={16} /> Lihat Grafik
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <Plus size={16} /> Catat Timbangan Baru
            </Button>
          </div>
        </Card>

        {/* Ukuran fisik */}
        <div className="grid gap-3 md:grid-cols-3">
          {metrics.map((m) => (
            <Card key={m.label} variant="silver" className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-gray-500">{m.label}</p>
                <span className="rounded bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">{m.badge}</span>
              </div>
              <p className="text-2xl font-bold text-text">
                {m.value} <span className="text-sm font-medium text-gray-500">{m.unit}</span>
              </p>
              <p className="text-xs text-gray-500">{m.delta}</p>
            </Card>
          ))}
        </div>

        <Card variant="success" padding="sm" className="flex items-start gap-2 text-xs text-gray-600">
          <Info size={16} className="mt-0.5 shrink-0 text-primary" />
          Perkembangan {name} berada dalam jalur normal menurut standar WHO. Timbang dan ukur rutin
          setiap bulan di posyandu.
        </Card>

        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">Kebutuhan Nutrisi {name} Hari Ini</h3>
            <p className="text-xs text-gray-500">Perkiraan kebutuhan berdasarkan usia.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {needs.map((n) => {
              const percent = Math.round((n.value / n.target) * 100);
              return (
                <div key={n.label} className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase text-gray-500">{n.label}</span>
                    <span className="font-bold text-primary">{percent}%</span>
                  </div>
                  <p className="text-xl font-bold text-text">
                    {n.value}
                    <span className="text-sm font-medium text-gray-500"> / {n.target} {n.unit}</span>
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">Jadwal Makan & Menu MPASI {name} Hari Ini</h3>
            <p className="text-xs text-gray-500">Menu menyesuaikan alergi dan usia anak.</p>
          </div>
          <ol className="flex flex-col gap-3">
            {meals.map((m) => (
              <li
                key={m.time}
                className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between ${
                  m.next ? "border-primary bg-soft" : "border-gray-200"
                } ${m.done ? "opacity-70" : ""}`}
              >
                <div className="flex gap-4">
                  <span className="w-12 shrink-0 text-sm font-semibold text-gray-500">{m.time}</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-gray-400">{m.title}</p>
                    <p className="font-semibold text-text">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.note}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={m.done ? "outline" : "primary"}
                  className="flex w-full items-center justify-center gap-1 md:w-fit"
                >
                  {m.done ? <><Check size={14} /> Selesai</> : "Tandai Selesai"}
                </Button>
              </li>
            ))}
          </ol>
        </Card>

        <Card variant="warning" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="shrink-0 text-warning" />
            <div>
              <h3 className="font-bold text-text">Protokol Alergi {name}: Telur</h3>
              <p className="mt-1 text-sm text-gray-600">
                Menu otomatis menghindari bahan pemicu alergi. Perkenalkan makanan baru satu per satu
                dan pantau reaksi anak.
              </p>
            </div>
          </div>
          <Button className="flex w-full items-center justify-center gap-2 md:w-fit">
            <Sparkles size={16} /> Tanya Asisten AI
          </Button>
        </Card>
      </div>
    </>
  );
}