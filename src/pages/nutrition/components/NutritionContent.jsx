import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/navigation/Header";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import buburWortel from "../../../assets/images/bubur-wortel.png";
import {
  Plus,
  Check,
  ShieldAlert,
  Sparkles,
  Bookmark,
  Users,
  ChevronRight,
} from "lucide-react";
import { useChild } from "../../../hooks/useChild";
import { recipeService } from "../../../services/recipeService";

function getDiffMonths(birthDateStr, targetDateStr = new Date()) {
  if (!birthDateStr) return 0;
  const b = new Date(birthDateStr);
  const t = new Date(targetDateStr);
  const diffTime = t - b;
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
}

function getMpasiPhase(ageMonths) {
  if (ageMonths < 6) return "Fase ASI Eksklusif";
  if (ageMonths <= 8) return "MPASI Pemula (Purée)";
  if (ageMonths <= 11) return "MPASI Tekstur Cincang";
  if (ageMonths <= 23) return "Transisi Menu Keluarga";
  return "Makanan Balita Mandiri";
}

function getScheduleForChild(ageMonths) {
  if (ageMonths < 6) {
    return [
      { time: "07:00 WIB", tag: "ASI PAGI", title: "ASI Eksklusif Sesi Pagi", nutrients: "Menyusu langsung atau ASIP sesuai permintaan.", done: true },
      { time: "10:00 WIB", tag: "ASI MENJELANG SIANG", title: "ASI Eksklusif Sesi 2", nutrients: "Kaya antibodi dan kolostrum lanjutan.", done: true },
      { time: "13:00 WIB", tag: "ASI SIANG", title: "ASI Eksklusif Sesi Siang", nutrients: "Membantu hidrasi dan istirahat siang.", next: true },
      { time: "16:00 WIB", tag: "ASI SORE", title: "ASI Eksklusif Sesi Sore", nutrients: "Memenuhi nutrisi pertumbuhan.", done: false },
      { time: "19:30 WIB", tag: "ASI MALAM", title: "ASI Pengantar Tidur", nutrients: "Menenangkan bayi sebelum tidur malam.", done: false },
    ];
  }

  if (ageMonths <= 8) {
    return [
      { time: "07:00 WIB", tag: "SARAPAN", title: "Bubur Saring Hati Ayam & Brokoli", nutrients: "Energi 180 kkal · Protein 8 g · Fe 3.5 mg", done: true },
      { time: "10:00 WIB", tag: "SNACK PAGI", title: "Puree Alpukat Mentega & ASI", nutrients: "Energi 140 kkal · Lemak Sehat · Kalium", done: true },
      { time: "13:00 WIB", tag: "MAKAN SIANG", title: "Puree Daging Sapi & Labu Kuning", nutrients: "Energi 210 kkal · Protein Hewani · Vitamin A", next: true },
      { time: "16:00 WIB", tag: "SNACK SORE", title: "Puree Buah Naga Merah & Pepaya", nutrients: "Energi 90 kkal · Serat Alami · Vitamin C", done: false },
      { time: "18:30 WIB", tag: "MAKAN MALAM", title: "Bubur Halus Telur Puyuh & Bayam", nutrients: "Energi 190 kkal · Protein 7 g · Kalsium", done: false },
    ];
  }

  return [
    { time: "07:00 WIB", tag: "SARAPAN", title: "Nasi Tim Telur Puyuh & Hati Ayam Cincang", nutrients: "Energi 240 kkal · Protein 11 g · Fe 3.2 mg", done: true },
    { time: "10:00 WIB", tag: "SNACK PAGI", title: "Pudding Santan Ubi Ungu & Buah Naga", nutrients: "Energi 160 kkal · Protein 3 g · Fe 0.8 mg", done: true },
    { time: "12:30 WIB", tag: "MAKAN SIANG", title: "Sup Salmon Labu Siam & Kentang Tumbuk Keju", nutrients: "Energi 280 kkal · Omega-3 Tinggi · Fe 1.6 mg", next: true },
    { time: "15:30 WIB", tag: "SNACK SORE", title: "Potongan Pepaya Plasma & Yoghurt Plain Balita", nutrients: "Energi 120 kkal · Probiotik · Vitamin C", done: false },
    { time: "18:30 WIB", tag: "MAKAN MALAM", title: "Bola-bola Daging Sapi Tomat & Nasi Tim Brokoli", nutrients: "Energi 230 kkal · Protein 10 g · Fe 2.4 mg", done: false },
  ];
}

