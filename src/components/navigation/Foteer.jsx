import Logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-12 px-6 md:px-12">
      <div className="mx-20 grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-gray-200">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="logo nutriva"
              className="w-auto h-20 object-cover"
            />
            <h1 className="text-primary font-bold text-3xl">Nutriva</h1>
          </div>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Pendamping Nutrisi & Tumbuh Kembang Anak untuk Orang Tua.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text uppercase tracking-wider">
            Produk
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <a
                href="#experiences"
                className="hover:text-seocndary transition"
              >
                Nutrisi
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                className="hover:text-secondary transition"
              >
                Pertumbuhan
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                className="hover:text-secondary transition"
              >
                Asisten AI
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text uppercase tracking-wider">
            Nutriva
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li>
              <a
                href="#carakerja"
                className="hover:text-secondary transition"
              >
                Tentang Nutriva
              </a>
            </li>
            <li>
              <a
                href="#carakerja"
                className="hover:text-secondary transition"
              >
                Cara Kerja
              </a>
            </li>
            <li>
              <a href="#trust" className="hover:text-secondary transition">
                Trust & Safety
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Legal
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a href="#trust" className="hover:text-secondary transition">
                Privasi
              </a>
            </li>
            <li>
              <a href="#trust" className="hover:text-secondary transition">
                Ketentuan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p className="leading-relaxed">
          Nutriva menyediakan informasi edukatif dan bukan layanan diagnosis
          medis. Konsultasikan kondisi kesehatan anak kepada tenaga kesehatan
          yang sesuai.
        </p>
        <p>&copy; 2026 Nutriva. Hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}