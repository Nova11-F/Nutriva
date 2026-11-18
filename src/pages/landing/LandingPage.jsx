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
        className="relative overflow-hidden bg-background h-auto py-10 scroll-mt-24 lg:py-15 2xl:py-25"
      >
        <div className="max-w-full mx-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 xl:gap-8 2xl:mx-20 items-center">
          <div className="space-y-2 lg:space-y-4 ">
            <div className="inline-flex items-center gap-2 bg-soft text-primary px-3.5 py-1.5 rounded-full text-[10px] lg:text-xs font-semibold tracking-wide uppercase">
              <span className="p-1 rounded-full bg-primary"></span>
              Platform Tumbuh Kembang Anak
            </div>
            <h1 className="text-3xl font-extrabold text-text tracking-wider leading-tight lg:text-4xl 2xl:text-5xl">
              Nutrisi Lebih Terarah, Tumbuh Kembang Lebih Terpantar
            </h1>
            <p className="text-sm text-gray-500 tracking-wide leading-relaxed lg:text-md">
              Nutriva membantu orang tua merencanakan nutrisi, memantau
              pertumbuhan, dan mendapatkan informasi edukatif yang lebih
              personal dalam satu platform.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="primary"
                size="xl"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Mulai Sekarang
              </Button>
              <Button variant="outline" size="xl" className="w-full">
                <a href="#value">Pelajari Nutriva</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 px-4 pt-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="p-1 rounded-full bg-secondary"></span> Personal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="p-1 rounded-full bg-secondary"></span> Edukatif
              </span>
              <span className="flex items-center gap-1.5">
                <span className="p-1 rounded-full bg-secondary"></span>{" "}
                Non-diagnostik
              </span>
            </div>
          </div>

          <div className="hidden relative lg:flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Background circles */}
              <div className="absolute -top-[15%] -left-[10%] w-[100%] aspect-square bg-soft rounded-full pointer-events-none" />

              <div className="absolute -top-[12%] right-[12%] w-[20%] aspect-square bg-light rounded-full pointer-events-none" />

              {/* Image container */}
              <div className="relative bg-surface p-4 rounded-3xl shadow-2xl border border-soft w-fit">
                <img
                  src={imageLanding}
                  alt="Ibu dan Anak Makan Sehat"
                  className="rounded-2xl w-full h-60 lg:h-80 object-cover"
                />

                {/* Nutrition badge */}
                <div className="absolute -bottom-6 -left-6 bg-surface px-4 py-3 rounded-lg shadow-xl border border-soft flex items-center gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-secondary">
                      NUTRISI
                    </p>
                    <p className="text-xs font-bold text-text">
                      Plan menu hari ini
                    </p>
                  </div>
                </div>

                {/* Growth badge */}
                <div className="absolute -bottom-6 -right-6 bg-surface px-4 py-3 rounded-lg shadow-xl border border-soft flex items-center gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-secondary">
                      PERTUMBUHAN
                    </p>
                    <p className="text-xs font-bold text-text">
                      Pantau pola tumbuh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-auto bg-surface px-8 py-15 flex flex-col gap-8 scroll-mt-24 2xl:px-20 2xl:py-20">
        <div className="flex flex-col gap-2">
          <p className="text-md font-semibold text-primary uppercase 2xl:text-lg">
            Kenapa Nutriva
          </p>
          <h1 className="text-2xl font-semibold text-text lg:text-3xl 2xl:text-4xl">
            Menjadi orang tua tidak seharusnya berarti menebak sendiri
          </h1>
          <p className="text-md text-gray-500 2xl:text-lg">
            Informasi yang banyak belum tentu membuat keputusan sehari-hari
            menjadi lebih mudah
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 lg:flex 2xl:flex-row">
          <Card className="p-6 flex flex-col gap-1 w-full lg:gap-2 lg:p-8 2xl:w-150">
            <p className="text-md font-semibold text-primary lg:text-lg">01</p>
            <h3 className="text-lg font-semibold text-text lg:text-xl">
              Menu & Porsi
            </h3>
            <p className="text-sm text-gray-500 lg:text-md">
              Bingung menentukan menu dan porsi anak yang sesuai kebutuhan
              sehari-hari.
            </p>
          </Card>
          <Card className="p-6 flex flex-col gap-1 w-full lg:gap-2 lg:p-8 2xl:w-150">
            <p className="text-md font-semibold text-primary lg:text-lg">02</p>
            <h3 className="text-lg font-semibold text-text lg:text-xl">
              Pertumbuhan
            </h3>
            <p className="text-sm text-gray-500 lg:text-md">
              Khawatir berat atau tinggi anak tidak berkembang sesuai harapan.
            </p>
          </Card>
          <Card className="p-6 flex flex-col gap-1 w-full lg:gap-2 lg:p-8 2xl:w-150">
            <p className="text-md font-semibold text-primary lg:text-lg">03</p>
            <h3 className="text-lg font-semibold text-text lg:text-xl">
              Informasi Gizi
            </h3>
            <p className="text-sm text-gray-500 lg:text-md">
              Informasi dari internet sering berbeda-beda dan sulit
              dibandingkan.
            </p>
          </Card>
          <Card className="p-6 flex flex-col gap-1 w-full lg:gap-2 lg:p-8 2xl:w-150">
            <p className="text-md font-semibold text-primary lg:text-lg">04</p>
            <h3 className="text-lg font-semibold text-text lg:text-xl">
              Aksi Sehari-hari
            </h3>
            <p className="text-sm text-gray-500 lg:text-md">
              Sulit menerjemahkan informasi menjadi langkah praktis yang bisa
              dilakukan.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="value"
        className="h-auto bg-soft px-8 py-15 flex flex-col gap-8 scroll-mt-24 2xl:px-20 2xl:py-20"
      >
        <div className="flex flex-col gap-2">
          <p className="text-md font-semibold text-primary uppercase 2xl:text-lg">
            Value Proposition
          </p>
          <h1 className="text-2xl font-semibold text-text lg:text-4xl 2xl:text-4xl">
            Dari Informasi Menjadi Tindakan
          </h1>
          <p className="text-md text-gray-500 2xl:text-lg">
            Nutriva menyederhanakan proses yang biasanya tersebar menjadi tiga
            langkah yang mudah diikuti.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
          <Card className="p-4 flex flex-col gap-2 w-full lg:px-8">
            <p className="text-md font-bold text-primary bg-soft px-4 py-2 rounded-lg w-fit lg:text-lg lg:px-5 lg:py-3">
              P
            </p>
            <h3 className="text-lg lg:px-1 font-bold text-hover tracking-wider lg:text-xl">Plan</h3>
            <p className=" text-gray-500 text-sm lg:text-md">
              Rencanakan kebutuhan nutrisi dan menu yang lebih terarah.
            </p>
          </Card>
          <Card className="p-4 flex flex-col gap-2 w-full lg:px-8">
            <p className="text-md font-bold text-primary bg-soft px-4 py-2 rounded-lg w-fit lg:text-lg lg:px-5 lg:py-3">
              T
            </p>
            <h3 className="text-lg lg:px-1 font-bold text-hover tracking-wider lg:text-xl">Track</h3>
            <p className="text-gray-500 text-sm lg:text-md">
              Catat makanan dan pertumbuhan untuk melihat perubahan dari waktu
              ke waktu.
            </p>
          </Card>
          <Card className="p-4 flex flex-col gap-2 w-full lg:px-8">
            <p className="text-md font-bold text-primary bg-soft px-4 py-2 rounded-lg w-fit lg:text-lg lg:px-5 lg:py-3">
              U
            </p>
            <h3 className="text-lg lg:px-1 font-bold text-hover tracking-wider lg:text-xl">
              Understand
            </h3>
            <p className="text-gray-500 text-sm lg:text-md">
              Pahami ringkasan dan analisis yang relevan dengan konteks anak.
            </p>
          </Card>
        </div>
      </section>

      <section
        id="fitur"
        className="h-auto bg-surface px-8 py-15 flex flex-col gap-8 scroll-mt-24 2xl:px-20 2xl:py-20"
      >
        <div className="flex flex-col gap-2">
          <p className="text-md font-semibold text-primary uppercase 2xl:text-lg">
            CORE EXPERIENCES
          </p>
          <h1 className="text-2xl font-semibold text-text 2xl:text-4xl">
            Tiga pengalaman utama dalam satu pendamping
          </h1>
          <p className="text-md  text-gray-500 xl:text-lg">
            Fokus pada hal yang paling sering dibutuhkan orang tua:
            merencanakan, memantau, dan memahami.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:justify-between">
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Soup
                size={20}
                strokeWidth={2}
                className="text-primary group-hover:text-surface transition-all duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold text-text md:text-2xl">
              Nutrisi
            </h3>
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
          </div>
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <ChartLine
                size={20}
                strokeWidth={2}
                className="text-primary group-hover:text-surface transition-all duration-300"
              />
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
          </div>
          <div className="group p-8 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-full h-auto hover:border-secondary hover:shadow-lg hover:shadow-soft ">
            <div className="bg-soft w-fit p-4 rounded-xl group-hover:bg-primary transition-all duration-300">
              <Sparkle
                size={20}
                strokeWidth={2}
                className="text-primary group-hover:text-surface transition-all duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold text-text md:text-2xl">
              Asisten AI
            </h3>
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
          </div>
        </div>
      </section>

      <section
        className="h-auto bg-background px-8 py-15 flex flex-col gap-8 scroll-mt-24 2xl:px-20 2xl:py-20"
        id="cara-kerja"
      >
        <div className="flex flex-col gap-2 mb-6 lg:mb-10">
          <p className="text-md font-semibold text-primary uppercase 2xl:text-lg">CARA KERJA</p>
          <h1 className="text-2xl font-semibold text-text 2xl:text-4xl">
            Mulai dengan sederhana, lanjutkan sesuai kebutuhan
          </h1>
          <p className="text-md text-gray-500 2xl:text-lg">
            Satu profil anak menjadi konteks untuk pengalaman Nutriva yang lebih
            personal.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-4">
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-xl font-semibold text-surface w-16 h-16 rounded-full bg-primary lg:text-2xl lg:mb-6 lg:w-20 lg:h-20">
              1
            </p>
            <h3 className="text-xl font-semibold text-text lg:text-2xl">
              Buat Profil Anak
            </h3>
            <p className="text-md text-gray-500 text-center lg:text-lg lg:w-auto">
              Isi informasi dasar agar pengalaman lebih relevan.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-xl font-semibold text-surface w-16 h-16 rounded-full bg-primary lg:text-2xl lg:mb-6 lg:w-20 lg:h-20">
              2
            </p>
            <h3 className="text-xl font-semibold text-text lg:text-2xl">
              Rencanakan Nutrisi
            </h3>
            <p className="text-md text-gray-500 text-center lg:text-lg lg:w-auto">
              Susun menu dan catat asupan sesuai kebutuhan harian.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-xl font-semibold text-surface w-16 h-16 rounded-full bg-primary lg:text-2xl lg:mb-6 lg:w-20 lg:h-20">
              3
            </p>
            <h3 className="text-xl font-semibold text-text lg:text-2xl">
              Pantau Pertumbuhan
            </h3>
            <p className="text-md text-gray-500 text-center lg:text-lg lg:w-auto">
              Tambahkan pengukuran dan lihat pola dari waktu ke waktu.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="flex items-center justify-center text-xl font-semibold text-surface w-16 h-16 rounded-full bg-primary lg:text-2xl lg:mb-6 lg:w-20 lg:h-20">
              4
            </p>
            <h3 className="text-xl font-semibold text-text lg:text-2xl">
              Dapatkan Analisis
            </h3>
            <p className="text-md text-gray-500 text-center lg:text-lg lg:w-auto">
              Gunakan ringkasan dan Asisten AI sebagai panduan edukatif.
            </p>
          </div>
        </div>
      </section>

      <section
        id="tentang"
        className="h-auto bg-soft px-8 py-15 flex flex-col gap-8 scroll-mt-24 2xl:px-20 2xl:py-20"
      >
        <Card className="flex items-center p-8 gap-8 justify-around shadow-md md:px-12 md:py-10 md:gap-10 max-sm:flex-col">
          <div className="flex flex-col gap-4">
            <p className="text-md font-semibold text-primary uppercase 2xl:text-lg">
              TRUST & SAFETY
            </p>
            <h1 className="text-2xl font-semibold text-text 2xl:text-4xl">
              Pendamping Orang Tua, Bukan Pengganti Tenaga Kesehatan
            </h1>
            <p className="text-xs text-gray-500 tracking-wider 2xl:text-md">
              Nutriva membantu orang tua memahami informasi nutrisi dan tumbuh
              kembang dengan lebih mudah. Nutriva tidak melakukan diagnosis dan
              tetap mendorong konsultasi dengan ahli gizi atau tenaga kesehatan
              ketika diperlukan.
            </p>
            <div className="grid grid-cols-2 gap-2 lg:gap-4">
              <p className="flex items-center gap-4 text-text text-xs font-semibold lg:text-sm">
                <span className="bg-soft rounded-full w-auto h-auto p-1.5 lg:p-2">
                  {" "}
                  <Check className="text-primary size-3 lg:size-5" />
                </span>
                Informasi edukatif
              </p>
              <p className="flex items-center gap-4 text-text text-xs font-semibold lg:text-sm">
                <span className="bg-soft rounded-full w-auto h-auto p-1.5 lg:p-2">
                  {" "}
                  <Check className="text-primary size-3 lg:size-5" />
                </span>
                Validasi/kolaborasi ahli gizi
              </p>
              <p className="flex items-center gap-4 text-text text-xs font-semibold lg:text-sm">
                <span className="bg-soft rounded-full w-auto h-auto p-1.5 lg:p-2">
                  {" "}
                  <Check className="text-primary size-3 lg:size-5" />
                </span>
                Referral guidance
              </p>
                <p className="flex items-center gap-4 text-text text-xs font-semibold lg:text-sm">
                <span className="bg-soft rounded-full w-auto h-auto p-1.5 lg:p-2">
                  {" "}
                  <Check className="text-primary size-3 lg:size-5" />
                </span>
                Pendekatan non-diagnostik
              </p>
            </div>
          </div>
          <div className="bg-background border border-gray-300 rounded-lg flex flex-col items-center justify-center px-4 py-8 gap-4">
            <ShieldCheck
              strokeWidth={1}
              className="size-24 text-primary fill-soft lg:size-36"
            />
            <h4 className="text-text text-center font-semibold text-xl lg:text-2xl lg:max-w-sm">
              Designed for guidance, not diagnosis
            </h4>
            <p className="text-gray-700 text-center text-sm tracking-wide lg:text-md lg:max-w-xl">
              Ketika ada tanda yang perlu perhatian, Nutriva mengarahkan
              pengguna untuk mencari bantuan profesional.
            </p>
          </div>
        </Card>
      </section>

      <section className="h-auto bg-primary px-8 py-15 flex flex-col items-center gap-4 lg:gap-6 scroll-mt-24 2xl:px-20 2xl:py-20">
        <h3 className="text-surface text-2xl font-bold text-center lg:text-4xl">
          Mulai Dampingi Tumbuh Kembang Anak dengan Lebih Terarah
        </h3>
        <p className="text-gray-200 text-center text-lg tracking-wide lg:text-xl">
          Mulai dari langkah kecil: kenali kebutuhan anak, catat
          perkembangannya, dan pahami informasi yang relevan.
        </p>
        <Button
          variant="outline"
          className="px-20 py-4"
          onClick={() => navigate("/login")}
        >
          Mulai Sekarang
        </Button>
        <p className="text-gray-200 text-md lg:text-lg text-center tracking-wide">
          Daftar untuk membuat profil anak atau masuk jika sudah memiliki akun.
        </p>
      </section>
    </>
  );
}
