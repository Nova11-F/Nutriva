import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { ChartLine, Sparkle, Soup, ShieldCheck, Check } from "lucide-react";
import imageLanding from "../../assets/images/landingpage.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="beranda"
        className="relative overflow-hidden bg-background h-auto py-10 scroll-mt-26 2xl:py-40 md:px-6"
      >
        <div className="max-w-full mx-10 grid grid-cols-1 xl:grid-cols-2 gap-12 items-center 2xl:mx-40">
          <div className="space-y-2 md:space-y-4">
            <div className="inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Platform Tumbuh Kembang Anak
            </div>
            <h1 className="text-4xl font-extrabold text-text tracking-wide leading-tight md:tracking-tight md:text-6xl">
              Nutrisi Lebih Terarah, Tumbuh Kembang Lebih Terpantar
            </h1>
            <p className="text-md text-gray-500 tracking-wide leading-relaxed md:text-lg">
              Nutriva membantu orang tua merencanakan nutrisi, memantau
              pertumbuhan, dan mendapatkan informasi edukatif yang lebih
              personal dalam satu platform.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" size="xl" className="w-full md:w-fit" onClick={() => navigate("/login")}>
                Mulai Sekarang
              </Button>
              <Button variant="outline" size="xl" className="w-full md:w-fit">
                <a href="#value">Pelajari Nutriva</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 px-4 pt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                Personal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                Edukatif
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{" "}
                Non-diagnostik
              </span>
            </div>
          </div>

          <div className="hidden relative xl:flex justify-center">
            <div className="absolute -top-16 w-134 h-134 bg-soft rounded-full pointer-events-none"></div>
            <div className="absolute -top-20 right-42 w-44 h-44 bg-light rounded-full pointer-events-none"></div>
            <div className="relative bg-surface p-4 rounded-3xl shadow-2xl border border-soft max-w-md w-full">
              <img
                src={imageLanding}
                alt="Ibu dan Anak Makan Sehat"
                className="rounded-2xl w-full h-100 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-surface p-4 rounded-2xl shadow-xl border border-soft flex items-center gap-3">
                <div>
                  <p className="text-xs font-semibold text-secondary">
                    NUTRISI
                  </p>
                  <p className="text-sm font-bold text-text">
                    Plan menu hari ini
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-surface p-4 rounded-2xl shadow-xl border border-soft flex items-center gap-3">
                <div>
                  <p className="text-xs font-semibold text-secondary">
                    PERTUMBUHAN
                  </p>
                  <p className="text-sm font-bold text-text">
                    Pantau pola tumbuh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-auto bg-surface px-10 py-20 flex flex-col gap-10 scroll-mt-26 2xl:px-40">
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            Kenapa Nutriva
          </p>
          <h1 className="text-3xl font-semibold text-text lg:text-4xl 2xl:text-6xl">
            Menjadi orang tua tidak seharusnya berarti menebak sendiri
          </h1>
          <p className="text-lg font-medium text-gray-500 md:text-xl">
            Informasi yang banyak belum tentu membuat keputusan sehari-hari
            menjadi lebih mudah
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex 2xl:flex-row">
          <Card className="px-6 py-8 flex flex-col gap-2 w-full md:px-8 md:py-10 md:gap-4 2xl:w-150">
            <p className="text-lg font-semibold text-primary">01</p>
            <h3 className="text-xl font-semibold text-text md:text-2xl">Menu & Porsi</h3>
            <p className="text-md text-gray-500 md:text-lg">
              Bingung menentukan menu dan porsi anak yang sesuai kebutuhan
              sehari-hari.
            </p>
          </Card>
          <Card className="px-6 py-8 flex flex-col gap-2 w-full md:px-8 md:py-10 md:gap-4 2xl:w-150">
            <p className="text-lg font-semibold text-primary">02</p>
            <h3 className="text-xl font-semibold text-text md:text-2xl">Pertumbuhan</h3>
            <p className="text-md text-gray-500 md:text-lg">
              Khawatir berat atau tinggi anak tidak berkembang sesuai harapan.
            </p>
          </Card>
          <Card className="px-6 py-8 flex flex-col gap-2 w-full md:px-8 md:py-10 md:gap-4 2xl:w-150">
            <p className="text-lg font-semibold text-primary">03</p>
            <h3 className="text-xl font-semibold text-text md:text-2xl">Informasi Gizi</h3>
            <p className="text-md text-gray-500 md:text-lg">
              Informasi dari internet sering berbeda-beda dan sulit
              dibandingkan.
            </p>
          </Card>
          <Card className="px-6 py-8 flex flex-col gap-2 w-full md:px-8 md:py-10 md:gap-4 2xl:w-150">
            <p className="text-lg font-semibold text-primary">04</p>
            <h3 className="text-xl font-semibold text-text md:text-2xl">
              Aksi Sehari-hari
            </h3>
            <p className="text-md text-gray-500 md:text-lg">
              Sulit menerjemahkan informasi menjadi langkah praktis yang bisa
              dilakukan.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="value"
        className="h-auto bg-soft px-10 py-20 flex flex-col gap-10 scroll-mt-26 2xl:px-40"
      >
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            Value Proposition
          </p>
          <h1 className="text-3xl font-semibold text-text lg:text-4xl 2xl:text-6xl">
            Dari Informasi Menjadi Tindakan
          </h1>
          <p className="text-lg font-medium text-gray-500 md:text-xl">
            Nutriva menyederhanakan proses yang biasanya tersebar menjadi tiga
            langkah yang mudah diikuti.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
          <Card className="p-8 flex flex-col gap-2 w-full md:gap-4 md:px-12 md:py-10">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              P
            </p>
            <h3 className="px-1 font-semibold text-text text-2xl">Plan</h3>
            <p className=" text-gray-500 md:text-lg">
              Rencanakan kebutuhan nutrisi dan menu yang lebih terarah.
            </p>
          </Card>
          <Card className="p-8 flex flex-col gap-2 w-full md:gap-4 md:px-12 md:py-10">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              T
            </p>
            <h3 className="px-1 font-semibold text-text text-2xl">Track</h3>
            <p className="text-gray-500 text-lg">
              Catat makanan dan pertumbuhan untuk melihat perubahan dari waktu
              ke waktu.
            </p>
          </Card>
          <Card className="p-8 flex flex-col gap-2 w-full md:gap-4 md:px-12 md:py-10">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              U
            </p>
            <h3 className="px-1 font-semibold text-text text-2xl">Understand</h3>
            <p className="text-gray-500 text-lg">
              Pahami ringkasan dan analisis yang relevan dengan konteks anak.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="fitur"
        className="h-auto bg-surface px-10 py-20 flex flex-col gap-10 scroll-mt-26 2xl:px-40 2xl:py-30"
      >
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            CORE EXPERIENCES
          </p>
          <h1 className="text-3xl font-semibold text-text lg:text-4xl 2xl:text-6xl">
            Tiga pengalaman utama dalam satu pendamping
          </h1>
          <p className="text-lg font-medium text-gray-500 lg:text-xl">
            Fokus pada hal yang paling sering dibutuhkan orang tua:
            merencanakan, memantau, dan memahami.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:justify-between">
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Soup size={20} strokeWidth={2} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-text md:text-2xl">Nutrisi</h3>
            <p className="text-md text-gray-500 tracking-wide md:text-lg">
              Rencanakan menu, cari makanan, catat porsi, dan lihat ringkasan
              nutrisi harian.
            </p>
            <div className="flex flex-col gap-2 my-3 md:my-6 md:gap-4">
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Perencana Menu & rekomendasi menu
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Cari
                Makanan & Porsi Makanan
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Ringkasan Nutrisi Harian
              </span>
            </div>
            <p className="bg-soft w-fit px-8 py-2 text-primary rounded-2xl font-semibold">
              Pelajari manfaat
            </p>
          </div>
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <ChartLine size={20} strokeWidth={2} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-text md:text-2xl">
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-md text-gray-500 tracking-wide md:text-lg">
              Catat pengukuran dan pahami pola pertumbuhan anak dari waktu ke
              waktu.
            </p>
            <div className="flex flex-col gap-2 my-3 md:my-6 md:gap-4">
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Tambah Pengukuran & Riwayat
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Grafik Pertumbuhan & Analisis
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Peringatan Dini
              </span>
            </div>
            <p className="bg-soft w-fit px-8 py-2 text-primary rounded-2xl font-semibold">
              Pelajari manfaat
            </p>
          </div>
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft ">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Sparkle size={20} strokeWidth={2} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-text md:text-2xl">Asisten AI</h3>
            <p className="text-md text-gray-500 tracking-wide md:text-lg">
              Dapatkan informasi edukatif yang lebih kontekstual tanpa
              menggantikan tenaga kesehatan.
            </p>
            <div className="flex flex-col gap-2 my-3 md:my-6 md:gap-4">
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Context-aware answer
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Informasi tepercaya
              </span>
              <span className="flex items-center gap-4 text-md text-gray-500 font-semibold md:text-lg">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Referral guidance non-diagnostik
              </span>
            </div>
            <p className="bg-soft w-fit px-8 py-2 text-primary rounded-2xl font-semibold">
              Pelajari manfaat
            </p>
          </div>
        </div>
      </section>

      <section 
      className="h-auto bg-background px-10 py-20 flex flex-col gap-10 scroll-mt-24 2xl:px-40 2xl:py-30" 
      id="cara-kerja">
        <div className="flex flex-col gap-4 mb-6 md:mb-10">
          <p className="text-xl font-bold text-primary uppercase">CARA KERJA</p>
          <h1 className="text-3xl font-semibold text-text lg:text-4xl 2xl:text-6xl">
            Mulai dengan sederhana, lanjutkan sesuai kebutuhan
          </h1>
          <p className="text-lg font-medium text-gray-500 md:text-xl">
            Satu profil anak menjadi konteks untuk pengalaman Nutriva yang lebih
            personal.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-4">
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary md:mb-6">
              1
            </p>
            <h3 className="text-2xl font-semibold text-text md:mb-2">
              Buat Profil Anak
            </h3>
            <p className="text-md text-gray-500 md:text-lg md:w-auto">
              Isi informasi dasar agar pengalaman lebih relevan.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary md:mb-6">
              2
            </p>
            <h3 className="text-2xl font-semibold text-text md:mb-2">
              Rencanakan Nutrisi
            </h3>
            <p className="text-md text-gray-500 md:text-lg md:w-auto">
              Susun menu dan catat asupan sesuai kebutuhan harian.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary md:mb-6">
              3
            </p>
            <h3 className="text-2xl font-semibold text-text md:mb-2">
              Pantau Pertumbuhan
            </h3>
            <p className="text-md text-gray-500 md:text-lg md:w-auto text-center">
              Tambahkan pengukuran dan lihat pola dari waktu ke waktu.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary md:mb-6">
              4
            </p>
            <h3 className="text-2xl font-semibold text-text md:mb-2">
              Dapatkan Analisis
            </h3>
            <p className="text-md text-gray-500 md:text-lg md:w-auto text-center">
              Gunakan ringkasan dan Asisten AI sebagai panduan edukatif.
            </p>
          </div>
        </div>
      </section>

      <section id="tentang" className="h-auto bg-soft px-10 py-20 scroll-mt-24 md:px-40 ">
        <Card className="flex items-center p-8 gap-8 justify-around shadow-md md:px-12 md:py-10 md:gap-10 max-sm:flex-col">
          <div className="flex flex-col gap-4  md:mb-10">
            <p className="text-lg font-bold text-primary uppercase">
              TRUST & SAFETY
            </p>
            <h1 className="text-2xl font-semibold text-text md:text-4xl">
              Pendamping Orang Tua, Bukan Pengganti Tenaga Kesehatan
            </h1>
            <p className="text-md font-medium text-gray-500">
              Nutriva membantu orang tua memahami informasi nutrisi dan tumbuh
              kembang dengan lebih mudah. Nutriva tidak melakukan diagnosis dan
              tetap mendorong konsultasi dengan ahli gizi atau tenaga kesehatan
              ketika diperlukan.
            </p>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Informasi edukatif</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Validasi/kolaborasi ahli gizi</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Referral guidance</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Pendekatan non-diagnostik</p>
            </div>
          </div>
          <div className="bg-background border border-gray-300 rounded-xl flex flex-col items-center justify-center px-4 py-10 gap-8">
            <ShieldCheck
              strokeWidth={1}
              className="size-20 text-primary fill-soft md:size-35"
            />
            <h4 className="text-text text-center font-bold text-xl md:text-3xl">Designed for guidance, not diagnosis</h4>
            <p className="text-gray-700 text-center text-lg">Ketika ada tanda yang perlu perhatian, Nutriva mengarahkan pengguna untuk mencari bantuan profesional.</p>
          </div>
        </Card>
      </section>

      <section className="h-auto bg-primary flex flex-col items-center px-4 py-40 gap-8 md:gap-10">
        <h3 className="text-surface text-3xl font-bold text-center md:text-5xl">Mulai Dampingi Tumbuh Kembang Anak dengan Lebih Terarah</h3>
        <p className="text-surface text-center text-xl tracking-wide md:text-2xl">Mulai dari langkah kecil: kenali kebutuhan anak, catat perkembangannya, dan pahami informasi yang relevan.</p>
        <Button variant="outline" className="px-20 py-4 md:px-30 " onClick={() => navigate("/login")}>Mulai Sekarang</Button>
        <p className="text-surface text-xl text-center tracking-wide">Daftar untuk membuat profil anak atau masuk jika sudah memiliki akun.</p>
      </section>

    </>
  );
}
