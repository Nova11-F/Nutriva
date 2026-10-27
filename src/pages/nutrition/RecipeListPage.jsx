import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import Header from "../../components/navigation/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import buburWortel from "../../assets/images/bubur-wortel.png";

const ageFilters = ["Semua Usia", "6-8 Bulan", "9-11 Bulan", "12+ Bulan"];
const categoryFilters = [
  "Semua",
  "Protein Hewani",
  "Finger Food",
  "Sayur & Buah",
  "Camilan",
];

const featured = {
  id: 1,
  image: buburWortel,
  badge: "Menu Pilihan Konselor Gizi Pekan Ini • Cocok 100% untuk Rayyan",
  title: "Nasi Gurih Semur Ayam Kampung & Telur Puyuh",
  desc: "Kombinasi protein hewani ganda unggulan (ayam kampung + telur puyuh) kaya zat besi dan kolin, dimasak dengan kaldu cekernya alami berlemak gurih tanpa MSG untuk anak.",
  stage: "Tahapan: 12-24 Bulan",
  ribbon: "Rasio Emas 4 Bintang",
  stats: [
    { label: "Energi Total", value: "285 kkal" },
    {
      label: "Protein Hewani",
      value: "11.2g Prohe",
      accent: "text-emerald-300",
    },
    { label: "Waktu Masak", value: "25 Menit" },
    { label: "Estimasi Modal", value: "Rp 22.000", accent: "text-yellow-300" },
  ],
};

const recipes = [
  {
    id: 1,
    image: buburWortel,
    age: "6-8 Bulan",
    cat: "Protein Hewani",
    category: "Protein & Sayur: Ayam + Wortel",
    title: "Bubur Ayam Wortel",
    desc: "Kaya protein hewani dan vitamin A untuk mendukung tumbuh kembang serta daya tahan tubuh balita.",
    kcal: "180 kkal",
    protein: "8g Protein",
    time: "20 Menit",
  },
  {
    id: 2,
    image: buburWortel,
    age: "9-11 Bulan",
    cat: "Protein Hewani",
    category: "Protein Hewani: Salmon + Jagung",
    title: "Creamy Salmon Chowder Jagung Manis",
    desc: "Sumber omega-3 untuk perkembangan otak dengan tekstur lembut yang mudah ditelan.",
    kcal: "205 kkal",
    protein: "11g Protein",
    time: "20 Menit",
  },
  {
    id: 3,
    image: buburWortel,
    age: "12+ Bulan",
    cat: "Finger Food",
    category: "Finger Food: Daging + Pisang",
    title: "Bakso Daging Pisang Santan",
    desc: "Finger food kaya zat besi untuk melatih anak makan sendiri dan mencegah anemia.",
    kcal: "170 kkal",
    protein: "8g Protein",
    time: "25 Menit",
  },
  {
    id: 4,
    image: buburWortel,
    age: "6-8 Bulan",
    cat: "Sayur & Buah",
    category: "Karbohidrat & Sayur: Ubi + Bayam",
    title: "Pudding Ubi Ungu Bayam",
    desc: "Camilan sehat berserat dengan vitamin dan mineral untuk menjaga pencernaan anak.",
    kcal: "160 kkal",
    protein: "4g Protein",
    time: "15 Menit",
  },
  {
    id: 5,
    image: buburWortel,
    age: "9-11 Bulan",
    cat: "Protein Hewani",
    category: "Protein Hewani: Hati Ayam + Brokoli",
    title: "Bubur Saring Hati Ayam Brokoli",
    desc: "Hati ayam kaya zat besi, dipadukan brokoli untuk membantu penyerapan.",
    kcal: "160 kkal",
    protein: "7g Protein",
    time: "25 Menit",
  },
  {
    id: 6,
    image: buburWortel,
    age: "12+ Bulan",
    cat: "Camilan",
    category: "Camilan: Alpukat + Pisang",
    title: "Smoothie Alpukat Pisang",
    desc: "Lemak sehat untuk energi tambahan, cocok untuk camilan sore.",
    kcal: "120 kkal",
    protein: "2g Protein",
    time: "10 Menit",
  },
  {
    id: 7,
    image: buburWortel,
    age: "9-11 Bulan",
    cat: "Finger Food",
    category: "Finger Food: Tahu + Ikan",
    title: "Nugget Tahu Ikan Kembung",
    desc: "Finger food protein tinggi dengan omega-3 untuk perkembangan otak.",
    kcal: "150 kkal",
    protein: "9g Protein",
    time: "30 Menit",
  },
  {
    id: 8,
    image: buburWortel,
    age: "6-8 Bulan",
    cat: "Sayur & Buah",
    category: "Sayur: Labu + Kentang",
    title: "Puree Labu Kuning Kentang",
    desc: "Tekstur halus yang cocok untuk pengenalan MPASI pertama.",
    kcal: "90 kkal",
    protein: "2g Protein",
    time: "15 Menit",
  },
  {
    id: 9,
    image: buburWortel,
    age: "12+ Bulan",
    cat: "Protein Hewani",
    category: "Protein Hewani: Telur + Sayur",
    title: "Omelet Sayur Keju",
    desc: "Sarapan praktis kaya protein, kalsium, dan vitamin.",
    kcal: "190 kkal",
    protein: "10g Protein",
    time: "10 Menit",
  },
  {
    id: 10,
    image: buburWortel,
    age: "9-11 Bulan",
    cat: "Camilan",
    category: "Camilan: Pepaya + Yoghurt",
    title: "Pepaya Yoghurt Plain",
    desc: "Camilan probiotik dan vitamin C untuk menjaga pencernaan.",
    kcal: "110 kkal",
    protein: "4g Protein",
    time: "5 Menit",
  },
];

