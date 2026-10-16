import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Card";
import CurrentDate from "../../../components/ui/Date";
import {
  Plus,
  ChartColumn,
  NotebookPen,
  ShieldAlert,
  Scale,
  Ruler,
  RulerDimensionLine,
  MessageSquareMore,
} from "lucide-react";
import Header from "../../../components/navigation/Header";

export default function GrowthEmpty() {
  return (
    <>
        <Header variant="pertumbuhan"/>
      <div className="flex flex-col gap-6 mt-6 px-4 md:gap-8">
        <Card className="flex flex-col p-8 gap-2 md:gap-4 md:px-15 md:py-12 bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase md:px-4 md:py-2.5 md:text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary md:w-2 md:h-2"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-2xl text-text font-bold tracking-tight leading-normal md:text-5xl">
            Tambahkan profil anak untuk mulai memantau pertumbuhan.
          </h2>
          <p className="w-full text-xs text-gray-700 leading-normal tracking-wide md:text-xl">
            Tanpa Profil Anak, Nutriva tidak menampilkan grafik, BB/TB, atau
            analisis pertumbuhan personal. Daftarkan identitas dan tanggal lahir
            si kecil untuk mengakses kalkulator z-score, jadwal vaksinasi, dan
            pemantauan stunting berkala.
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
            Pratinjau Fitur Pemantauan
          </h2>
          <p className="text-gray-500 text-xs tracking-wide md:text-lg">
            Gambaran fitur lengkap yang dapat diakses untuk memantau tumbuh
            kembang si kecil secara optimal.
          </p>
        </div>
        <div className="grid grid-cols-1 items-strech justify-between gap-4 md:gap-8 md:grid-cols-3">
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ChartColumn
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Riwayat Pertumbuhan
            </h3>
            <p className="text-sm text-gray-500 md:text-lg">
              Pantau perkembangan fisik anak secara berkala dengan grafik kurva
              pertumbuhan yang jelas dan mudah dipahami.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ShieldAlert
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Deteksi Stunting
            </h3>
            <p className="text-sm text-gray-500 md:text-lg">
              Deteksi dini risiko stunting secara akurat sesuai standar medis
              untuk pencegahan lebih cepat..
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-2 p-8 tracking-wide md:gap-4 md:p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-xl p-4 md:p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <NotebookPen
                strokeWidth={2}
                className="size-5 text-primary md:size-6 transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-xl text-text font-semibold md:text-2xl">
              Input Data Pertumbuhan
            </h3>
            <p className="text-sm text-gray-500 md:text-lg">
              Kemudahan entri data fisik balita kapan saja untuk pemantauan
              kesehatan yang konsisten.
            </p>
          </Card>
        </div>
        <div className=" grid grid-cols-1 md:flex items-stretch gap-4">
          <Card className="flex flex-col gap-4 md:gap-6 md:pt-6">
            <div className="flex items-center justify-start gap-2 md:gap-4">
              <div className="bg-soft px-3 py-2.5 rounded-xl md:p-6">
                <Ruler className=" size-5 text-primary md:size-6" />
              </div>
              <h3 className="text-xl text-text font-semibold tracking-wide md:text-2xl">
                Panduan pengukuran Akurat di Rumah
              </h3>
            </div>
            <div className="flex items-stretch justify-between gap-2 md:gap-4">
              <Card variant="silver" className="flex flex-col gap-4 ">
                <div className="flex gap-2 items-center">
                  <Scale className="size-5 text-secondary md:size-6"/>
                  <h4 className="text-sm text-text font-semibold md:text-xl">
                    Menimbang Berat Badan
                  </h4>
                </div>
                <p className="text-gray-500 text-xs md:font-medium tracking-wide md:text-md">
                  Lakukan penimbangan pada pagi hari sebelum sarapan, dengan
                  pakaian seminimal mungkin. Gunakan timbangan digital dengan
                  ketelitian 10–50 gram untuk memperoleh hasil pengukuran yang
                  lebih akurat.
                </p>
              </Card>
              <Card variant="silver" className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <RulerDimensionLine className="size-5 text-secondary md:size-6" />
                  <h4 className="text-sm text-text font-semibold md:text-xl">
                    Mengukur Tinggi Badan
                  </h4>
                </div>
                <p className="text-gray-500 text-xs md:font-medium tracking-wide md:text-md">
                  Ukur panjang badan anak usia di bawah 2 tahun dalam posisi
                  telentang. Untuk anak usia 2 tahun ke atas, ukur tinggi badan
                  dalam posisi berdiri tegak, tanpa alas kaki, dengan punggung
                  menempel pada dinding.
                </p>
              </Card>
            </div>
          </Card>
          <Card variant="primary" className="flex flex-col gap-4 p-8">
            <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Konsultasi Langsung
            </div>
            <h3 className="text-2xl font-bold">
              Ragu dengan grafik tumbuh kembang anak?
            </h3>
            <p className="text-md">
              Konsultasikan kebutuhan gizi makro dan mikro, pemberian ASI, serta
              pilihan MPASI untuk mendukung kenaikan berat badan si kecil
              bersama Asisten AI Nutriva. Dapatkan informasi dan rekomendasi
              yang sesuai dengan kebutuhan nutrisi anak.
            </p>
            <Button
              variant="white"
              className="group flex items-center justify-center gap-4"
            >
              <MessageSquareMore
                size={20}
                strokeWidth={3}
                className="text-primary group-hover:text-surface"
              />
              <p className="text-lg font-semibold text-primary group-hover:text-surface">
                Tanya Asisten Ai Nutriva
              </p>
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
