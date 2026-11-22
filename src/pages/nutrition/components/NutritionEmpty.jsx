import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  Plus,
  CalendarDays,
  ChartColumn,
  NotebookText,
  ChevronRight,
  MessageSquareMore,
} from "lucide-react";
import Header from "../../../components/navigation/Header";
import { getRecipeImage, handleRecipeImgError } from "../../../utils/recipeImages";

const SAMPLE_INSPIRATIONS = [
  {
    slug: "bubur-ayam-wortel",
    category: "Prohe & Sayur: Ayam + Wortel",
    title: "Bubur Ayam Wortel",
    desc: "Kaya protein hewani dan vitamin A untuk mendukung tumbuh kembang serta daya tahan tubuh balita usia 6-12 bulan.",
    stats: "180 kkal • 8g Protein",
    time: "20 Menit",
  },
  {
    slug: "pepes-tahu",
    category: "Menu Kukus: Tahu + Ayam",
    title: "Pepes Tahu",
    desc: "Olahan tahu kukus lembut dibungkus daun pisang berpadu wortel, ayam, dan telur untuk balita 12+ bulan.",
    stats: "305 kkal • 17.9g Protein",
    time: "25 Menit",
  },
  {
    slug: "nasi-tim-ikan-tuna-telur-puyuh",
    category: "Omega-3 & Kolin: Tuna + Puyuh",
    title: "Nasi Tim Ikan Tuna Telur Puyuh",
    desc: "Tinggi protein ikan laut dan kolin telur puyuh untuk mendukung kecerdasan serta pertumbuhan optimal.",
    stats: "215 kkal • 12g Protein",
    time: "25 Menit",
  },
  {
    slug: "nugget-tempe-ayam-sayuran",
    category: "Finger Food: Tempe + Ayam",
    title: "Nugget Tempe Ayam Sayuran",
    desc: "Finger food renyah bergizi seimbang agar anak antusias makan mandiri dan mencegah defisiensi zat besi.",
    stats: "195 kkal • 10g Protein",
    time: "25 Menit",
  },
];

