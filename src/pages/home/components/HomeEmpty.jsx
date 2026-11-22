import Card from "../../../components/ui/Card";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import {
  Plus,
  BookOpenText,
  ChartColumn,
  MessageSquareMore,
  Sparkle,
} from "lucide-react";
import Header from "../../../components/navigation/Header";

export default function HomeEmpty() {
  const navigate = useNavigate();

  const goAdd = () => navigate("/onboarding", { state: { from: "/profile" } });
  const goAssistant = () => navigate("/assistant");
  return (
    <>
      <Header variant="default"></Header>
      <div className="flex flex-col gap-4 mt-6 px-4 md:gap-6">
        <Card
          variant="default"
          className="p-4 md:p-6 flex flex-col gap-2 md:gap-4 items-start justify-between bg-linear-to-r from-background to-soft"
        >
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-[8px] font-semibold tracking-wide uppercase md:px-4 md:py-2.5 md:text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary lg:w-2 lg:h-2"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-2xl text-text font-bold md:text-4xl">
            Tambahkan profil anak untuk mulai
          </h2>
          <p className="w-full text-xs text-gray-500 leading-normal tracking-wide md:text-sm">
            Profil anak membantu Nutriva memberikan rekomendasi nutrisi yang
            sesuai dengan kebutuhan setiap anak, memantau perkembangan dan
            pertumbuhan secara berkala, serta menyediakan bantuan AI yang lebih
            personal dan relevan berdasarkan usia, kondisi, dan kebutuhan gizi
            anak untuk mendukung tumbuh kembang yang sehat dan optimal.
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

        <div className="flex flex-col  gap-1 lg:gap-2 px-2 lg:px-4">
          <h2 className="text-lg text-text font-semibold lg:text-2xl">
            Yang bisa dilakukan di Nutriva
          </h2>
          <p className="text-gray-500 text-xs lg:text-base">
            Semua dukungan gizi komprehensif siap digunakan setelah profil anak
            tersimpan
          </p>
        </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-4 lg:grid-cols-3">
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-8 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg w-fit p-4 transition-all duration-300 group-hover:bg-primary">
              <BookOpenText
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-lg text-text font-semibold md:text-xl">
              Perencanaan & Pelacakan Nutrisi
            </h3>
            <p className="text-xs text-gray-500 tracking-wide md:text-sm">
              Susun menu harian bergizi, pantau asupan kalori dan nutrisi
              penting, serta catat makanan favorit si kecil untuk memenuhi
              kebutuhan gizinya.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-8 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg p-4 w-fit transition-all duration-300 group-hover:bg-primary">
              <ChartColumn
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-lg text-text font-semibold md:text-xl">
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-xs text-gray-500 tracking-wide md:text-sm">
              Catat berat badan, tinggi badan, dan lingkar kepala secara
              berkala. Pantau perkembangan si kecil melalui grafik pertumbuhan
              yang informatif.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-4 tracking-wide md:p-8 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-lg p-4 w-fit transition-all duration-300 group-hover:bg-primary">
              <MessageSquareMore
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300
               group-hover:text-white"
              />
            </div>
            <h3 className="text-lg text-text font-semibold md:text-xl">
              Asisten AI Nutrisi Personal
            </h3>
            <p className="text-xs text-gray-500 tracking-wide md:text-sm">
              Dapatkan panduan seputar MPASI, alergi makanan, dan tekstur
              makanan sesuai usia anak untuk mendukung tumbuh kembangnya.
            </p>
          </Card>
        </div>
        <Card
          variant="default"
          className="p-4 flex flex-col gap-4 lg:p-6 lg:gap-6 justify-between bg-linear-to-r  from-background to-soft "
        >
          <div className="flex items-center justify-start gap-2 md:gap-4">
          <div className="bg-primary rounded-lg p-4 w-fit">
            <Sparkle
              strokeWidth={1}
              className="size-5 lg:size-7 text-surface fill-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Fitur Unggulan 24/7
            </div>
            <h3 className="text-text  text-lg lg:text-2xl font-bold">
              Konsultasi Instan dengan Asisten Ai Nutriva
            </h3>
            </div>
          </div>
            <p className="text-gray-500 text-xs lg:text-sm">
              Temukan solusi seputar MPASI, GTM, kebutuhan gizi, dan tumbuh
              kembang anak bersama Asisten AI Nutriva. Dapatkan informasi yang
              relevan dan personal untuk membantu Anda merawat si kecil dengan
              lebih percaya diri.
            </p>
          <Button
            variant="primary"
            className="py-2 px-4 flex items-center justify-center gap-2 w-full md:w-fit shrink-0"
            onClick={goAssistant}
          >
            <Plus size={24} strokeWidth={2} className="" />
            Mulai Tanya Asisten Ai
          </Button>
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:justify-between">
            <div className="flex flex-col lg:gap-1">
              <h3 className="text-lg text-text font-semibold lg:text-2xl">
                Inspirasi Menu Harian Bernutrisi
              </h3>
              <p className="text-xs text-gray-500 font-semibold md:text-md">
                Contoh variasi menu bergizi yang disukai balita
              </p>
            </div>
            <Card variant="soft" className="py-2 w-fit self-end">
              <p className="text-primary text-xs font-semibold xl:text-sm">
                Contoh Standar MPASI
              </p>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-3">
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-sm text-secondary font-bold uppercase lg:text-base">
                Sarapan Pagi
              </h4>
              <p className="text-gray-500 text-xs font-semibold lg:text-sm">
                Bubur Hati Ayam & Bayam Merah
              </p>
            </Card>
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-sm text-secondary font-bold uppercase lg:text-base">
                Makan Siang
              </h4>
              <p className="text-gray-500 text-xs font-semibold lg:text-sm">
                Bubur Hati Ayam & Bayam Merah
              </p>
            </Card>
            <Card variant="soft" className="px-4 py-2 md:p-4">
              <h4 className="text-sm text-secondary font-bold uppercase lg:text-base">
                Makan Malam
              </h4>
              <p className="text-gray-500 text-xs font-semibold lg:text-sm">
                Bubur Hati Ayam & Bayam Merah
              </p>
            </Card>
          </div>
        </Card>
      </div>
    </>
  );
}
