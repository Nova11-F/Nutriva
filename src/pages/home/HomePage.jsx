import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
import {
  Plus,
  BookOpenText,
  ChartColumn,
  MessageSquareMore,
  Sparkle,
} from "lucide-react";
import Header from "../../components/navigation/Header";

export default function HomePage() {
  return (
    <>
        <Header variant="default"></Header>
      <div className="flex flex-col gap-8 mt-6 px-4">
        <Card className="flex flex-col p-15 gap-8 shadow-md bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-5xl text-text font-bold">
            Tambahkan profil anak untuk mulai
          </h2>
          <p className="w-[95%] text-xl text-gray-700">
            Profil anak membantu Nutriva memberikan rekomendasi nutrisi yang
            sesuai dengan kebutuhan setiap anak, memantau perkembangan dan
            pertumbuhan secara berkala, serta menyediakan bantuan AI yang lebih
            personal dan relevan berdasarkan usia, kondisi, dan kebutuhan gizi
            anak untuk mendukung tumbuh kembang yang sehat dan optimal.
          </p>
          <Button
            variant="outline"
            className="flex items-center justify-center w-fit gap-4"
          >
            <Plus size={20} strokeWidth={3} />
            Tambah Profil Anak
          </Button>
        </Card>

        <div className="flex flex-col gap-2 px-4">
          <h2 className="text-2xl text-text font-semibold">
            Yang bisa dilakukan di Nutriva
          </h2>
          <p className="text-gray-500 text-lg">
            Semua dukungan gizi komprehensif siap digunakan setelah profil anak
            tersimpan
          </p>
        </div>
        <div className="grid grid-cols-3 items-strech justify-between gap-10">
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <BookOpenText
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Perencanaan & Pelacakan Nutrisi
            </h3>
            <p className="text-lg text-gray-500">
              Susun menu harian bergizi, pantau asupan kalori dan nutrisi
              penting, serta catat makanan favorit si kecil untuk memenuhi
              kebutuhan gizinya.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ChartColumn
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500">
              Catat berat badan, tinggi badan, dan lingkar kepala secara
              berkala. Pantau perkembangan si kecil melalui grafik pertumbuhan
              yang informatif.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <MessageSquareMore
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Asisten AI Nutrisi Personal
            </h3>
            <p className="text-lg text-gray-500">
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
            <div className="flex flex-col gap-2 px-4">
            <h3 className="text-2xl text-text font-semibold">Inspirasi Menu Harian Bernutrisi Seimbang</h3>
            <p className="text-md text-gray-500 font-semibold">Contoh variasi menu bergizi yang disukai balita</p>
            </div>
            <Card variant="soft" className="py-2 px-6">
              <p className="text-primary text-lg font-semibold">Contoh Standar MPASI</p>
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card variant="soft">
              <h4 className="text-xl text-secondary font-bold uppercase">Sarapan Pagi</h4>
              <p className="text-gray-500 text-lg font-semibold">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
            <Card variant="soft">
              <h4 className="text-xl text-secondary font-bold uppercase">Sarapan Pagi</h4>
              <p className="text-gray-500 text-lg font-semibold">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
            <Card variant="soft">
              <h4 className="text-xl text-secondary font-bold uppercase">Sarapan Pagi</h4>
              <p className="text-gray-500 text-lg font-semibold">Bubur Hati Ayam & Bayam Merah</p>
            </Card>
          </div>
        </Card>
      </div>
    </>
  );
}
