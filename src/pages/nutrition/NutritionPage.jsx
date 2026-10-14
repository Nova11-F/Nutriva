import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
import {
  Plus,
  CalendarDays,
  ChartColumn,
  NotebookText,
  ChevronRight,
  MessageSquareMore
} from "lucide-react";
import Header from "../../components/navigation/Header";

export default function NutritionPage() {
  return (
    <>
        <Header variant="nutrisi"/>
      <div className="flex flex-col gap-6 mt-6 px-4 md:gap-8">
        <Card className="flex flex-col p-8 gap-2 md:gap-4 md:px-15 md:py-12 bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase md:px-4 md:py-2.5 md:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary md:w-2 md:h-2"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-2xl text-text font-bold tracking-tight leading-normal md:text-5xl">
            Lengkapi profil anak untuk mendapatkan rekomendasi nutrisi yang sesuai.
          </h2>
          <p className="w-full text-xs text-gray-700 leading-normal tracking-wide md:text-xl">
            Tanpa Profil Anak, Nutriva tidak menampilkan rekomendasi personal, rencana menu otomatis, kalkulasi kebutuhan kalori individual, atau riwayat alergi berbasis usia si kecil.
          </p>
          <Button
            variant="outline"
            className="flex items-center justify-center text-sm gap-2 md:text-xl md:w-fit"
          >
            <Plus strokeWidth={2} className="size-4 md:size-6"/>
            Tambah Profil Anak
          </Button>
        </Card>

        <div className="flex flex-col px-2 gap-1 md:gap-2 md:px-4">
        <h2 className="text-xl text-text font-semibold md:text-2xl">
          Fitur Nutrisi Nutriva
        </h2>
        <p className="text-gray-500 text-xs md:text-lg">
          Setelah profil anak tersedia, Anda dapat langsung menggunakan seluruh modul pemantauan gizi berikut:</p>
          </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-4 md:gap-8 md:grid-cols-3">
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <CalendarDays
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Perencana Menu Harian
            </h3>
            <p className="text-sm text-gray-500 md:text-lg">
              Jadwal makan terjadwal (Sarapan, Makan Siang, Snack, Makan Malam) sesuai tahapan tekstur usia anak.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ChartColumn strokeWidth={2} className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white" />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Pelacak Gizi
            </h3>
            <p className="text-sm text-gray-500 tracking-wide md:text-lg">
              Pantau kecukupan Protein Hewani, Zat Besi, Kalsium, dan kalori harian untuk pencegahan stunting dini.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <NotebookText
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Resep & Nutrisi Anak
            </h3>
            <p className="text-sm text-gray-500 tracking-wide md:text-lg">
              Jelajahi resep makanan bergizi lengkap dengan informasi kalori, protein, vitamin, dan mineral untuk mendukung tumbuh kembang si kecil.
            </p>
          </Card>
        </div>

        <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 px-4">
        <h2 className="text-2xl text-text font-semibold">
          Inspirasi & Ide Resep Sehat si Kecil
        </h2>
        <p className="text-gray-500 text-lg">
          Pilihan variasi menu kaya gizi & padat mikronutrien yang disukai balita</p>
          </div>
          <Button variant="Noborder" className="group flex items-center">Lihat Semua Resep
            <ChevronRight size={20} className="group:text-secondary group:hover:text-hover"/>
          </Button>
          </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-10">
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
        <Card variant="default" className="p-8 flex gap-8 items-center justify-between bg-linear-to-r  from-background to-soft ">
          <div className="flex items-center justify-start gap-8">
          <div className="bg-primary rounded-2xl p-6">
            <MessageSquareMore
              size={32}
              strokeWidth={3}
              className="text-surface"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Fitur Unggulan 24/7
            </div>
            <h3 className="text-text text-2xl font-bold">
              Butuh panduan mengatasi anak GTM (Gerakan Tutup Mulut)?
            </h3>
            <p className="text-gray-500 text-md font-semibold">
              Konsultasikan tekstur MPASI, variasi bahan lokal, atau alergi si kecil bersama tim Asisten AI Nutriva.</p>
          </div>
          </div>
          <Button variant="primary" className="py-2 px-4 flex items-center justify-center gap-2 w-90">
            <Plus size={24} strokeWidth={2} className=""/>
            Mulai Tanya Asisten Ai
          </Button>
        </Card>
      </div>
    </>
  );
}
