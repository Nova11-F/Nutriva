import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import imageLanding from "../../assets/images/landingpage.png";
import { ChartLine, Sparkle, Soup, ShieldCheck, Check } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="beranda"
        className="relative overflow-hidden bg-background h-auto pt-40 pb-40 px-6 scroll-mt-26"
      >
        <div className="max-w-full mx-40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Platform Tumbuh Kembang Anak
            </div>
            <h1 className="text-6xl font-extrabold text-text tracking-tight leading-tight">
              Nutrisi Lebih Terarah, Tumbuh Kembang Lebih Terpantar
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
              Nutriva membantu orang tua merencanakan nutrisi, memantau
              pertumbuhan, dan mendapatkan informasi edukatif yang lebih
              personal dalam satu platform.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" size="xl" onClick={() => navigate("/login")}>
                Mulai Sekarang
              </Button>
              <Button variant="outline" size="xl">
                <a href="#pelajari">Pelajari Nutriva</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
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

          <div className="relative flex justify-center">
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

      <section className="h-auto bg-surface px-40 py-30 flex flex-col gap-15 scroll-mt-24">
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            Kenapa Nutriva
          </p>
          <h1 className="text-6xl font-semibold text-text">
            Menjadi orang tua tidak seharusnya berarti menebak sendiri
          </h1>
          <p className="text-xl font-medium text-gray-500">
            Informasi yang banyak belum tentu membuat keputusan sehari-hari
            menjadi lebih mudah
          </p>
        </div>
        <div className="flex justify-around items-center gap-10">
          <Card className="px-8 py-10 flex flex-col gap-4 w-150">
            <p className="text-lg font-semibold text-primary">01</p>
            <h3 className="text-2xl font-semibold text-text">Menu & Porsi</h3>
            <p className="text-lg text-gray-500">
              Bingung menentukan menu dan porsi anak yang sesuai kebutuhan
              sehari-hari.
            </p>
          </Card>
          <Card className="px-8 py-10 flex flex-col gap-4 w-150">
            <p className="text-lg font-semibold text-primary">02</p>
            <h3 className="text-2xl font-semibold text-text">Pertumbuhan</h3>
            <p className="text-lg text-gray-500">
              Khawatir berat atau tinggi anak tidak berkembang sesuai harapan.
            </p>
          </Card>
          <Card className="px-8 py-10 flex flex-col gap-4 w-150">
            <p className="text-lg font-semibold text-primary">03</p>
            <h3 className="text-2xl font-semibold text-text">Informasi Gizi</h3>
            <p className="text-lg text-gray-500">
              Informasi dari internet sering berbeda-beda dan sulit
              dibandingkan.
            </p>
          </Card>
          <Card className="px-8 py-10 flex flex-col gap-4 w-150">
            <p className="text-lg font-semibold text-primary">04</p>
            <h3 className="text-2xl font-semibold text-text">
              Aksi Sehari-hari
            </h3>
            <p className="text-lg text-gray-500">
              Sulit menerjemahkan informasi menjadi langkah praktis yang bisa
              dilakukan.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="value"
        className="h-auto bg-soft px-40 py-30 flex flex-col gap-15 scroll-mt-24"
      >
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            Value Proposition
          </p>
          <h1 className="text-6xl font-semibold text-text">
            Dari Informasi Menjadi Tindakan
          </h1>
          <p className="text-xl font-medium text-gray-500">
            Nutriva menyederhanakan proses yang biasanya tersebar menjadi tiga
            langkah yang mudah diikuti.
          </p>
        </div>
        <div className="flex justify-center items-center gap-10">
          <Card className="px-12 py-10 flex flex-col gap-4 w-150 h-70">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              P
            </p>
            <h3 className="text-2xl font-semibold text-text">Plan</h3>
            <p className="text-lg text-gray-500">
              Rencanakan kebutuhan nutrisi dan menu yang lebih terarah.
            </p>
          </Card>
          <Card className="px-12 py-10 flex flex-col gap-4 w-150 h-70">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              T
            </p>
            <h3 className="text-2xl font-semibold text-text">Track</h3>
            <p className="text-lg text-gray-500">
              Catat makanan dan pertumbuhan untuk melihat perubahan dari waktu
              ke waktu.
            </p>
          </Card>
          <Card className="px-12 py-10 flex flex-col gap-4 w-150 h-70">
            <p className="text-xl font-bold text-primary bg-soft px-6 py-4 rounded-xl w-fit">
              U
            </p>
            <h3 className="text-2xl font-semibold text-text">Understand</h3>
            <p className="text-xl text-gray-500">
              Pahami ringkasan dan analisis yang relevan dengan konteks anak.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="fitur"
        className="h-auto bg-surface px-40 py-30 flex flex-col gap-15 scroll-mt-24"
      >
        <div className="flex flex-col gap-6">
          <p className="text-xl font-bold text-primary uppercase">
            CORE EXPERIENCES
          </p>
          <h1 className="text-6xl font-semibold text-text">
            Tiga pengalaman utama dalam satu pendamping
          </h1>
          <p className="text-xl font-medium text-gray-500">
            Fokus pada hal yang paling sering dibutuhkan orang tua:
            merencanakan, memantau, dan memahami.
          </p>
        </div>
        <div className="flex justify-center items-center gap-10">
          <div className="group px-14 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150 h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Soup size={20} strokeWidth={3} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-semibold text-text">Nutrisi</h3>
            <p className="text-lg text-gray-500">
              Rencanakan menu, cari makanan, catat porsi, dan lihat ringkasan
              nutrisi harian.
            </p>
            <div className="flex flex-col gap-5 my-10">
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Perencana Menu & rekomendasi menu
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> Cari
                Makanan & Porsi Makanan
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Ringkasan Nutrisi Harian
              </span>
            </div>
            <p className="bg-soft w-fit px-8 py-2 text-primary rounded-2xl font-semibold">
              Pelajari manfaat
            </p>
          </div>
          <div className="group px-14 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150 h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <ChartLine size={20} strokeWidth={3} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-semibold text-text">
              Pemantauan Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500">
              Catat pengukuran dan pahami pola pertumbuhan anak dari waktu ke
              waktu.
            </p>
            <div className="flex flex-col gap-5 my-10">
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Tambah Pengukuran & Riwayat
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Grafik Pertumbuhan & Analisis
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Peringatan Dini
              </span>
            </div>
            <p className="bg-soft w-fit px-8 py-2 text-primary rounded-2xl font-semibold">
              Pelajari manfaat
            </p>
          </div>
          <div className="group px-14 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150 h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Sparkle size={20} strokeWidth={3} className="text-primary group-hover:text-surface transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-semibold text-text">Asisten AI</h3>
            <p className="text-xl text-gray-500">
              Dapatkan informasi edukatif yang lebih kontekstual tanpa
              menggantikan tenaga kesehatan.
            </p>
            <div className="flex flex-col gap-5 my-10">
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Context-aware answer
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>{" "}
                Informasi tepercaya & tindakan yang disarankan
              </span>
              <span className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
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
      className="h-auto bg-background px-40 py-30 flex flex-col gap-15 scroll-mt-24" 
      id="cara-kerja">
        <div className="flex flex-col gap-6 mb-10">
          <p className="text-xl font-bold text-primary uppercase">CARA KERJA</p>
          <h1 className="text-6xl font-semibold text-text">
            Mulai dengan sederhana, lanjutkan sesuai kebutuhan
          </h1>
          <p className="text-xl font-medium text-gray-500">
            Satu profil anak menjadi konteks untuk pengalaman Nutriva yang lebih
            personal.
          </p>
        </div>
        <div className="flex justify-items-start items-center gap-20">
          <div>
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary mb-10">
              1
            </p>
            <h3 className="text-2xl font-semibold text-text mb-6">
              Buat Profil Anak
            </h3>
            <p className="text-lg text-gray-500 w-auto">
              Isi informasi dasar agar pengalaman lebih relevan.
            </p>
          </div>
          <div>
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary mb-10">
              2
            </p>
            <h3 className="text-2xl font-semibold text-text mb-6">
              Rencanakan Nutrisi
            </h3>
            <p className="text-lg text-gray-500 w-auto">
              Susun menu dan catat asupan sesuai kebutuhan harian.
            </p>
          </div>
          <div>
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary mb-10">
              3
            </p>
            <h3 className="text-2xl font-semibold text-text mb-6">
              Pantau Pertumbuhan
            </h3>
            <p className="text-lg text-gray-500 w-auto">
              Tambahkan pengukuran dan lihat pola dari waktu ke waktu.
            </p>
          </div>
          <div>
            <p className="flex items-center justify-center text-2xl font-semibold text-surface w-20 h-20 rounded-full bg-primary mb-10">
              4
            </p>
            <h3 className="text-2xl font-semibold text-text mb-6">
              Dapatkan Analisis
            </h3>
            <p className="text-lg text-gray-500 w-auto">
              Gunakan ringkasan dan Asisten AI sebagai panduan edukatif.
            </p>
          </div>
        </div>
      </section>

      <section id="tentang" className="h-auto bg-soft px-80 py-30 scroll-mt-24">
        <Card className="flex items-center justify-between gap-20 mb-10 px-14 py-20 shadow-md">
          <div className="flex flex-col gap-6 w-250 mb-10">
            <p className="text-lg font-bold text-primary uppercase">
              TRUST & SAFETY
            </p>
            <h1 className="text-4xl font-semibold text-text">
              Pendamping Orang Tua, Bukan Pengganti Tenaga Kesehatan
            </h1>
            <p className="text-md font-medium text-gray-500">
              Nutriva membantu orang tua memahami informasi nutrisi dan tumbuh
              kembang dengan lebih mudah. Nutriva tidak melakukan diagnosis dan
              tetap mendorong konsultasi dengan ahli gizi atau tenaga kesehatan
              ketika diperlukan.
            </p>
            <div className="grid grid-cols-2 grid-rows-2 gap-8">
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Informasi edukatif</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Validasi/kolaborasi ahli gizi</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Referral guidance</p>
            <p className="flex items-center gap-4 text-text font-semibold"><span className="bg-soft rounded-full w-auto h-auto p-2"> <Check size={20} className="text-primary"/></span>Pendekatan non-diagnostik</p>
            </div>
          </div>
          <div className="bg-background border border-gray-300 rounded-xl w-120 h-auto flex flex-col items-center justify-center px-4 py-10 gap-8">
            <ShieldCheck
              size={120}
              strokeWidth={1}
              className="text-primary fill-soft"
            />
            <h4 className="text-text text-center font-bold text-3xl">Designed for guidance, not diagnosis</h4>
            <p className="text-gray-700 text-center text-lg">Ketika ada tanda yang perlu perhatian, Nutriva mengarahkan pengguna untuk mencari bantuan profesional.</p>
          </div>
        </Card>
      </section>

      <section className="h-auto bg-primary flex flex-col items-center py-40 gap-15">
        <h3 className="text-surface text-6xl font-semibold">Mulai Dampingi Tumbuh Kembang Anak dengan Lebih Terarah</h3>
        <p className="text-surface text-2xl">Mulai dari langkah kecil: kenali kebutuhan anak, catat perkembangannya, dan pahami informasi yang relevan.</p>
        <Button variant="outline" className="px-30 py-6" onClick={() => navigate("/login")}>Mulai Sekarang</Button>
        <p className="text-surface text-xl">Daftar untuk membuat profil anak atau masuk jika sudah memiliki akun.</p>
      </section>

    </>
  );
}
