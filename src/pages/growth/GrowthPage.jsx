import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
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
import Header from "../../components/navigation/Header";

export default function GrowthPage() {
  return (
    <>
        <Header variant="pertumbuhan"/>
      <div className="flex flex-col gap-8 mt-6 px-4">
        <Card className="flex flex-col p-15 gap-8 shadow-md bg-linear-to-r from-background to-soft ">
          <div className="w-fit inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Langkah Awal Nutrisi Cerdas
          </div>
          <h2 className="text-5xl text-text font-bold w-[80%]">
            Tambahkan profil anak untuk mulai memantau pertumbuhan.
          </h2>
          <p className="w-[95%] text-xl text-gray-700">
            Tanpa Profil Anak, Nutriva tidak menampilkan grafik, BB/TB, atau
            analisis pertumbuhan personal. Daftarkan identitas dan tanggal lahir
            si kecil untuk mengakses kalkulator z-score, jadwal vaksinasi, dan
            pemantauan stunting berkala.
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
            Pratinjau Fitur Pemantauan
          </h2>
          <p className="text-gray-500 text-lg">
            Gambaran fitur lengkap yang dapat diakses untuk memantau tumbuh
            kembang si kecil secara optimal.
          </p>
        </div>
        <div className="grid grid-cols-3 items-strech justify-between gap-6">
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
              Riwayat Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500">
              Pantau perkembangan fisik anak secara berkala dengan grafik kurva
              pertumbuhan yang jelas dan mudah dipahami.
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <ShieldAlert
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Deteksi Stunting
            </h3>
            <p className="text-lg text-gray-500">
              Deteksi dini risiko stunting secara akurat sesuai standar medis
              untuk pencegahan lebih cepat..
            </p>
          </Card>
          <Card
            variant="default"
            className="group flex flex-col gap-4 p-15 hover:border-secondary hover:shadow-lg hover:shadow-soft transition-all duration-300"
          >
            <div className="bg-soft rounded-2xl p-6 w-fit transition-all duration-300 group-hover:bg-primary">
              <NotebookPen
                size={24}
                strokeWidth={3}
                className="text-primary transition-colors duration-300 group-hover:text-white"
              />
            </div>
            <h3 className="text-2xl text-text font-semibold">
              Input Data Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500">
              Kemudahan entri data fisik balita kapan saja untuk pemantauan
              kesehatan yang konsisten.
            </p>
          </Card>
        </div>
        <div className="flex items-stretch gap-4">
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-start gap-4">
              <div className="bg-soft p-4 rounded-2xl">
                <Ruler size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl text-text font-semibold">
                Panduan pengukuran Akurat di Rumah
              </h3>
            </div>
            <div className="flex gap-4">
              <Card variant="silver" className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <Scale size={20} className="text-secondary" />
                  <h4 className="text-xl text-text font-semibold">
                    Menimbang Berat Badan
                  </h4>
                </div>
                <p className="text-gray-500 text-md font-medium">
                  Lakukan penimbangan pada pagi hari sebelum sarapan, dengan
                  pakaian seminimal mungkin. Gunakan timbangan digital dengan
                  ketelitian 10–50 gram untuk memperoleh hasil pengukuran yang
                  lebih akurat.
                </p>
              </Card>
              <Card variant="silver" className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                  <RulerDimensionLine size={20} className="text-secondary" />
                  <h4 className="text-xl text-text font-semibold">
                    Mengukur Tinggi Badan
                  </h4>
                </div>
                <p className="text-gray-500 text-md font-medium">
                  Ukur panjang badan anak usia di bawah 2 tahun dalam posisi
                  telentang. Untuk anak usia 2 tahun ke atas, ukur tinggi badan
                  dalam posisi berdiri tegak, tanpa alas kaki, dengan punggung
                  menempel pada dinding.
                </p>
              </Card>
            </div>
          </Card>
          <Card variant="primary" className="flex flex-col gap-4 p-8 w-[60%]">
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
