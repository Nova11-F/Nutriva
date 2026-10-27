import Header from "../../../components/navigation/Header";
import { useNavigate } from "react-router-dom";
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

const profiles = [
  {
    id: 1,
    initial: "RA",
    name: "Rayyan Al-Fatih",
    age: "18 Bln",
    weight: "9.7 kg",
    active: true,
    intake: "875 / 1.100 kkal",
    percent: 79,
    allergy: "Tidak ada alergi tercatat",
    phase: "Transisi Menu Keluarga",
  },
  {
    id: 2,
    initial: "AH",
    name: "Aisha Humaira",
    age: "6 Bln",
    weight: "7.2 kg",
    active: false,
    intake: "430 / 600 kkal",
    percent: 71,
    allergy: "Alergi: Putih Telur",
    phase: "MPASI Pemula",
  },
];

const schedule = [
  {
    time: "07:00 WIB",
    tag: "SARAPAN",
    title: "Nasi Tim Telur Puyuh & Hati Ayam Cincang",
    nutrients: "Energi 240 kkal · Protein 11 g · Fe 3.2 mg",
    done: true,
  },
  {
    time: "10:00 WIB",
    tag: "SNACK PAGI",
    title: "Pudding Santan Ubi Ungu & Buah Naga",
    nutrients: "Energi 160 kkal · Protein 3 g · Fe 0.8 mg",
    done: true,
  },
  {
    time: "12:30 WIB",
    tag: "MAKAN SIANG",
    title: "Sup Salmon Labu Siam & Kentang Tumbuk Keju",
    nutrients: "Energi 280 kkal · Omega-3 Tinggi · Fe 1.6 mg",
    done: true,
  },
  {
    time: "15:30 WIB",
    tag: "SNACK SORE",
    title: "Potongan Pepaya Plasma & Yoghurt Plain Balita",
    nutrients: "Energi 120 kkal · Probiotik · Vitamin C",
    next: true,
  },
  {
    time: "18:30 WIB",
    tag: "MAKAN MALAM",
    title: "Bola-bola Daging Sapi Tomat & Nasi Tim Brokoli",
    nutrients: "Energi 230 kkal · Protein 10 g · Fe 2.4 mg",
  },
];

const inspirations = [
  {
    id: 1,
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
    image: buburWortel,
    category: "Karbohidrat & Sayur: Ubi + Bayam",
    title: "Pudding Ubi Ungu Bayam",
    desc: "Camilan sehat berserat dengan vitamin dan mineral untuk menjaga pencernaan anak.",
    kcal: "160 kkal",
    protein: "4g Protein",
    time: "15 Menit",
  },
];

export default function NutritionContent({ child }) {
  const navigate = useNavigate();
  const name = child?.name ?? "Rayyan";
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
              Personalisasi rencana makan, pelacakan nutrisi dari bahan, dan
              pemantauan alergi makanan setiap hari.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-fit md:flex-row">
            <Button
              variant="outline"
              onClick={() => navigate("/nutrition/saved")}
              className="flex items-center justify-center gap-2"
            >
              <Bookmark className="size-4 md:size-6" />
              Menu Tersimpan
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-surface">
                12
              </span>
            </Button>
            <Button className="flex items-center justify-center gap-2" onClick={() => navigate("/nutrition/MealPlan")}>
              <Plus className="size-4 md:size-6" /> Buat Jadwal Makan
            </Button>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Profil Balita Terdaftar{" "}
              <span className="ml-1 rounded bg-gray-100 px-1.5">
                {profiles.length} Anak
              </span>
            </h2>
            <Button
              onClick={() =>
                navigate("/onboarding", { state: { from: "/nutrition" } })
              }
              variant="outline"
              size="sm"
              className="flex items-center  gap-1 text-xs font-medium border text-primary cursor-pointer"
            >
              <Plus size={12} /> Tambah Profil Anak
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {profiles.map((p) => (
              <Card
                key={p.id}
                variant={p.active ? "success" : "default"}
                className="flex flex-col gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-soft text-sm font-bold text-primary">
                    {p.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.age} · {p.weight}
                    </p>
                  </div>
                  {p.active && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-surface">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      p.allergy.startsWith("Alergi")
                        ? "bg-yellow-50 text-warning"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.allergy}
                  </span>
                  <span className="rounded-full bg-soft px-2 py-0.5 text-primary">
                    {p.phase}
                  </span>
                </div>
              </Card>
            ))}

            <Card variant="soft" className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-text">
                <Users size={16} className="text-primary" /> Punya Balita Lain?
              </div>
              <p className="text-xs text-gray-600">
                Daftarkan anak lainnya untuk rencana makan dan pemantauan alergi
                yang terpisah.
              </p>
              <button
                onClick={() =>
                  navigate("/onboarding", { state: { from: "/nutrition" } })
                }
                className="mt-auto flex w-fit items-center gap-1 text-xs font-semibold text-primary cursor-pointer"
              >
                Daftarkan Profil Anak Baru <ChevronRight size={12} />
              </button>
            </Card>
          </div>
        </section>

        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                Jadwal Asupan Nutrisi Hari Ini
              </h2>
              <p className="text-xs text-gray-500">
                Centang menu yang sudah dimakan agar asupan nutrisi ikut
                terhitung.
              </p>
            </div>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
              <span className="rounded-md bg-surface px-3 py-1 text-text shadow-sm cursor-pointer">
                Rayyan (18 bln)
              </span>
              <span className="px-3 py-1 text-gray-500 cursor-pointer">
                Aisha (6 bln)
              </span>
            </div>
          </div>

          <ol className="grid gap-3 lg:grid-cols-2">
            {schedule.map((s) => (
              <li
                key={s.time}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  s.next ? "border-primary bg-soft" : "border-gray-200"
                } ${s.done ? "bg-gray-50" : ""}`}
              >
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                    s.done
                      ? "border-primary bg-primary text-surface"
                      : "border-gray-300 text-transparent"
                  }`}
                >
                  <Check size={14} />
                </span>
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
                {s.next && (
                  <Button size="sm" className="shrink-0">
                    Konfirmasi Makan
                  </Button>
                )}
              </li>
            ))}
          </ol>
        </Card>

        <section className="flex flex-col gap-3">
          <div className="flex gap-2 md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                Inspirasi Menu Nutrisi Sesuai Usia
              </h2>
              <p className="text-xs text-gray-500">
                Rekomendasi menu, tinggi protein hewani dan aman alergi.
              </p>
            </div>
            <Button
              variant="Noborder"
              onClick={() => navigate("/nutrition/recipes")}
              className="group flex w-fit items-center hover:underline"
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
                    <button
                      onClick={() => navigate(`/nutrition/${m.id}`)}
                      className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary hover:text-primary hover:underline"
                    >
                      Lihat Resep <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card
          className="flex flex-col gap-4 border-primary bg-primary text-surface md:flex-row md:items-center md:justify-between"
          variant="primary"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="shrink-0" />
            <div>
              <p className="text-sm font-bold">
                Anak sedang GTM karena tumbuh gigi atau perlu variasi MPASI{" "}
                {name}?
              </p>
              <p className="mt-1 text-xs opacity-90">
                AI Nutriva mengetahui database alergi dan usia anak. Tanyakan
                ide menu, dan resep yang aman.
              </p>
            </div>
          </div>
          <Button
            variant="white"
            onClick={() => navigate("/assistant")}
            className="flex w-full shrink-0 items-center justify-center gap-2 md:w-fit"
          >
            <Sparkles size={16} /> Sarankan Menu ke AI
          </Button>
        </Card>
      </div>
    </>
  );
}
