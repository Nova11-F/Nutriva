import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

function Ribbon({ className = "", reverse = false }) {
  return (
    <div className={`absolute -left-[10%] w-[120%] overflow-hidden py-3 ${className}`}>
      <div className={`flex w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {[0, 1].map((set) => (
          <div key={set} className="flex shrink-0 items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-6 whitespace-nowrap pr-6 text-lg font-medium md:text-2xl"
              >
                404 Not Found <span className="text-secondary">✱</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 pb-40 text-center">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none text-[9rem] font-extrabold leading-none text-gray-100 sm:text-[16rem] md:text-[24rem]"
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-text md:text-6xl">
          Halaman Tidak Ditemukan!
        </h1>
        <p className="max-w-md text-sm text-gray-500 md:text-base">
          Halaman yang Anda cari tidak tersedia, sudah dipindahkan, atau alamatnya salah.
        </p>
        <Button size="lg" className="mt-2 inline-flex items-center gap-2" onClick={() => navigate("/")}>
          Kembali ke Beranda <ArrowRight size={18} />
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 overflow-hidden md:h-56">
        <Ribbon className="bottom-12 -rotate-3 bg-primary text-white" reverse />
        <Ribbon className="bottom-5 rotate-2 bg-gray-900 text-white" />
      </div>
    </div>
  );
}