export default function NutritionEmpty() {
  const navigate = useNavigate();

  const goAdd = () => navigate("/onboarding", { state: { from: "/profile" } });
  const goAssistant = () => navigate("/assistant");
  return (
    <>
      <Header variant="nutrisi" />
      <div className="flex flex-col gap-4 mt-6 px-4 md:gap-6">
        <Card className="p-4 md:p-6 flex flex-col gap-2 md:gap-4 items-start justify-between bg-linear-to-r from-background to-soft">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-[8px] font-semibold tracking-wide uppercase md:px-4 md:py-2.5 md:text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary lg:w-2 lg:h-2"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-2xl text-text font-bold md:text-4xl">
            Lengkapi profil anak untuk mendapatkan rekomendasi nutrisi yang
            sesuai.
          </h2>
          <p className="w-full text-xs text-gray-500 leading-normal tracking-wide md:text-sm">
            Tanpa Profil Anak, Nutriva tidak menampilkan rekomendasi personal,
            rencana menu otomatis, kalkulasi kebutuhan kalori individual, atau
            riwayat alergi berbasis usia si kecil.
          </p>
          <Button
            variant="outline"
            className="flex items-center justify-center text-sm gap-2 lg:text-base md:w-fit"
            onClick={goAdd}
          >
            <Plus strokeWidth={2} className="size-4 lg:size-6" />
            Tambah Profil Anak
          </Button>
        </Card>

        <div className="flex flex-col gap-1 lg:gap-2 px-2 lg:px-4">
          <h2 className="text-lg text-text font-semibold lg:text-2xl">
            Fitur Nutrisi Nutriva
          </h2>
          <p className="text-gray-500 text-xs lg:text-base">
            Setelah profil anak tersedia, Anda dapat langsung menggunakan
            seluruh modul pemantauan gizi berikut:
          </p>
        </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-4 lg:grid-cols-3">
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-6 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg w-fit p-4 transition-all duration-300 group-hover:bg-primary">
              <CalendarDays
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-base text-text font-semibold flex items-center lg:min-h-14 lg:text-lg">
              Perencana Menu Harian
            </h3>
            <p className="text-xs text-gray-500 tracking-wide lg:text-sm">
              Jadwal makan terjadwal (Sarapan, Makan Siang, Snack, Makan Malam)
              sesuai tahapan tekstur usia anak.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-6 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg w-fit p-4 transition-all duration-300 group-hover:bg-primary">
              <ChartColumn
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-base text-text font-semibold flex items-center lg:min-h-14 lg:text-lg">
              Pelacak Gizi
            </h3>
            <p className="text-xs text-gray-500 tracking-wide lg:text-sm">
              Pantau kecukupan Protein Hewani, Zat Besi, Kalsium, dan kalori
              harian untuk pencegahan stunting dini.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-6 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg w-fit p-4 transition-all duration-300 group-hover:bg-primary">
              <NotebookText
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-base text-text font-semibold flex items-center lg:min-h-14 lg:text-lg">
              Resep & Nutrisi Anak
            </h3>
            <p className="text-xs text-gray-500 tracking-wide lg:text-sm">
              Jelajahi resep makanan bergizi lengkap dengan informasi kalori,
              protein, vitamin, dan mineral untuk mendukung tumbuh kembang si
              kecil.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center">
          <div className="flex flex-col md:col-span-2 gap-1 lg:gap-2 px-2">
            <h2 className="text-lg text-text font-semibold lg:text-2xl">
              Inspirasi & Ide Resep Sehat si Kecil
            </h2>
            <p className="text-gray-500 text-xs lg:text-base">
              Pilihan variasi menu kaya gizi & padat mikronutrien yang disukai
              balita
            </p>
          </div>
          <Button
            variant="Noborder"
            onClick={() => navigate("/nutrition/recipes")}
            className="group flex items-center justify-end self-end hover:underline"
          >
            Lihat Semua Resep
            <ChevronRight
              size={20}
              className="group:text-secondary group:hover:text-hover"
            />
          </Button>
        </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-2 lg:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SAMPLE_INSPIRATIONS.map((item) => (
            <Card
              key={item.slug}
              padding="none"
              variant="default"
              className="group flex flex-col gap-4 overflow-hidden hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
            >
              <div className="relative w-full h-70 overflow-hidden">
                <img
                  src={getRecipeImage(item.slug)}
                  alt={item.title}
                  loading="lazy"
                  onError={handleRecipeImgError}
                  className="w-full h-full object-cover rounded-t-md group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-md font-bold px-3 py-1.5 rounded-xl shadow-sm z-10">
                  {item.time}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h4 className="text-xs text-primary font-bold lg:text-sm">
                  {item.category}
                </h4>
                <h3 className="text-lg text-text font-bold leading-snug lg:text-xl">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 lg:text-sm">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-800 lg:text-sm">
                    {item.stats}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(`/nutrition/${item.slug}`)}
                    className="flex items-center gap-1 text-xs lg:text-sm font-semibold cursor-pointer text-secondary hover:underline hover:text-primary"
                  >
                    Lihat Resep
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card
          variant="default"
          className="p-4 flex flex-col gap-4 lg:p-6 lg:gap-6 justify-between bg-linear-to-r  from-background to-soft  "
        >
          <div className="flex items-center justify-start gap-2 md:gap-4">
            <div className="bg-primary rounded-2xl p-4">
              <MessageSquareMore
                strokeWidth={3}
                className="size-5 lg:size-7 text-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Fitur Unggulan 24/7
              </div>
              <h3 className="text-text  text-lg lg:text-2xl font-bold">
                Butuh panduan mengatasi anak GTM (Gerakan Tutup Mulut)?
              </h3>
            </div>
          </div>
              <p className="text-gray-500 text-xs lg:text-sm">
                Konsultasikan tekstur MPASI, variasi bahan lokal, atau alergi si
                kecil bersama tim Asisten AI Nutriva.
              </p>
          <Button
            variant="primary"
            className="py-2 px-4 flex items-center justify-center gap-2 w-full lg:w-fit"
            onClick={goAssistant}
          >
            <Plus size={24} strokeWidth={2} className="" />
            Mulai Tanya Asisten Ai
          </Button>
        </Card>
      </div>
    </>
  );
}