const goldenRules = [
  {
    title: "Protein Hewani Harian",
    desc: "Berikan telur, ikan, ayam, atau daging di setiap kali makan utama.",
  },
  {
    title: "Lemak Tambahan",
    desc: "Tambahkan 1 sdt minyak, santan, atau mentega ke dalam MPASI.",
  },
  {
    title: "Tekstur Bertahap",
    desc: "Naikkan tekstur sesuai usia, dari halus ke cincang lalu makanan keluarga.",
  },
  {
    title: "Perkenalan Bahan Baru",
    desc: "Kenalkan satu bahan baru setiap 3 sampai 5 hari dan amati reaksi anak.",
  },
];

const PER_PAGE = 8;

export default function RecipeListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("Semua Usia");
  const [cat, setCat] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter(
      (r) =>
        (age === "Semua Usia" || r.age === age) &&
        (cat === "Semua" || r.cat === cat) &&
        (!q ||
          r.title.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q)),
    );
  }, [query, age, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const chip = (active) =>
    `rounded-full px-3 py-1 text-xs font-medium transition ${
      active
        ? "bg-primary text-surface"
        : "bg-gray-100 text-gray-600 hover:bg-soft hover:text-primary"
    }`;

  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-5 px-4 pb-6 md:px-6">
        <button
          onClick={() => navigate("/nutrition")}
          className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Kembali ke Nutrisi
        </button>

        <Card className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={query}
                onChange={(e) => changeFilter(setQuery)(e.target.value)}
                placeholder="Cari resep, bahan, atau kandungan gizi..."
                aria-label="Cari resep"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button className="shrink-0">Cari Resep</Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-[11px] font-semibold uppercase text-gray-400">
                Usia
              </span>
              {ageFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => changeFilter(setAge)(f)}
                  className={chip(age === f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 text-[11px] font-semibold uppercase text-gray-400">
                Kategori
              </span>
              {categoryFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => changeFilter(setCat)(f)}
                  className={chip(cat === f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-lg">
          <div className="grid items-center gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
            <div className="flex flex-col gap-5">
              <span className="flex w-fit max-w-full items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Star size={12} className="shrink-0 fill-current" />
                <span className="truncate">{featured.badge}</span>
              </span>

              <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                {featured.title}
              </h2>

              <p className="line-clamp-3 text-sm leading-relaxed text-emerald-50/90">
                {featured.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {featured.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm"
                  >
                    <p className="text-[11px] text-emerald-100/80">{s.label}</p>
                    <p
                      className={`mt-0.5 text-sm font-bold md:text-base ${s.accent ?? "text-white"}`}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate(`/nutrition/recipeId`)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Lihat Detail Resep & Takaran <ArrowRight size={16} />
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  <Bookmark size={16} /> Simpan
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-64 w-full rounded-xl object-cover md:h-80"
                />
                <span className="absolute bottom-5 left-5 rounded-full bg-emerald-900/90 px-3 py-1 text-xs font-semibold text-white">
                  {featured.stage}
                </span>
              </div>

              <span className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <Award size={14} className="text-yellow-400" />{" "}
                {featured.ribbon}
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">
              Katalog Resep Terverifikasi
            </h2>
            <span className="text-xs text-gray-500">
              {filtered.length} resep ditemukan
            </span>
          </div>

          {shown.length === 0 ? (
            <Card className="py-10 text-center text-sm text-gray-500">
              Tidak ada resep yang cocok. Coba ubah kata kunci atau filter.
            </Card>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((m) => (
                <Card
                  key={m.id}
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
                    <span className="absolute bottom-3 right-3 z-10 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm backdrop-blur-sm">
                      {m.time}
                    </span>
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-surface">
                      {m.age}
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
                      size="sm"
                        onClick={() => navigate(`/nutrition/recipeId`)}
                        className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary hover:text-primary hover:underline"
                      >
                        Lihat Resep <span aria-hidden="true">&rarr;</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between"
            aria-label="Halaman resep"
          >
            <span className="text-xs text-gray-500">
              Halaman {current} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                aria-label="Halaman sebelumnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={`size-8 rounded-lg text-sm font-medium ${
                    n === current
                      ? "bg-primary text-surface"
                      : "border border-gray-200 text-gray-600 hover:bg-soft"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(current + 1)}
                disabled={current === totalPages}
                aria-label="Halaman berikutnya"
                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </nav>
        )}

        <Card variant="soft" className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-bold text-text">
            Prinsip Emas Pemberian Makan Nutriva
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {goldenRules.map((r, i) => (
              <div
                key={r.title}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-surface">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-text">{r.title}</p>
                <p className="text-xs text-gray-600">{r.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card
          variant="success"
          className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-bold text-text">
              Punya bahan makanan tertentu di kulkas?
            </p>
            <p className="text-sm text-gray-600">
              Beri tahu Asisten AI bahan yang Anda punya, dan dapatkan ide menu
              yang aman untuk anak.
            </p>
          </div>
          <Button
            onClick={() => navigate("/assistant")}
            className="flex w-full items-center justify-center gap-2 md:w-fit"
          >
            <Sparkles size={16} /> Tanya Asisten AI
          </Button>
        </Card>
      </div>
    </>
  );
}