const fallbackInspirations = [
  {
    id: 1,
    slug: "bubur-ayam-wortel",
    image: buburWortel,
    category: "Protein & Sayur: Ayam + Wortel",
    title: "Bubur Ayam Wortel",
    desc: "Kaya protein hewani dan vitamin A untuk mendukung tumbuh kembang serta daya tahan tubuh balita usia 6-12 bulan.",
    kcal: "180 kkal",
    protein: "8g Protein",
    time: "20 Menit",
  },
  {
    id: 2,
    slug: "salmon-chowder-jagung",
    image: buburWortel,
    category: "Protein Hewani: Salmon + Jagung",
    title: "Creamy Salmon Chowder Jagung Manis",
    desc: "Sumber omega-3 untuk perkembangan otak, dengan tekstur lembut yang mudah ditelan.",
    kcal: "205 kkal",
    protein: "11g Protein",
    time: "20 Menit",
  },
  {
    id: 3,
    slug: "bakso-daging-pisang",
    image: buburWortel,
    category: "Finger Food: Daging + Pisang",
    title: "Bakso Daging Pisang Santan",
    desc: "Finger food kaya zat besi untuk melatih anak makan sendiri dan mencegah anemia.",
    kcal: "170 kkal",
    protein: "8g Protein",
    time: "25 Menit",
  },
  {
    id: 4,
    slug: "pudding-ubi-ungu",
    image: buburWortel,
    category: "Karbohidrat & Sayur: Ubi + Bayam",
    title: "Pudding Ubi Ungu Bayam",
    desc: "Camilan sehat berserat dengan vitamin dan mineral untuk menjaga pencernaan anak.",
    kcal: "160 kkal",
    protein: "4g Protein",
    time: "15 Menit",
  },
];

