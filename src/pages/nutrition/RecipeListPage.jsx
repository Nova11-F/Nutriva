import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import Header from "../../components/navigation/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import buburWortel from "../../assets/images/bubur-wortel.png";
import { recipeService } from "../../services/recipeService";
import { useChild } from "../../hooks/useChild";
import { recipes as dataRecipes } from "../../data/recipe";

const ageFilters = ["Semua Usia", "6-8 Bulan", "9-11 Bulan", "12+ Bulan"];
const categoryFilters = [
  "Semua",
  "Protein Hewani",
  "Finger Food",
  "Sayur & Buah",
  "Camilan",
];

const fallbackRecipes = dataRecipes.map((r) => ({
  id: r.id,
  slug: r.slug,
  image: r.image || buburWortel,
  age: r.age || "6-8 Bulan",
  cat: r.cat || "Protein Hewani",
  category: r.category || "Protein Hewani",
  title: r.title,
  desc: r.desc || "Menu bergizi seimbang untuk tumbuh kembang optimal anak.",
  kcal: r.kcal || `${r.mainNutrients?.calories_kcal || 180} kkal`,
  protein: r.protein || `${r.mainNutrients?.protein_g || 8}g Protein`,
  time: r.time || "20 Menit",
}));

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
  const { child } = useChild();

  const [recipesList, setRecipesList] = useState(fallbackRecipes);
  const [query, setQuery] = useState("");
  const [age, setAge] = useState("Semua Usia");
  const [cat, setCat] = useState("Semua");
  const [page, setPage] = useState(1);

  // Ambil resep langsung dari Supabase atau service
  useEffect(() => {
    let ignore = false;
    async function fetchRecipes() {
      try {
        const data = await recipeService.getAllRecipes();
        if (!ignore && data && data.length > 0) {
          const mapped = data.map((r) => {
            let ageLabel = r.age || "6-8 Bulan";
            const minAge = r.min_age_months ?? r.minAgeMonths ?? 6;
            const maxAge = r.max_age_months ?? r.maxAgeMonths ?? 12;

            if (minAge >= 12) ageLabel = "12+ Bulan";
            else if (minAge >= 9) ageLabel = "9-11 Bulan";

            const calories = r.main_nutrients?.calories_kcal ?? r.main_nutrients?.calories ?? r.kcal ?? "180 kkal";
            const protein = r.main_nutrients?.protein_g ?? r.protein ?? "8g Protein";

            return {
              id: r.id,
              slug: r.slug,
              image: r.image_url || r.image || buburWortel,
              age: ageLabel,
              cat: r.cat || (minAge >= 12 ? "Finger Food" : "Protein Hewani"),
              category: r.category || `${r.portion_size || r.portionSize || "Porsi MPASI"} · ${r.meal_frequency || r.mealFrequency || "Utama"}`,
              title: r.title,
              desc: r.desc || r.instructions?.[0]?.text || `Menu bergizi seimbang untuk balita usia ${minAge}-${maxAge} bulan.`,
              kcal: typeof calories === "number" ? `${calories} kkal` : calories,
              protein: typeof protein === "number" ? `${protein}g Protein` : protein,
              time: r.time || "25 Menit",
            };
          });

          // Gabungkan dengan fallback agar katalog selalu lengkap
          const uniqueIds = new Set(mapped.map((m) => m.slug || m.title));
          const restFallback = fallbackRecipes.filter((fb) => !uniqueIds.has(fb.slug || fb.title));
          setRecipesList([...mapped, ...restFallback]);
        }
      } catch (err) {
        console.error("Gagal ambil resep:", err);
      }
    }
    fetchRecipes();
    return () => {
      ignore = true;
    };
  }, []);

  const featured = useMemo(() => {
    const primary = recipesList[0] || fallbackRecipes[0];
    return {
      id: primary.id,
      slug: primary.slug,
      image: primary.image,
      badge: `Menu Pilihan Gizi Pekan Ini • Cocok untuk ${child?.name || "Si Kecil"}`,
      title: primary.title,
      desc: primary.desc,
      stage: `Tahapan: ${primary.age}`,
      ribbon: "Rasio Emas 4 Bintang",
      stats: [
        { label: "Energi Total", value: primary.kcal },
        { label: "Protein Hewani", value: primary.protein, accent: "text-emerald-300" },
        { label: "Waktu Masak", value: primary.time },
        { label: "Rekomendasi", value: "Kemenkes RI", accent: "text-yellow-300" },
      ],
    };
  }, [recipesList, child]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipesList.filter(
      (r) =>
        (age === "Semua Usia" || r.age === age) &&
        (cat === "Semua" || r.cat === cat) &&
        (!q ||
          r.title.toLowerCase().includes(q) ||
          r.desc.toLowerCase().includes(q)),
    );
  }, [recipesList, query, age, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const chip = (active) =>
    `rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
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
          className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer"
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
            <button
              onClick={() => navigate("/nutrition/MealPlan")}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-emerald-100 cursor-pointer"
            >
              <Sparkles size={14} /> Susun Meal Plan
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Usia Balita:
              </span>
              {ageFilters.map((a) => (
                <button
                  key={a}
                  onClick={() => changeFilter(setAge)(a)}
                  className={chip(age === a)}
                >
                  {a}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Kategori:
              </span>
              {categoryFilters.map((c) => (
                <button
                  key={c}
                  onClick={() => changeFilter(setCat)(c)}
                  className={chip(cat === c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Featured Hero Recipe */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-xl md:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                <Sparkles size={14} /> {featured.badge}
              </span>

              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                {featured.title}
              </h1>

              <p className="line-clamp-3 text-sm leading-relaxed text-slate-300">
                {featured.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {featured.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-white/5 p-3 backdrop-blur-xs ring-1 ring-white/10"
                  >
                    <p className="text-[11px] font-medium text-slate-400">
                      {s.label}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        s.accent ?? "text-white"
                      }`}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate(featured.slug ? `/nutrition/${featured.slug}` : `/nutrition/${featured.id}`)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 cursor-pointer"
                >
                  Lihat Detail Resep & Takaran <ArrowRight size={16} />
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

        {/* Katalog Resep Terverifikasi */}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Sebelumnya
              </Button>
              <span className="text-xs text-gray-500">
                Halaman {current} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={current === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Selanjutnya <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </section>

        {/* 4 Pilar MPASI Sehat */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-text">
            4 Kaidah Emas MPASI Kemenkes RI
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {goldenRules.map((r, i) => (
              <Card key={r.title} variant="soft" className="flex flex-col gap-1.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-surface">
                  {i + 1}
                </span>
                <h3 className="font-bold text-text">{r.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{r.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
