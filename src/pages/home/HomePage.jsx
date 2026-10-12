import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
import {
  Plus,
  BookOpenText,
  ChartColumn,
  MessageSquareMore,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-8 my-10 px-4">
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex flex-col gap-4">
        <h1 className="text-4xl text-text font-bold">Beranda</h1>
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
          <h2 className="text-5xl text-text font-bold">
            Tambahkan profil anak untuk mulai
          </h2>
          <p className="w-[95%] text-xl text-gray-700">
            Profil anak membantu Nutriva memberikan rekomendasi nutrisi yang sesuai dengan kebutuhan setiap anak, memantau perkembangan dan pertumbuhan secara berkala, serta menyediakan bantuan AI yang lebih personal dan relevan berdasarkan usia, kondisi, dan kebutuhan gizi anak untuk mendukung tumbuh kembang yang sehat dan optimal.
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
          Yang bisa dilakukan di Nutriva
        </h2>
        <p className="text-gray-500 text-lg">
          Semua dukungan gizi komprehensif siap digunakan setelah profil anak tersimpan</p>
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
              Susun menu harian bergizi, pantau asupan kalori dan nutrisi penting, serta catat makanan favorit si kecil untuk memenuhi kebutuhan gizinya.
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
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500">
              Catat berat badan, tinggi badan, dan lingkar kepala secara berkala. Pantau perkembangan si kecil melalui grafik pertumbuhan yang informatif.
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
              Dapatkan panduan seputar MPASI, alergi makanan, dan tekstur makanan sesuai usia anak untuk mendukung tumbuh kembangnya.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