export default function NutritionContent() {
  const navigate = useNavigate();
  const { child: activeChild, childList, selectChild } = useChild();

  const [inspirations, setInspirations] = useState(fallbackInspirations);
  const [scheduleList, setScheduleList] = useState([]);

  const currentChild = activeChild || childList[0] || null;
  const childName = currentChild?.name ?? "Si Kecil";

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const storageKey = `nutriva_meal_done_${currentChild?.id || "default"}_${today}`;

  const ageMonths = useMemo(() => {
    return getDiffMonths(currentChild?.birthDate);
  }, [currentChild?.birthDate]);

  useEffect(() => {
    let ignore = false;
    async function loadSchedule() {
      const baseSchedule = getScheduleForChild(ageMonths);
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
                tag: s.type || "Makan",
                title: s.menu || "Menu Seimbang",
                nutrients: s.nutrients || "Rencana makan kustom balita Anda.",
                next: idx === 0,
                done: false,
              }));
            }
          }
        } catch (err) {
          console.warn("Gagal membaca saved plan:", err);
        }
      }

      if (!ignore) {
        try {
          const savedDone = JSON.parse(localStorage.getItem(storageKey) || "{}");
          const mapped = activeSchedule.map((item, idx) => {
            const isDone = savedDone[idx] !== undefined ? !!savedDone[idx] : item.done;
            return {
              ...item,
              done: isDone,
              next: item.next && !isDone,
            };
          });
          setScheduleList(mapped);
        } catch {
          setScheduleList(activeSchedule);
        }
      }
    }

    loadSchedule();
    return () => {
      ignore = true;
    };
  }, [currentChild?.id, ageMonths, storageKey]);

  useEffect(() => {
    let ignore = false;
    async function loadInspirations() {
      try {
        const data = await recipeService.getAllRecipes({ ageMonths });
        if (!ignore && data && data.length > 0) {
          const mapped = data.slice(0, 4).map((r) => ({
            id: r.id,
            slug: r.slug,
            image: r.image_url || buburWortel,
            category: `${r.portion_size || "Porsi MPASI"}`,
            title: r.title,
            desc: r.instructions?.[0]?.text || `Menu bergizi seimbang untuk balita usia ${r.min_age_months}-${r.max_age_months} bulan.`,
            kcal: `${r.main_nutrients?.calories ?? "–"} kkal`,
            protein: `${r.main_nutrients?.protein_g ?? "–"}g Protein`,
            time: "25 Menit",
          }));
          setInspirations(mapped);
        }
      } catch (err) {
        console.error("Gagal load inspirasi:", err);
      }
    }
    loadInspirations();
    return () => {
      ignore = true;
    };
  }, [ageMonths]);

  const toggleConfirm = (index) => {
    setScheduleList((prev) => {
      const nextList = prev.map((s, idx) => (idx === index ? { ...s, done: !s.done, next: false } : s));
      try {
        const doneMap = {};
        nextList.forEach((s, idx) => {
          doneMap[idx] = s.done;
        });
        localStorage.setItem(storageKey, JSON.stringify(doneMap));
      } catch (err) {
        console.warn("Gagal simpan status makan lokal:", err);
      }
      return nextList;
    });
  };

  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-5 px-4 pb-6 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-bold text-text md:text-3xl">
              Nutrisi & Gizi Anak
            </h1>
            <p className="text-sm text-gray-500">
              Personalisasi rencana makan, pelacakan asupan gizi, dan
              pemantauan alergi makanan harian balita.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-fit md:flex-row">
            <Button
              variant="outline"
              onClick={() => navigate("/nutrition/recipes")}
              className="flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bookmark className="size-4 md:size-6" />
              Katalog Resep
            </Button>
            <Button
              className="flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => navigate("/nutrition/MealPlan")}
            >
              <Plus className="size-4 md:size-6" /> Buat Rencana Makan
            </Button>
          </div>
        </div>

        {/* Profil Balita Dinamis */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Profil Balita Terdaftar{" "}
              <span className="ml-1 rounded bg-gray-100 px-1.5">
                {childList.length} Anak
              </span>
            </h2>
            <Button
              onClick={() =>
                navigate("/onboarding", { state: { from: "/nutrition" } })
              }
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs font-medium border text-primary cursor-pointer"
            >
              <Plus size={12} /> Tambah Profil Anak
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {childList.map((p) => {
              const active = p.id === currentChild?.id;
              const pAge = getDiffMonths(p.birthDate);
              const initial = p.name ? p.name.slice(0, 2).toUpperCase() : "AN";
              const allergies = Array.isArray(p.avoidedFoods) && p.avoidedFoods.length > 0
                ? `Alergi: ${p.avoidedFoods.join(", ")}`
                : "Bebas Alergi";
              const phase = getMpasiPhase(pAge);

              return (
                <Card
                  key={p.id}
                  variant={active ? "success" : "default"}
                  role="button"
                  tabIndex={0}
                  aria-pressed={active}
                  onClick={() => selectChild(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectChild(p.id);
                    }
                  }}
                  className="flex cursor-pointer justify-center flex-col gap-3 transition hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-sm font-bold text-primary">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-text">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pAge} Bln · {p.initialWeightKg || "-"} kg
                      </p>
                    </div>
                    {active && (
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-surface">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        allergies.startsWith("Alergi")
                          ? "bg-yellow-50 text-warning"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {allergies}
                    </span>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-primary">
                      {phase}
                    </span>
                  </div>
                </Card>
              );
            })}

            <Card variant="soft" className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text">
                <Users size={16} className="text-primary" /> Punya Balita Lain?
              </div>
              <p className="text-xs text-gray-600">
                Daftarkan anak lainnya untuk rencana makan dan pemantauan alergi yang terpisah.
              </p>
              <button
                onClick={() =>
                  navigate("/onboarding", { state: { from: "/nutrition" } })
                }
                className="mt-auto flex w-fit items-center gap-1 text-xs font-semibold text-primary cursor-pointer hover:underline"
              >
                Daftarkan Profil Anak Baru <ChevronRight size={12} />
              </button>
            </Card>
          </div>
        </section>

        {/* Jadwal Makan Dinamis */}
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                Jadwal Asupan Nutrisi {childName} Hari Ini
              </h2>
              <p className="text-xs text-gray-500">
                Centang menu yang sudah disantap untuk memastikan target gizi harian tercapai.
              </p>
            </div>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
              {childList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectChild(c.id)}
                  className={`rounded-md px-3 py-1 cursor-pointer transition ${
                    c.id === currentChild?.id
                      ? "bg-surface text-text shadow-sm font-semibold"
                      : "text-gray-500 hover:text-text"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <ol className="grid gap-3 lg:grid-cols-2">
            {scheduleList.map((s, idx) => (
              <li
                key={s.time}
                className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                  s.next ? "border-primary bg-soft/40" : "border-gray-200"
                } ${s.done ? "bg-gray-50/60 opacity-75" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleConfirm(idx)}
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border cursor-pointer ${
                    s.done
                      ? "border-primary bg-primary text-surface"
                      : "border-gray-300 text-transparent hover:border-primary"
                  }`}
                >
                  <Check size={14} />
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-gray-500">
                      {s.time}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-600">
                      {s.tag}
                    </span>
                    {s.next && (
                      <span className="rounded bg-primary px-1.5 py-0.5 font-semibold text-surface">
                        Berikutnya
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-text">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.nutrients}</p>
                </div>
                {s.next && !s.done && (
                  <Button
                    size="sm"
                    className="shrink-0 cursor-pointer"
                    onClick={() => toggleConfirm(idx)}
                  >
                    Konfirmasi Makan
                  </Button>
                )}
              </li>
            ))}
          </ol>
        </Card>

        {/* Inspirasi Resep Dinamis */}
        <section className="flex flex-col gap-3">
          <div className="flex gap-2 md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                Inspirasi Menu Nutrisi Sesuai Usia
              </h2>
              <p className="text-xs text-gray-500">
                Rekomendasi menu terverifikasi, tinggi protein hewani dan aman dari alergen.
              </p>
            </div>
            <Button
              variant="noborder"
              onClick={() => navigate("/nutrition/recipes")}
              className="group flex w-fit items-center hover:underline cursor-pointer"
            >
              Lihat Semua Resep
              <ChevronRight
                size={20}
                className="text-secondary group-hover:text-primary"
              />
            </Button>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-4">
            {inspirations.map((m) => (
              <Card
                key={m.id || m.slug}
                padding="none"
                variant="default"
                className="group flex flex-col overflow-hidden transition-all duration-300 hover:border-secondary hover:shadow-lg hover:shadow-soft"
              >
                <div className="relative h-70 w-full overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="h-full w-full rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 right-3 z-10 rounded-xl bg-white/90 px-3 py-1.5 text-md font-bold text-gray-800 shadow-sm backdrop-blur-sm">
                    {m.time}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h4 className="text-sm font-bold text-primary">
                    {m.category}
                  </h4>
                  <h3 className="text-xl font-bold leading-snug text-text">
                    {m.title}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {m.desc}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {m.kcal} • {m.protein}
                    </span>
                    <Button
                      variant="noborder"
                      onClick={() => navigate(m.slug ? `/nutrition/${m.slug}` : `/nutrition/${m.id}`)}
                      className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary hover:text-primary hover:underline"
                    >
                      Lihat Resep <span aria-hidden="true">&rarr;</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Assistant Banner */}
        <Card
          className="flex flex-col gap-4 border-primary bg-primary text-surface md:flex-row md:items-center md:justify-between"
          variant="primary"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="shrink-0" />
            <div>
              <p className="text-sm font-bold">
                Anak sedang GTM (Gerakan Tutup Mulut) atau perlu ide variasi menu {childName}?
              </p>
              <p className="mt-1 text-xs opacity-90">
                AI Nutriva mengetahui preferensi dan usia anak. Konsultasikan ide menu bergizi, solusi GTM, dan resep yang aman.
              </p>
            </div>
          </div>
          <Button
            variant="white"
            onClick={() => navigate("/assistant")}
            className="flex w-full shrink-0 items-center justify-center gap-2 md:w-fit cursor-pointer"
          >
            <Sparkles size={16} /> Konsultasi ke Asisten AI
          </Button>
        </Card>
      </div>
    </>
  );
}
