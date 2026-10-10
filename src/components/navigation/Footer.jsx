import Logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <Footer className="bg-white border-t border-gray-200 pt-16 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b border-gray-200">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg"></div>
            <img
              src={Logo}
              alt="logo nutriva"
              className="w-auto h-20 object-cover"
            />
          </div>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
            Pendamping Nutrisi & Tumbuh Kembang Anak untuk Orang Tua.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Produk
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a
                href="#experiences"
                className="hover:text-emerald-700 transition"
              >
                Nutrisi
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                className="hover:text-emerald-700 transition"
              >
                Pertumbuhan
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                className="hover:text-emerald-700 transition"
              >
                Asisten AI
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Nutriva
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <a
                href="#carakerja"
                className="hover:text-emerald-700 transition"
              >
                Tentang Nutriva
              </a>
            </li>
            <li>
              <a
                href="#carakerja"
                className="hover:text-emerald-700 transition"
              >
                Cara Kerja
              </a>
            </li>
            <li>
              <a href="#trust" className="hover:text-emerald-700 transition">
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
              <a href="#trust" className="hover:text-emerald-700 transition">
                Privasi
              </a>
            </li>
            <li>
              <a href="#trust" className="hover:text-emerald-700 transition">
                Ketentuan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p className="max-w-2xl leading-relaxed">
          Nutriva menyediakan informasi edukatif dan bukan layanan diagnosis
          medis. Konsultasikan kondisi kesehatan anak kepada tenaga kesehatan
          yang sesuai.
        </p>
        <p>&copy; 2026 Nutriva. Hak cipta dilindungi.</p>
      </div>
    </Footer>
  );
}
