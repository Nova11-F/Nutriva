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
  RotateCcw,
} from "lucide-react";
import { useChild } from "../../../hooks/useChild";
import { growthService } from "../../../services/growthService";
import { recipeService } from "../../../services/recipeService";
import { todayISO } from "../../../utils/formatDate";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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

function getScheduleForAge(ageMonths, dayIndex = new Date().getDay()) {
  if (ageMonths < 6) {
    return [
      { time: "06:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Sesuai kebutuhan bayi.", done: false },
      { time: "09:00", title: "ASI Menjelang Siang", name: "Menyusu langsung atau ASIP", note: "Minimal 15-20 menit.", next: true },
      { time: "12:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Pastikan pelekatan optimal." },
      { time: "15:00", title: "ASI Sore", name: "Menyusu langsung atau ASIP", note: "Sesuai permintaan." },
      { time: "18:00", title: "ASI Malam", name: "Menyusu pengantar tidur", note: "Menenangkan bayi." },
    ];
  }

  if (ageMonths <= 8) {
    const schedules6to8 = [
      // 0: Minggu
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Sesuai permintaan si kecil.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Puree Daging Sapi & Labu Kuning", note: "Tekstur saring halus (purée), kaya zat besi hewani.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Membantu hidrasi dan antibodi." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Alpukat Mentega & ASI", note: "Kaya lemak sehat nabati." },
        { time: "17:30", title: "MPASI Sore", name: "Bubur Saring Hati Ayam & Brokoli", note: "Pencegahan stunting optimal." },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Menenangkan tidur malam." },
      ],
      // 1: Senin
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Susu kaya antibodi pagi hari.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Bubur Daging Sapi & Wortel Lembut", note: "Zat besi hewani & vitamin A linear.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Hidrasi alami tubuh." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Pepaya Manis & ASI", note: "Vitamin C dan serat pencernaan." },
        { time: "17:30", title: "MPASI Sore", name: "Puree Hati Ayam & Bayam Gurih", note: "Superfood zat besi penambah Hb." },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Menenangkan tidur bayi." },
      ],
      // 2: Selasa
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Nutrisi awal hari.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Puree Ikan Kembung & Kentang Halus", note: "Omega-3 tinggi untuk otak.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Kenyang dan nyaman." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Pisang Barangan & ASI", note: "Kalium dan prebiotik alami." },
        { time: "17:30", title: "MPASI Sore", name: "Bubur Saring Ayam Kampung & Labu Siam", note: "Protein mudah cerna.", done: false },
        { time: "20:00", title: "ASI Malam", name: "Menyusu pengantar tidur", note: "Tidur nyenyak berkualitas." },
      ],
      // 3: Rabu
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Asupan pagi hari.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Bubur Halus Telur Puyuh & Bayam", note: "Kolin dan protein berkualitas.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Cairan & imun tubuh." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Buah Naga Merah & ASI", note: "Antioksidan dan serat.", done: false },
        { time: "17:30", title: "MPASI Sore", name: "Puree Daging Sapi & Wortel", note: "Zat besi hewani & energi.", done: false },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Istirahat optimal." },
      ],
      // 4: Kamis
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Susu pagi hari.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Puree Hati Ayam & Kentang Lembut", note: "Zat besi tinggi dan kalori.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Daya tahan tubuh." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Alpukat Mentega", note: "Lemak sehat pembentuk sel saraf.", done: false },
        { time: "17:30", title: "MPASI Sore", name: "Bubur Saring Ikan Kembung & Brokoli", note: "Omega-3 dan asam folat.", done: false },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Tidur lelap." },
      ],
      // 5: Jumat
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Awalan hari bertenaga.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Bubur Saring Daging Sapi & Labu Kuning", note: "Vitamin A dan zat besi.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Hidrasi seimbang." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Pepaya & Jeruk Manis Bayi", note: "Vitamin C alami.", done: false },
        { time: "17:30", title: "MPASI Sore", name: "Bubur Halus Telur Puyuh & Wortel", note: "Asam amino lengkap.", done: false },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Kualitas tidur maksimal." },
      ],
      // 6: Sabtu
      [
        { time: "07:00", title: "ASI Pagi", name: "Menyusu langsung atau ASIP", note: "Antibodi harian.", done: false },
        { time: "10:00", title: "MPASI Utama Pagi", name: "Puree Ayam Kampung & Jagung Manis", note: "Energi dan protein.", next: true },
        { time: "13:00", title: "ASI Siang", name: "Menyusu langsung atau ASIP", note: "Pelekatan optimal." },
        { time: "15:30", title: "Selingan Sore", name: "Puree Pisang Raja & ASI", note: "Energi sore hari.", done: false },
        { time: "17:30", title: "MPASI Sore", name: "Puree Hati Ayam & Bayam Hijau", note: "Pencegahan stunting optimal.", done: false },
        { time: "20:00", title: "ASI Malam", name: "Menyusu sebelum tidur", note: "Tidur tenang." },
      ],
    ];
    return schedules6to8[dayIndex % 7];
  }

  // 9 bulan ke atas
  const schedules9Plus = [
    // 0: Minggu
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Gurih Semur Ayam Kampung & Telur Puyuh", note: "Protein ganda hewani, lauk padat nutrisi.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Puding Ubi Ungu & Buah Melon Potong", note: "Kaya serat alami dan antioksidan.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Ikan Kembung & Labu Kuning", note: "Tinggi Omega-3 untuk perkembangan kognitif otak." },
      { time: "16:00", title: "Selingan Sore", name: "Smoothie Pisang Buah Naga & Susu Balita", note: "Pemberi energi bermain sore hari." },
      { time: "18:30", title: "Makan Malam", name: "Nasi Tim Daging Sapi Cincang & Sup Jagung", note: "Cukupi kebutuhan zat besi dan kalori harian." },
    ],
    // 1: Senin
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Ayam Kampung & Wortel Parut", note: "Tekstur cincang lembut, lauk padat protein.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Potongan Buah Pepaya Manis & Keju Balita", note: "Serat alami dan kalsium untuk tulang.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Salmon, Tahu Sutra & Bayam Hijau", note: "Asam lemak Omega-3 dan zat besi tinggi." },
      { time: "16:00", title: "Selingan Sore", name: "Puding Susu UHT / Biskuit Balita", note: "Pemberi energi aktif bermain." },
      { time: "18:30", title: "Makan Malam", name: "Nasi Lembek Daging Cincang & Sup Jagung", note: "Tinggi zat besi penunjang tumbuh kembang." },
    ],
    // 2: Selasa
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Hati Ayam & Bayam Tinggi Zat Besi", note: "Superfood zat besi proteksi dini stunting.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Puree Pisang Barangan & Yoghurt Plain", note: "Prebiotik sehat pelindung saluran cerna.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Daging Sapi & Wortel Lembut", note: "Zat besi hewani & vitamin A linear." },
      { time: "16:00", title: "Selingan Sore", name: "Biskuit Balita & Sari Apel Kukus", note: "Camilan bernutrisi tanpa pemanis buatan." },
      { time: "18:30", title: "Makan Malam", name: "Sup Bola Telur Puyuh & Sayur Pelangi", note: "Kolin telur puyuh & aneka vitamin sayur." },
    ],
    // 3: Rabu
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Telur Puyuh & Hati Ayam Cincang", note: "Kombinasi prohe ganda padat nutrisi.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Potongan Buah Melon & Keju Lembut", note: "Hidrasi segar dan kalsium alami." },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Ikan Kembung & Labu Kuning", note: "Omega-3 lokal terbaik pencegah stunting.", next: true },
      { time: "16:00", title: "Selingan Sore", name: "Smoothie Alpukat Mentega & Pisang", note: "Lemak sehat nabati penambah berat badan." },
      { time: "18:30", title: "Makan Malam", name: "Bola-bola Daging Cincang & Sup Brokoli", note: "Kalsium dan protein pembentukan massa otot." },
    ],
    // 4: Kamis
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Bubur Daging Sapi & Wortel Lembut", note: "Kaya zat besi hewani dan kaldu gurih.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Puree Buah Naga Merah & Pepaya", note: "Serat alami dan vitamin C harian.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Ikan Lele Fillet & Daun Kelor", note: "Tinggi protein lokal, kalsium, dan zink." },
      { time: "16:00", title: "Selingan Sore", name: "Puding Santan Ubi Ungu & Madu Balita", note: "Karbohidrat kompleks & lemak sehat santan." },
      { time: "18:30", title: "Makan Malam", name: "Sup Bola Daging Kentang & Wortel Rebus", note: "Padat kalori penunjang percepatan berat badan." },
    ],
    // 5: Jumat
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Ayam Kampung & Jagung Manis", note: "Karbohidrat dan protein seimbang.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Potongan Buah Pepaya Manis & Keju", note: "Serat alami dan kesehatan tulang.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Puree Hati Ayam & Brokoli Rebus", note: "Zat besi hewani tinggi pencegah anemia.", next: true },
      { time: "16:00", title: "Selingan Sore", name: "Puding Susu UHT / Biskuit Balita", note: "Energi bermain sore balita aktif." },
      { time: "18:30", title: "Makan Malam", name: "Nasi Lembek Ikan Kembung & Sup Tomat Telur", note: "Segar bergizi seimbang tinggi protein." },
    ],
    // 6: Sabtu
    [
      { time: "07:00", title: "Sarapan Pagi", name: "Nasi Tim Salmon & Kentang Puree Gurih", note: "Omega-3 dan energi padat untuk pagi ceria.", done: false },
      { time: "10:00", title: "Snack Sehat Pagi", name: "Puree Alpukat Mentega & Susu Balita", note: "Lemak sehat asam folat pembentuk sel otak.", next: true },
      { time: "12:30", title: "Makan Siang", name: "Nasi Tim Daging Sapi & Tahu Sutra", note: "Protein hewani ganda & nabati bermutu tinggi." },
      { time: "16:00", title: "Selingan Sore", name: "Potongan Buah Pisang & Biskuit Balita", note: "Camilan sore praktis dan bernutrisi." },
      { time: "18:30", title: "Makan Malam", name: "Sup Bola Telur Puyuh & Sayur Pelangi", note: "Kolin otak dan vitamin komplit penutup hari." },
    ],
  ];

  return schedules9Plus[dayIndex % 7];
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

  const today = todayISO();
  const dayName = DAY_NAMES[new Date().getDay()];

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

  // Muat jadwal makan tersimpan atau rotasi harian dengan status checklist persisten
  const loadMealSchedule = useCallback(async () => {
    const storageKey = `nutriva_meal_done_${currentChild?.id || "default"}_${today}`;
    const baseSchedule = getScheduleForAge(ageMonths);

    let activeSchedule = baseSchedule;
    if (currentChild?.id) {
      try {
        const savedPlans = await recipeService.getSavedMealPlans(currentChild.id);
        if (savedPlans && savedPlans.length > 0) {
          const latestPlan = savedPlans[0];
          const sessions = latestPlan.input_preferences?.sessions;
          if (Array.isArray(sessions) && sessions.length > 0) {
            activeSchedule = sessions.map((s, idx) => ({
              time: s.time || "12:00",
              title: s.type || "Makan",
              name: s.menu || "Menu Seimbang",
              note: "Jadwal rencana makan kustom Anda.",
              next: idx === 0,
              done: false,
            }));
          }
        }
      } catch (err) {
        console.warn("Notice loading saved plans:", err);
      }
    }

    try {
      const savedDone = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const mapped = activeSchedule.map((item, idx) => ({
        ...item,
        done: savedDone[idx] !== undefined ? !!savedDone[idx] : false,
      }));
      setMealList(mapped);
    } catch {
      setMealList(activeSchedule);
    }
  }, [currentChild?.id, ageMonths, today]);

  useEffect(() => {
    loadMealSchedule();
  }, [loadMealSchedule]);

  const toggleMeal = (index) => {
    setMealList((prev) => {
      const nextList = prev.map((m, i) => (i === index ? { ...m, done: !m.done } : m));
      const storageKey = `nutriva_meal_done_${currentChild?.id || "default"}_${today}`;
      const doneMap = {};
      nextList.forEach((m, i) => {
        doneMap[i] = m.done;
      });
      localStorage.setItem(storageKey, JSON.stringify(doneMap));
      return nextList;
    });
  };

  const resetTodayMeal = () => {
    if (!window.confirm("Atur ulang status selesai jadwal makan hari ini?")) return;
    const storageKey = `nutriva_meal_done_${currentChild?.id || "default"}_${today}`;
    localStorage.removeItem(storageKey);
    setMealList((prev) => prev.map((m) => ({ ...m, done: false })));
  };

  const totalMeals = mealList.length;
  const completedMeals = mealList.filter((m) => m.done).length;
  const allCompleted = totalMeals > 0 && completedMeals === totalMeals;
  const progressPercent = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

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
    const bb =
      latestGrowth?.weight ??
      currentChild?.initialWeight ??
      currentChild?.initial_weight_kg ??
      currentChild?.birthWeight ??
      0;
    const pb =
      latestGrowth?.height ??
      currentChild?.initialHeight ??
      currentChild?.initial_height_cm ??
      currentChild?.birthLength ??
      0;
    const lk =
      latestGrowth?.headCircumference ??
      currentChild?.headCircumference ??
      0;

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-text">
                  Jadwal Makan & Rekomendasi Menu {childName} Hari Ini
                </h3>
                <span className="rounded-full bg-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {dayName}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Jadwal berotasi otomatis setiap hari sesuai usia ({ageMonths} bulan) dan preferensi makanan.
              </p>
            </div>
            {completedMeals > 0 && (
              <button
                type="button"
                onClick={resetTodayMeal}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer self-start sm:self-auto"
                title="Atur ulang checklist hari ini"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* Indikator Progres Harian */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Progres Pemenuhan Gizi Harian:</span>
              <span className="font-bold text-primary">
                {completedMeals} dari {totalMeals} Sesi Selesai ({progressPercent}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Kartu Pencapaian jika semua selesai */}
          {allCompleted && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-emerald-800">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                <Check size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Target Makan Hari Ini Terpenuhi 100%! 🎉</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Luar biasa! Seluruh jadwal makan {childName} telah selesai. Kebutuhan kalori dan zat besi si kecil hari ini tercukupi dengan baik.
                </p>
              </div>
            </div>
          )}

          <ol className="flex flex-col gap-3">
            {mealList.map((m, idx) => (
              <li
                key={m.time + idx}
                className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between transition-all duration-200 ${
                  m.done
                    ? "border-emerald-200 bg-emerald-50/40 opacity-80"
                    : m.next
                    ? "border-primary/50 bg-soft/40 shadow-xs"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex gap-4">
                  <span className={`w-12 shrink-0 text-sm font-semibold ${m.done ? "text-emerald-700 line-through" : "text-gray-500"}`}>
                    {m.time}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase text-gray-400">
                        {m.title}
                      </p>
                      {m.done && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                          Telah Disantap
                        </span>
                      )}
                    </div>
                    <p className={`font-semibold ${m.done ? "text-gray-500 line-through" : "text-text"}`}>
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500">{m.note}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={m.done ? "outline" : "primary"}
                  className={`flex w-full items-center justify-center gap-1 md:w-fit cursor-pointer transition ${
                    m.done ? "border-emerald-400 text-emerald-700 hover:bg-emerald-50" : ""
                  }`}
                  onClick={() => toggleMeal(idx)}
                >
                  {m.done ? (
                    <>
                      <Check size={14} className="text-emerald-600" /> Selesai
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
