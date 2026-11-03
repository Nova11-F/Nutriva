import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/navigation/Header";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  ChartLine,
  Plus,
  Info,
  ShieldAlert,
  Sparkles,
  Check,
} from "lucide-react";
import { useChild } from "../../../hooks/useChild";
import { growthService } from "../../../services/growthService";

function getDiffMonths(birthDateStr, targetDateStr = new Date()) {
  if (!birthDateStr) return 0;
  const b = new Date(birthDateStr);
  const t = new Date(targetDateStr);
  const diffTime = t - b;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
}

function getMpasiPhase(ageMonths) {
  if (ageMonths < 6) return "Fase ASI Eksklusif";
  if (ageMonths <= 8) return "Fase MPASI: Pemula (Purée / Saring Lembut)";
  if (ageMonths <= 11) return "Fase MPASI: Tekstur Cincang Kasar (Finger Food)";
  if (ageMonths <= 23) return "Fase MPASI: Makanan Keluarga Cincang / Normal";
  return "Menu Makanan Balita Seimbang";
}

function getScheduleForAge(ageMonths, childName) {
  if (ageMonths < 6) {
    return [
      { time: "06:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Sesuai kebutuhan bayi.", done: true },
      { time: "09:00", title: "ASI Menjelang Siang", name: "Menyusu langsung atau ASIP", note: "Minimal 15-20 menit.", next: true },
      { time: "12:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Pastikan pelekatan optimal." },
      { time: "15:00", title: "ASI Sore", name: "Menyusu langsung atau ASIP", note: "Sesuai permintaan." },
      { time: "18:00", title: "ASI Malam", name: "Menyusu pengantar tidur", note: "Menenangkan bayi." },
    ];
  }

  if (ageMonths <= 8) {
    return [
      { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Susui sesuai permintaan si kecil.", done: true },
      { time: "10:00", title: "MPASI Utama Pagi", name: "Puree Daging Sapi, Sumsum & Labu Kuning", note: "Tekstur saring halus (purée), tambahkan lemak sehat.", next: true },
      { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Membantu hidrasi dan antibodi." },
      { time: "15:30", title: "Selingan / Camilan Sore", name: "Puree Alpukat Mentega & ASI", note: "Kaya lemak sehat dan mikronutrien." },
      { time: "17:30", title: "MPASI Sore", name: "Bubur Saring Hati Ayam & Brokoli", note: "Kaya zat besi untuk cegah anemia." },
      { time: "20:00", title: "ASI Pengantar Tidur", name: "Menyusu sebelum tidur", note: "Membantu tidur lebih nyenyak." },
    ];
  }

  // 9 bulan ke atas
  return [
    { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Ayam Kampung & Wortel", note: "Tekstur cincang lembut, lauk padat nutrisi.", done: true },
    { time: "10:00", title: "Snack Sehat Pagi", name: "Potongan Buah Pepaya Manis & Keju", note: "Serat alami dan kalsium untuk pertumbuhan tulang.", next: true },
    { time: "12:30", title: "Makan Siang", name: "Nasi Tim Salmon, Tahu & Bayam Hijau", note: "Asam lemak Omega-3 dan zat besi tinggi." },
    { time: "16:00", title: "Selingan Sore", name: "Puding Susu UHT / Biskuit Balita", note: "Pemberi energi bermain sore hari." },
    { time: "18:30", title: "Makan Malam", name: "Nasi Lembek Daging Cincang & Sup Jagung", note: "Cukupi kebutuhan protein harian." },
  ];
}

export default function HomeDashboard({ child }) {
  const navigate = useNavigate();
  const { childList, selectChild } = useChild();

  const [latestGrowth, setLatestGrowth] = useState(null);
  const [mealList, setMealList] = useState([]);

  const currentChild = child || childList[0] || null;
  const childName = currentChild?.name ?? "Si Kecil";
  const initial = currentChild?.name ? currentChild.name.slice(0, 2).toUpperCase() : "AN";

  const ageMonths = useMemo(() => {
    return getDiffMonths(currentChild?.birthDate);
  }, [currentChild?.birthDate]);

  const mpasiPhase = useMemo(() => {
    return getMpasiPhase(ageMonths);
  }, [ageMonths]);

  // Load pengukuran terakhir dari Supabase
  const loadGrowth = useCallback(async () => {
    if (!currentChild?.id) return;
    try {
      const data = await growthService.getLatest(currentChild.id);
      setLatestGrowth(data);
    } catch (e) {
      console.error("Gagal load latest growth:", e);
    }
  }, [currentChild?.id]);

  useEffect(() => {
    loadGrowth();
  }, [loadGrowth]);

  useEffect(() => {
    setMealList(getScheduleForAge(ageMonths, childName));
  }, [ageMonths, childName]);

  const toggleMeal = (index) => {
    setMealList((prev) =>
      prev.map((m, i) => (i === index ? { ...m, done: !m.done } : m))
    );
  };

  const birthDateFormatted = useMemo(() => {
    if (!currentChild?.birthDate) return "-";
    return new Date(currentChild.birthDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [currentChild?.birthDate]);

  // Metrics pertumbuhan dinamis
  const metrics = useMemo(() => {
    const bb = latestGrowth?.weight ?? currentChild?.initialWeightKg ?? 0;
    const pb = latestGrowth?.height ?? currentChild?.initialHeightCm ?? 0;
    const lk = latestGrowth?.headCircumference ?? 0;

    const wazStatus = latestGrowth?.zScoreWaz != null
      ? (latestGrowth.zScoreWaz < -2 ? "Perlu Perhatian" : "WHO Normal")
      : "Normal";

    const hazStatus = latestGrowth?.zScoreHaz != null
      ? (latestGrowth.zScoreHaz < -2 ? "Stunting" : "Normal")
      : "Normal";

    return [
      {
        label: "Berat Badan (BB)",
        value: bb > 0 ? bb.toFixed(1) : "-",
        unit: "kg",
        badge: wazStatus,
        delta: latestGrowth ? "Data pengukuran terakhir" : "Data saat registrasi awal",
      },
      {
        label: "Panjang Badan (PB/TB)",
        value: pb > 0 ? pb.toFixed(1) : "-",
        unit: "cm",
        badge: hazStatus,
        delta: latestGrowth ? "Data pengukuran terakhir" : "Data saat registrasi awal",
      },
      {
        label: "Lingkar Kepala (LK)",
        value: lk > 0 ? lk.toFixed(1) : "-",
        unit: "cm",
        badge: "Normal",
        delta: lk > 0 ? "Data tercatat" : "Belum dicatat",
      },
    ];
  }, [latestGrowth, currentChild]);

  // List alergen anak
  const allergies = useMemo(() => {
    if (Array.isArray(currentChild?.avoidedFoods) && currentChild.avoidedFoods.length > 0) {
      return currentChild.avoidedFoods;
    }
    return [];
  }, [currentChild]);

  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 px-4 pb-6 md:px-6">
        {/* Tab Switch Profil Anak Dinamis */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {childList.map((t) => {
            const isActive = t.id === currentChild?.id;
            const tAge = getDiffMonths(t.birthDate);
            return (
              <Button
                key={t.id}
                onClick={() => selectChild(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary text-surface"
                    : "border-gray-200 bg-surface text-text hover:bg-gray-50"
                }`}
              >
                {t.name} ({tAge} Bln)
                {isActive && (
                  <span className="rounded bg-white/20 px-1.5 text-[10px] font-semibold uppercase">
                    Profil aktif
                  </span>
                )}
              </Button>
            );
          })}
          <Button
            onClick={() =>
              navigate("/onboarding", { state: { from: "/home" } })
            }
            variant="ghost"
            className="flex shrink-0 items-center gap-1 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-background cursor-pointer"
          >
            <Plus size={14} /> Tambah Balita
          </Button>
        </div>

        {/* Card Profil Anak Aktif */}
        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-soft text-lg font-bold text-primary">
              {initial}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-text">
                  {childName}
                </h2>
                <span className="rounded-full bg-soft px-3 py-0.5 text-xs font-semibold text-primary">
                  Status Gizi: {latestGrowth?.needsAttention ? "Perlu Evaluasi" : "WHO Normal"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {currentChild?.gender || "Balita"} · {ageMonths} Bulan (Lahir {birthDateFormatted})
              </p>
              <div className="flex flex-wrap gap-2">
                {allergies.length > 0 ? (
                  allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="rounded-full border border-warning bg-yellow-50 px-3 py-1 text-xs font-medium text-warning"
                    >
                      Alergi: {allergy}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                    Bebas Alergi
                  </span>
                )}
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary">
                  {mpasiPhase}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-center gap-2 md:w-fit cursor-pointer"
              onClick={() => navigate("/growth")}
            >
              <ChartLine size={16} /> Lihat Grafik
            </Button>
            <Button
              size="sm"
              className="flex w-full items-center justify-center gap-2 md:w-fit cursor-pointer"
              onClick={() =>
                navigate("/growth/measurement", { state: { from: "/home" } })
              }
            >
              <Plus size={16} /> Catat Timbangan Baru
            </Button>
          </div>
        </Card>

        {/* Kartu Metrik Antropometri Dinamis */}
        <div className="grid gap-3 md:grid-cols-3">
          {metrics.map((m) => (
            <Card
              key={m.label}
              variant="silver"
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  {m.label}
                </p>
                <span className="rounded bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {m.badge}
                </span>
              </div>
              <p className="text-2xl font-bold text-text">
                {m.value}{" "}
                <span className="text-sm font-medium text-gray-500">
                  {m.unit}
                </span>
              </p>
              <p className="text-xs text-gray-500">{m.delta}</p>
            </Card>
          ))}
        </div>

        {/* Edukasi Status Gizi */}
        <Card
          variant="success"
          padding="sm"
          className="flex items-start gap-2 text-xs text-gray-600"
        >
          <Info size={16} className="mt-0.5 shrink-0 text-primary" />
          {latestGrowth?.insightMessage ||
            `Perkembangan ${childName} terpantau dalam jalur standar WHO. Timbang dan ukur rutin setiap bulan di posyandu atau fasilitas kesehatan terdekat.`}
        </Card>

        {/* Jadwal Makan Dinamis */}
        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">
              Jadwal Makan & Rekomendasi Menu {childName} Hari Ini
            </h3>
            <p className="text-xs text-gray-500">
              Jadwal dan tekstur menu disesuaikan otomatis dengan usia ({ageMonths} bulan) dan preferensi makanan.
            </p>
          </div>
          <ol className="flex flex-col gap-3">
            {mealList.map((m, idx) => (
              <li
                key={m.time}
                className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between transition ${
                  m.next ? "border-primary bg-soft/40" : "border-gray-200"
                } ${m.done ? "opacity-70 bg-gray-50/50" : ""}`}
              >
                <div className="flex gap-4">
                  <span className="w-12 shrink-0 text-sm font-semibold text-gray-500">
                    {m.time}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      {m.title}
                    </p>
                    <p className="font-semibold text-text">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.note}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={m.done ? "outline" : "primary"}
                  className="flex w-full items-center justify-center gap-1 md:w-fit cursor-pointer"
                  onClick={() => toggleMeal(idx)}
                >
                  {m.done ? (
                    <>
                      <Check size={14} /> Selesai
                    </>
                  ) : (
                    "Tandai Selesai"
                  )}
                </Button>
              </li>
            ))}
          </ol>
        </Card>

        {/* Protokol Alergi atau Rekomendasi Khusus */}
        {allergies.length > 0 ? (
          <Card
            variant="warning"
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="shrink-0 text-warning" />
              <div>
                <h3 className="font-bold text-text">
                  Protokol Alergi {childName}: {allergies.join(", ")}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Sistem Nutriva memfilter bahan pemicu alergi dari rekomendasi menu. Jika memperkenalkan makanan baru, berikan satu jenis selama 3 hari berturut-turut untuk memantau respons tubuh si kecil.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/assistant")}
              className="flex w-full items-center justify-center gap-2 md:w-fit cursor-pointer"
            >
              <Sparkles size={16} /> Tanya Asisten AI
            </Button>
          </Card>
        ) : (
          <Card
            variant="soft"
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="shrink-0 text-primary" />
              <div>
                <h3 className="font-bold text-text">
                  Konsultasi Menu Nutrisi dengan Asisten AI Nutriva
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Bingung memilih variasi MPASI untuk {childName}? Asisten AI siap membantu menyusun menu gizi seimbang harian berbasis pedoman Kemenkes RI.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/assistant")}
              className="flex w-full items-center justify-center gap-2 md:w-fit cursor-pointer"
            >
              <Sparkles size={16} /> Konsultasi Sekarang
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}
