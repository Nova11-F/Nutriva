import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Check, ShieldCheck, Star } from "lucide-react";
import Header from "../../components/navigation/Header";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import RecipeCard from "../../components/ui/RecipeCard";
import buburWortel from "../../assets/images/bubur-wortel.png";

const recipe = {
  image: buburWortel,
  title: "Nasi Gurih Semur Ayam Kampung & Telur Puyuh",
  desc: "Menu padat kalori dan kaya zat besi hewani ganda (daging ayam kampung & telur puyuh) untuk mendukung percepatan laju tumbuh kembang linear serta proteksi primer pencegahan stunting pada balita usia 12-24 bulan.",
  tags: [
    "Cegah Stunting",
    "Prohe Ganda",
    "12-24 Bulan",
    "Nasi Lembek / Tim Kasar",
    "Bebas MSG",
  ],
  rating: 4.9,
  reviews: 142,
  validator: "Divalidasi Konselor MPASI Nutriva",
  kcal: "285 kkal / porsi",
  info: [
    { label: "Persiapan", value: "10 Menit" },
    { label: "Memasak", value: "25 Menit" },
    { label: "Porsi Anak", value: "3x Makan" },
    { label: "Kesulitan", value: "Mudah" },
    { label: "Biaya / Menu", value: "~Rp 22.000" },
  ],
};

const ingredients = [
  { name: "Nasi putih lembek", qty: "4 sdm makan" },
  { name: "Daging ayam kampung, cincang halus", qty: "30 gram" },
  { name: "Telur puyuh rebus", qty: "2 butir" },
  { name: "Wortel, parut", qty: "1 sdm" },
  { name: "Bawang putih", qty: "1 siung" },
  { name: "Kaldu ceker ayam", qty: "150 ml" },
  { name: "Minyak atau santan", qty: "1 sdt" },
];

const steps = [
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
];

const tips = [
  "Simpan di kulkas maksimal 24 jam dalam wadah tertutup.",
  "Panaskan ulang sampai benar-benar panas, lalu dinginkan sebelum disuapkan.",
  "Perkenalkan telur puyuh sedikit demi sedikit jika anak belum pernah mencobanya.",
];

const others = [
  {
    id: 2,
    image: buburWortel,
    category: "Protein Hewani: Salmon + Jagung",
    title: "Creamy Salmon Chowder Jagung Manis",
    desc: "Sumber omega-3 untuk perkembangan otak dengan tekstur lembut.",
    kcal: "205 kkal",
    protein: "11g Protein",
    time: "20 Menit",
  },
  {
    id: 3,
    image: buburWortel,
    category: "Finger Food: Daging + Pisang",
    title: "Bakso Daging Pisang Santan",
    desc: "Finger food kaya zat besi untuk melatih anak makan sendiri.",
    kcal: "170 kkal",
    protein: "8g Protein",
    time: "25 Menit",
  },
  {
    id: 4,
    image: buburWortel,
    category: "Karbohidrat & Sayur: Ubi + Bayam",
    title: "Pudding Ubi Ungu Bayam",
    desc: "Camilan sehat berserat untuk menjaga pencernaan anak.",
    kcal: "160 kkal",
    protein: "4g Protein",
    time: "15 Menit",
  },
  {
    id: 5,
    image: buburWortel,
    category: "Protein Hewani: Hati Ayam + Brokoli",
    title: "Bubur Saring Hati Ayam Brokoli",
    desc: "Hati ayam kaya zat besi, dipadukan brokoli.",
    kcal: "160 kkal",
    protein: "7g Protein",
    time: "25 Menit",
  },
];

export default function RecipeDetailPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  const toggleIngredient = (name) =>
    setChecked((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  const toggleOther = (id) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-6 px-4 pb-6 md:px-6">
        <Button
          onClick={() => navigate("/nutrition")}
          variant="noborder"
          className="flex w-fit items-center gap-1 text-sm font-medium text-primary md:text-lg hover:underline"
        >
          <ArrowLeft className="size-4 md:size-6" /> Kembali
        </Button>

        <Card className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((t, i) => (
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
              {recipe.title}
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              {recipe.desc}
            </p>

            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                </span>
                <b className="text-text">{recipe.rating}</b>
                <span className="text-xs text-gray-500">
                  ({recipe.reviews} ulasan orang tua)
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs font-medium text-primary">
                <ShieldCheck size={14} /> {recipe.validator}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {recipe.info.map((i) => (
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
              src={recipe.image}
              alt={recipe.title}
              className="h-72 w-full rounded-2xl object-cover md:h-90"
            />
            <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white">
              Foto Sajian Asli
            </span>
            <span className="absolute bottom-3 right-3 rounded-full bg-emerald-800/90 px-3 py-1 text-xs font-semibold text-white">
              {recipe.kcal}
            </span>
            <button
              onClick={() => setSaved((s) => !s)}
              aria-pressed={saved}
              aria-label={saved ? "Hapus dari tersimpan" : "Simpan resep"}
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm"
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
          <Card padding="lg" className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-text">Bahan-bahan</h2>
                <p className="text-sm text-gray-500">
                  Untuk 1 porsi anak. Centang bahan yang sudah siap.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-soft px-3 py-1 text-xs font-semibold text-primary">
                {checked.length}/{ingredients.length} siap
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{
                  width: `${(checked.length / ingredients.length) * 100}%`,
                }}
              />
            </div>

            <ul className="flex flex-col gap-2.5">
              {ingredients.map((ing) => {
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
                        className="size-5 accent-green-700"
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

          <div className="flex flex-col gap-4">
            <Card padding="lg" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-text">Langkah Memasak</h2>
                <p className="text-sm text-gray-500">
                  Ikuti urutan berikut agar tekstur sesuai untuk anak.
                </p>
              </div>

              <ol className="flex flex-col">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-surface">
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && (
                        <span className="my-1 w-px flex-1 bg-gray-200" />
                      )}
                    </div>
                    <div
                      className={`flex flex-col gap-1 ${i < steps.length - 1 ? "pb-6" : ""}`}
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

            <div className="grid gap-4 ">
              <Card
                variant="warning"
                padding="lg"
                className="flex flex-col gap-3"
              >
                <h3 className="font-bold text-text">Tips Penyajian</h3>
                <ul className="flex flex-col gap-2 text-sm text-gray-700">
                  {tips.map((t) => (
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
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">
              Rekomendasi Menu Lainnya
            </h2>
            <Button
              variant="noborder"
              onClick={() => navigate("/nutrition/recipes")}
              className="text-sm font-semibold text-secondary hover:text-primary hover:underline"
            >
              Lihat Semua Resep
            </Button>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((m) => (
              <RecipeCard
                key={m.id}
                recipe={m}
                saved={savedIds.includes(m.id)}
                onToggleSave={toggleOther}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
