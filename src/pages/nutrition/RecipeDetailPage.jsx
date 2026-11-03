import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, Check, ShieldCheck, Star } from "lucide-react";
import Header from "../../components/navigation/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import RecipeCard from "../../components/ui/RecipeCard";
import Spinner from "../../components/ui/Spinner";
import buburWortel from "../../assets/images/bubur-wortel.png";
import { recipeService } from "../../services/recipeService";

const defaultRecipeFallback = {
  id: "1",
  title: "Nasi Gurih Semur Ayam Kampung & Telur Puyuh",
  desc: "Menu padat kalori dan kaya zat besi hewani ganda (daging ayam kampung & telur puyuh) untuk mendukung percepatan laju tumbuh kembang linear serta proteksi primer pencegahan stunting pada balita usia 12-24 bulan.",
  image: buburWortel,
  tags: [
    "Cegah Stunting",
    "Prohe Ganda",
    "12-24 Bulan",
    "Nasi Lembek / Tim Kasar",
    "Bebas MSG",
  ],
  rating: 4.9,
  reviews: 142,
  validator: "Divalidasi Konselor MPASI Nutriva & Kemenkes RI",
  kcal: "285 kkal / porsi",
  info: [
    { label: "Persiapan", value: "10 Menit" },
    { label: "Memasak", value: "25 Menit" },
    { label: "Porsi Anak", value: "3x Makan" },
    { label: "Kesulitan", value: "Mudah" },
    { label: "Biaya / Menu", value: "~Rp 22.000" },
  ],
  ingredients: [
    { name: "Nasi putih lembek", qty: "4 sdm makan" },
    { name: "Daging ayam kampung, cincang halus", qty: "30 gram" },
    { name: "Telur puyuh rebus", qty: "2 butir" },
    { name: "Wortel, parut", qty: "1 sdm" },
    { name: "Bawang putih", qty: "1 siung" },
    { name: "Kaldu ceker ayam", qty: "150 ml" },
    { name: "Minyak atau santan", qty: "1 sdt" },
  ],
  steps: [
    {
      title: "Buat kaldu",
      time: "10 menit",
      text: "Rebus ceker ayam hingga kaldu keluar, lalu saring. Sisihkan kaldunya.",
    },
    {
      title: "Tumis bumbu",
      time: "5 menit",
      text: "Tumis bawang putih hingga harum, masukkan ayam cincang dan masak sampai berubah warna.",
    },
    {
      title: "Masak sayur",
      time: "5 menit",
      text: "Tambahkan wortel parut dan kaldu, masak hingga ayam empuk.",
    },
    {
      title: "Masukkan nasi",
      time: "3 menit",
      text: "Masukkan nasi, aduk hingga tekstur lembek dan pas untuk anak.",
    },
    {
      title: "Sajikan",
      time: "2 menit",
      text: "Tambahkan telur puyuh, masak sebentar, lalu sajikan selagi hangat.",
    },
  ],
  tips: [
    "Simpan di kulkas maksimal 24 jam dalam wadah tertutup kedap udara.",
    "Panaskan ulang sampai benar-benar panas, lalu dinginkan sebelum disuapkan ke anak.",
    "Perkenalkan telur puyuh sedikit demi sedikit jika anak belum pernah mencobanya.",
  ],
};

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const [recipeData, setRecipeData] = useState(defaultRecipeFallback);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState([]);
  const [others, setOthers] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function fetchDetail() {
      setLoading(true);
      try {
        const targetId = recipeId && recipeId !== "recipeId" ? recipeId : "bubur-daging-sapi-wortel";
        const res = await recipeService.getRecipeDetail(targetId);

        if (!ignore && res) {
          // Parse ingredients
          const ingList = Array.isArray(res.ingredients)
            ? res.ingredients.map((ing) => {
                if (typeof ing === "object" && ing !== null) {
                  return {
                    name: ing.name || "Bahan makanan",
                    qty: ing.qty || ing.amount || "Secukupnya",
                  };
                }
                const parts = typeof ing === "string" ? ing.split(":") : [String(ing)];
                return {
                  name: parts[0]?.trim() || "Bahan makanan",
                  qty: parts[1]?.trim() || "Secukupnya",
                };
              })
            : defaultRecipeFallback.ingredients;

          // Parse instructions
          const stepList = Array.isArray(res.instructions)
            ? res.instructions.map((ins, i) => ({
                title: ins.title || (typeof ins.step === "number" ? `Langkah ${ins.step}` : ins.step) || `Langkah ${i + 1}`,
                time: ins.time || "5-10 menit",
                text: typeof ins === "string" ? ins : (ins.text || ins.description || ""),
              }))
            : defaultRecipeFallback.steps;

          const calories = res.main_nutrients?.calories_kcal ?? res.main_nutrients?.calories ?? 180;
          const protein = res.main_nutrients?.protein_g ?? 8;
          const iron = res.main_nutrients?.iron_mg ?? 2.5;

          const minAge = res.min_age_months ?? res.minAgeMonths ?? 6;
          const maxAge = res.max_age_months ?? res.maxAgeMonths ?? 12;

          setRecipeData({
            id: res.id,
            title: res.title,
            desc: res.desc || `Menu gizi seimbang yang divalidasi oleh ${res.validated_by || res.validatedBy || "Konselor MPASI"} berdasarkan standar ${res.source_authority || res.sourceAuthority || "Kemenkes RI"}.`,
            image: res.image_url || res.image || buburWortel,
            tags: res.allergen_tags && res.allergen_tags.length > 0
              ? [`${minAge}-${maxAge} Bulan`, `Porsi: ${res.portion_size || res.portionSize || "1 Mangkok"}`, ...res.allergen_tags]
              : [`${minAge}-${maxAge} Bulan`, `Porsi: ${res.portion_size || res.portionSize || "1 Mangkok"}`, "Cegah Stunting", "Bebas MSG"],
            rating: 4.9,
            reviews: 128,
            validator: `Divalidasi oleh ${res.validated_by || res.validatedBy || "Ahli Gizi"} (${res.source_authority || res.sourceAuthority || "Kemenkes RI"})`,
            kcal: res.kcal || `${calories} kkal / porsi`,
            info: [
              { label: "Usia Min", value: `${minAge} Bulan` },
              { label: "Frekuensi", value: res.meal_frequency || res.mealFrequency || "3x sehari" },
              { label: "Protein", value: `${protein} g` },
              { label: "Budget", value: (res.budget_tier || res.budgetTier || "sedang").toUpperCase() },
              { label: "Zat Besi", value: `${iron} mg` },
            ],
            ingredients: ingList,
            steps: stepList,
            tips: defaultRecipeFallback.tips,
          });
        }

        // Ambil resep lainnya
        const all = await recipeService.getAllRecipes();
        if (!ignore && all && all.length > 0) {
          const otherItems = all
            .filter((item) => (res?.id ? item.id !== res.id : true) && (res?.slug ? item.slug !== res.slug : true))
            .slice(0, 4)
            .map((item) => ({
              id: item.id,
              slug: item.slug,
              image: item.image_url || item.image || buburWortel,
              category: `${item.portion_size || item.portionSize || "Porsi MPASI"}`,
              title: item.title,
              desc: item.desc || `Untuk balita ${item.min_age_months || item.minAgeMonths || 6}-${item.max_age_months || item.maxAgeMonths || 12} bulan.`,
              kcal: item.kcal || `${item.main_nutrients?.calories_kcal || item.main_nutrients?.calories || 180} kkal`,
              protein: item.protein || `${item.main_nutrients?.protein_g || 7}g Protein`,
              time: item.time || "20 Menit",
            }));
          setOthers(otherItems);
        }
      } catch (err) {
        console.error("Gagal load recipe detail:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [recipeId]);

  const toggleIngredient = (name) =>
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const toggleOther = (id) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const checkedCount = useMemo(() => {
    return recipeData.ingredients.filter((ing) => checked.includes(ing.name)).length;
  }, [recipeData.ingredients, checked]);

  if (loading) {
    return <Spinner size="lg" center label="Memuat detail resep..." />;
  }

  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-6 px-4 pb-6 md:px-6">
        <Button
          onClick={() => navigate("/nutrition/recipes")}
          variant="noborder"
          className="flex w-fit items-center gap-1 text-sm font-medium text-primary md:text-lg hover:underline cursor-pointer"
        >
          <ArrowLeft className="size-4 md:size-6" /> Kembali ke Katalog Resep
        </Button>

        <Card className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              {recipeData.tags.map((t, i) => (
                <span
                  key={t}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    i === 0
                      ? "bg-soft text-primary"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {i === 0 && <Check size={12} />} {t}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text md:text-4xl">
              {recipeData.title}
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              {recipeData.desc}
            </p>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </span>
                <b className="text-text">{recipeData.rating}</b>
                <span className="text-xs text-gray-500">
                  ({recipeData.reviews} ulasan terverifikasi)
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs font-medium text-primary">
                <ShieldCheck size={14} /> {recipeData.validator}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {recipeData.info.map((i) => (
                <div key={i.label} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase text-gray-500">
                    {i.label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-text">{i.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={recipeData.image}
              alt={recipeData.title}
              className="h-72 w-full rounded-2xl object-cover md:h-90"
            />
            <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white">
              Foto Sajian Asli
            </span>
            <span className="absolute bottom-3 right-3 rounded-full bg-emerald-800/90 px-3 py-1 text-xs font-semibold text-white">
              {recipeData.kcal}
            </span>
            <button
              onClick={() => setSaved((s) => !s)}
              aria-pressed={saved}
              aria-label={saved ? "Hapus dari tersimpan" : "Simpan resep"}
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm cursor-pointer"
            >
              <Bookmark
                size={20}
                className={
                  saved ? "fill-primary text-primary" : "text-gray-600"
                }
              />
            </button>
          </div>
        </Card>

        <div className="grid items-start gap-4 lg:grid-cols-[1fr_1.4fr]">
          {/* Bahan-Bahan */}
          <Card padding="lg" className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-text">Bahan-bahan</h2>
                <p className="text-sm text-gray-500">
                  Untuk 1 porsi anak. Centang bahan yang sudah siap.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                {checkedCount}/{recipeData.ingredients.length} siap
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(checkedCount / Math.max(1, recipeData.ingredients.length)) * 100}%`,
                }}
              />
            </div>

            <ul className="flex flex-col gap-2.5">
              {recipeData.ingredients.map((ing) => {
                const done = checked.includes(ing.name);
                return (
                  <li key={ing.name}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        done
                          ? "border-primary bg-soft"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleIngredient(ing.name)}
                        className="size-5 accent-green-700 cursor-pointer"
                      />
                      <span
                        className={`flex-1 text-base ${done ? "text-gray-400 line-through" : "text-text"}`}
                      >
                        {ing.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-500">
                        {ing.qty}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Langkah Memasak & Tips */}
          <div className="flex flex-col gap-4">
            <Card padding="lg" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-text">Langkah Memasak</h2>
                <p className="text-sm text-gray-500">
                  Ikuti urutan berikut agar tekstur sesuai tahapan si kecil.
                </p>
              </div>

              <ol className="flex flex-col">
                {recipeData.steps.map((s, i) => (
                  <li key={s.title || i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-surface">
                        {i + 1}
                      </span>
                      {i < recipeData.steps.length - 1 && (
                        <span className="my-1 w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col gap-1 ${
                        i < recipeData.steps.length - 1 ? "pb-6" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-text">
                          {s.title}
                        </h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {s.time}
                        </span>
                      </div>
                      <p className="text-base leading-relaxed text-gray-600">
                        {s.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card
              variant="warning"
              padding="lg"
              className="flex flex-col gap-3"
            >
              <h3 className="font-bold text-text">Tips Penyajian & Higienitas</h3>
              <ul className="flex flex-col gap-2 text-sm text-gray-700">
                {recipeData.tips.map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-warning"
                    />{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Rekomendasi Menu Lainnya */}
        {others.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">
                Rekomendasi Menu Lainnya
              </h2>
              <Button
                variant="noborder"
                onClick={() => navigate("/nutrition/recipes")}
                className="text-sm font-semibold text-secondary hover:text-primary hover:underline cursor-pointer"
              >
                Lihat Semua Resep
              </Button>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((m) => (
                <RecipeCard
                  key={m.id || m.slug}
                  recipe={m}
                  saved={savedIds.includes(m.id)}
                  onToggleSave={toggleOther}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
