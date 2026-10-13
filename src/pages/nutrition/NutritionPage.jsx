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
      <div className="flex flex-col gap-8 mt-6 px-4">
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
        <div className="grid grid-cols-4 items-strech justify-between gap-10">
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
