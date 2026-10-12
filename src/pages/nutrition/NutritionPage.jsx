import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
import {
  Plus,
  CalendarDays,
  ChartColumn,
  NotebookText,
} from "lucide-react";

export default function NutritionPage() {
  return (
    <>
      <div className="flex flex-col gap-8 my-10 px-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex flex-col gap-4">
        <h1 className="text-4xl text-text font-bold">Nutrisi</h1>
        <p className="w-fit inline-flex items-center gap-2 bg-light border border-warning py-1 px-4 rounded-lg text-warning text-md font-semibold">
          <span className="h-2 w-2 bg-warning rounded-full"></span>Belum memiliki Profil Anak</p>
        </div>
        <CurrentDate />
        </div>
        <Card className="flex flex-col p-15 gap-8 shadow-md bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-5xl text-text font-bold w-[80%]">
            Lengkapi profil anak untuk mendapatkan rekomendasi nutrisi yang sesuai.
          </h2>
          <p className="w-[95%] text-xl text-gray-700">
            Tanpa Profil Anak, Nutriva tidak menampilkan rekomendasi personal, rencana menu otomatis, kalkulasi kebutuhan kalori individual, atau riwayat alergi berbasis usia si kecil.
          </p>
          <Button
            variant="outline"
            className="flex items-center justify-center w-fit gap-4"
          >
            <Plus size={20} strokeWidth={3}/>
            Tambah Profil Anak
          </Button>
        </Card>

        <div className="flex flex-col gap-2 px-4">
        <h2 className="text-2xl text-text font-semibold">
          Fitur Nutrisi Nutriva
        </h2>
        <p className="text-gray-500 text-lg">
          Setelah profil anak tersedia, Anda dapat langsung menggunakan seluruh modul pemantauan gizi berikut:</p>
          </div>
        <div className="grid grid-cols-3 items-strech justify-between gap-10">
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <CalendarDays
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Perencana Menu Harian
            </h3>
            <p className="text-lg text-gray-500">
              Jadwal makan terjadwal (Sarapan, Makan Siang, Snack, Makan Malam) sesuai tahapan tekstur usia anak.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ChartColumn size={24} strokeWidth={3} className="text-primary transition-colors duration-300 group-hover:text-white" />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Pelacak Gizi
            </h3>
            <p className="text-lg text-gray-500">
              Pantau kecukupan Protein Hewani, Zat Besi, Kalsium, dan kalori harian untuk pencegahan stunting dini.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <NotebookText
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Resep & Nutrisi Anak
            </h3>
            <p className="text-lg text-gray-500">
              Jelajahi resep makanan bergizi lengkap dengan informasi kalori, protein, vitamin, dan mineral untuk mendukung tumbuh kembang si kecil.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
