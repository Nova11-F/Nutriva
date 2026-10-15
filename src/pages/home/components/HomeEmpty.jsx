import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import CurrentDate from "../../../components/ui/Date";
import {
  Plus,
  BookOpenText,
  ChartColumn,
  MessageSquareMore,
  Sparkle,
} from "lucide-react";
import Header from "../../../components/navigation/Header";

export default function HomeEmpty() {
  return (
    <>
        <Header variant="default"></Header>
      <div className="flex flex-col gap-6 mt-6 px-4 md-gap-8">
        <Card className="flex flex-col p-8 gap-4 md:gap-8 md:px-15 md:py-12 bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase md:px-4 md:py-2.5 md:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary md:w-2 md:h-2"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-2xl text-text font-bold md:text-5xl">
            Tambahkan profil anak untuk mulai
          </h2>
          <p className="w-full text-xs text-gray-700 leading-normal tracking-wide md:text-xl">
            Profil anak membantu Nutriva memberikan rekomendasi nutrisi yang
            sesuai dengan kebutuhan setiap anak, memantau perkembangan dan
            pertumbuhan secara berkala, serta menyediakan bantuan AI yang lebih
            personal dan relevan berdasarkan usia, kondisi, dan kebutuhan gizi
            anak untuk mendukung tumbuh kembang yang sehat dan optimal.
          </p>
          <Button
            variant="outline"
            className="flex items-center justify-center text-sm gap-2 md:text-xl md:w-fit"
          >
            <Plus strokeWidth={2} className="size-4 md:size-6" />
            Tambah Profil Anak
          </Button>
        </Card>

        <div className="flex flex-col  gap-1 md:gap-2 px-2 md:px-4">
          <h2 className="text-xl text-text font-semibold md:text-2xl">
            Yang bisa dilakukan di Nutriva
          </h2>
          <p className="text-gray-500 text-xs md:text-lg">
            Semua dukungan gizi komprehensif siap digunakan setelah profil anak
            tersimpan
          </p>
        </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-4 md:grid-cols-3">
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 w-fit md:p-6 transition-all duration-300 group-hover:bg-primary">
              <BookOpenText
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Perencanaan & Pelacakan Nutrisi
            </h3>
            <p className="text-sm text-gray-500 tracking-wide md:text-lg">
              Susun menu harian bergizi, pantau asupan kalori dan nutrisi
              penting, serta catat makanan favorit si kecil untuk memenuhi
              kebutuhan gizinya.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 w-fit md:p-6 transition-all duration-300 group-hover:bg-primary">
              <ChartColumn
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-md text-gray-500 tracking-wide md:text-lg">
              Catat berat badan, tinggi badan, dan lingkar kepala secara
              berkala. Pantau perkembangan si kecil melalui grafik pertumbuhan
              yang informatif.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 w-fit md:p-6 transition-all duration-300 group-hover:bg-primary">
              <MessageSquareMore
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Asisten AI Nutrisi Personal
            </h3>
            <p className="text-md text-gray-500 tracking-wide md:text-lg">
              Dapatkan panduan seputar MPASI, alergi makanan, dan tekstur
              makanan sesuai usia anak untuk mendukung tumbuh kembangnya.
            </p>
          </Card>
        </div>
        <Card variant="default" className="p-8 flex gap-8 items-center justify-between bg-linear-to-r  from-background to-soft ">
          <div className="bg-primary rounded-2xl p-6">
            <Sparkle
              size={32}
              strokeWidth={1}
              className="text-surface fill-surface"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Fitur Unggulan 24/7
            </div>
            <h3 className="text-text text-2xl font-bold">
              Konsultasi Instan dengan Asisten Ai Nutriva
            </h3>
            <p className="text-gray-500 text-md font-semibold">
              Temukan solusi seputar MPASI, GTM, kebutuhan gizi, dan tumbuh kembang anak bersama Asisten AI Nutriva. Dapatkan informasi yang relevan dan personal untuk membantu Anda merawat si kecil dengan lebih percaya diri.</p>
          </div>
          <Button variant="primary" className="py-2 px-4 flex items-center justify-center gap-2 w-90">
            <Plus size={24} strokeWidth={2} className=""/>
            Mulai Tanya Asisten Ai
          </Button>
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col md:gap-2">
            <h3 className="text-lg text-text font-semibold md:text-2xl">Inspirasi Menu Harian Bernutrisi</h3>
            <p className="text-xs text-gray-500 font-semibold md:text-md">Contoh variasi menu bergizi yang disukai balita</p>
            </div>
            <Card variant="soft" className="py-2 px-6">
              <p className="text-primary text-xs font-semibold md:text-lg">Contoh Standar MPASI</p>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-3">
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-md text-secondary font-bold uppercase md:text-xl">Sarapan Pagi</h4>
              <p className="text-gray-500 text-xs font-semibold md:text-md">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-md text-secondary font-bold uppercase md:text-xl">Sarapan Pagi</h4>
              <p className="text-gray-500 text-xs font-semibold mid:text-md">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-md text-secondary font-bold uppercase md:text-xl">Sarapan Pagi</h4>
              <p className="text-gray-500 text-xs font-semibold md:text-md">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
          </div>
        </Card>
      </div>
    </>
  );
}
