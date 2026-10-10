import Button from "../../components/ui/Button";
import Navbar from "../../components/navigation/Navbar";
import imageLanding from "../../assets/images/landingpage.png";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
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
              <Button variant="primary" size="xl">
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
            <div className="absolute -top-20 right-40 w-44 h-44 bg-light rounded-full pointer-events-none"></div>
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
        <div className="flex flex-col gap-4">
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
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">01</p>
            <h3 className="text-2xl font-semibold text-text">Menu & Porsi</h3>
            <p className="text-lg text-gray-500">
              Bingung menentukan menu dan porsi anak yang sesuai kebutuhan
              sehari-hari.
            </p>
          </div>
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">02</p>
            <h3 className="text-2xl font-semibold text-text">Pertumbuhan</h3>
            <p className="text-lg text-gray-500">
              Khawatir berat atau tinggi anak tidak berkembang sesuai harapan.
            </p>
          </div>
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">03</p>
            <h3 className="text-2xl font-semibold text-text">Informasi Gizi</h3>
            <p className="text-lg text-gray-500">
              Informasi dari internet sering berbeda-beda dan sulit
              dibandingkan.
            </p>
          </div>
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">04</p>
            <h3 className="text-2xl font-semibold text-text">
              Aksi Sehari-hari
            </h3>
            <p className="text-lg text-gray-500">
              Sulit menerjemahkan informasi menjadi langkah praktis yang bisa
              dilakukan.
            </p>
          </div>
        </div>
      </section>

      <section id="value" className="h-screen bg-soft px-40 py-30 flex flex-col gap-15 scroll-mt-24">
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold text-primary uppercase">
            Value Proposition
          </p>
          <h1 className="text-6xl font-semibold text-text">
            Dari Informasi Menjadi Tindakan
          </h1>
          <p className="text-xl font-medium text-gray-500">
            Nutriva menyederhanakan proses yang biasanya tersebar menjadi tiga langkah yang mudah diikuti.
          </p>
        </div>
        <div className="flex justify-around items-center gap-10">
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">01</p>
            <h3 className="text-2xl font-semibold text-text">Menu & Porsi</h3>
            <p className="text-lg text-gray-500">
              Bingung menentukan menu dan porsi anak yang sesuai kebutuhan
              sehari-hari.
            </p>
          </div>
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">02</p>
            <h3 className="text-2xl font-semibold text-text">Pertumbuhan</h3>
            <p className="text-lg text-gray-500">
              Khawatir berat atau tinggi anak tidak berkembang sesuai harapan.
            </p>
          </div>
          <div className="px-8 py-10 bg-surface flex flex-col gap-4 border-2 border-gray-300 rounded-xl w-150">
            <p className="text-lg font-semibold text-primary">03</p>
            <h3 className="text-2xl font-semibold text-text">Informasi Gizi</h3>
            <p className="text-lg text-gray-500">
              Informasi dari internet sering berbeda-beda dan sulit
              dibandingkan.
            </p>
          </div>
        </div>
      </section>

      <section id="fitur" className="min-h-[1000px] bg-soft scroll-mt-24">
        <h1></h1>
      </section>
      <section id="cara-kerja" className="min-h-[1000px] bg-soft scroll-mt-24">
        <h1></h1>
      </section>
      <section id="tentang" className="min-h-[00px] bg-soft scroll-mt-24">
        <Button>Lihat</Button>
      </section>

      {/* <Footer /> */}
    </>
  );
}
