import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import Header from "../../components/navigation/Header";
import { useAuth } from "../../hooks/useAuth";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import {
  formatAge,
  formatMonthYear,
  getAgeInMonths,
} from "../../utils/formatDate";
import {
  SquareUserRound,
  KeyRound,
  Pencil,
  Baby,
  Sparkles,
  Plus,
  Clock,
  LogOut,
  SlidersHorizontal,
  BellRing,
  Check,
  Trash2,
} from "lucide-react";

const genderLabel = { female: "Perempuan", male: "Laki-laki" };

const preferenceItems = [
  {
    key: "meal",
    title: "Jadwal Makan & MPASI",
    desc: "Alarm jam makan pagi, camilan, dan malam",
  },
  {
    key: "weight",
    title: "Timbang Berat Badan Bulanan",
    desc: "Pengingat update data kurva tiap tanggal 1",
  },
  {
    key: "tips",
    title: "Tips Nutrisi AI Harian",
    desc: "Rekomendasi menu berdasarkan kebutuhan mikro gizi",
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const goAdd = () => navigate("/onboarding", { state: { from: "/profile" } });
  const goEdit = (id) =>
    navigate(`/onboarding?edit=${id}`, { state: { from: "/profile" } });
  const { user, logout } = useAuth();
  const {
    child,
    childList,
    loading: childLoading,
    selectChild,
    clearChild,
  } = useChild();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState({ meal: true, weight: true, tips: false });

  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDeleteChild = async (target) => {
    if (
      !window.confirm(
        `Hapus profil ${target.name}? Tindakan ini tidak bisa dibatalkan.`,
      )
    )
      return;
    try {
      await clearChild(target.id);
      showToast(`Profil ${target.name} dihapus`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Anda telah keluar", "success");
    navigate("/");
  };

  const comingSoon = () => showToast("Fitur ini belum tersedia", "info");

  const parent = {
    name: user?.name ?? "Pengguna",
    email: user?.email ?? "-",
    phone: user?.phone ?? "Belum diisi",
    city: user?.city ?? "Belum diisi",
    role: user?.role ?? "Orang Tua",
    joined: formatMonthYear(user?.createdAt),
  };

  const infoItems = [
    { label: "Email Aktif", value: parent.email },
    { label: "Nomor WhatsApp", value: parent.phone },
    { label: "Kota Domisili", value: parent.city },
    { label: "Peran", value: parent.role },
  ];

  return (
    <>
      <Header variant="profil" />
      <div className="px-4">
        <div className="mt-6 flex flex-col gap-2">
          <div className="mb-2 flex items-center gap-2 px-2 md:mb-4 md:px-4">
            <SquareUserRound
              strokeWidth={2}
              className="size-6 text-secondary md:size-8"
            />
            <h3 className="text-xl font-semibold text-text md:text-2xl">
              Profil Orang Tua
            </h3>
          </div>

          <Card className="flex flex-col gap-4 md:gap-6">
            <div className="grid grid-cols-1 gap-4 md:flex md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-xl bg-secondary text-2xl font-bold">
                  {parent.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col ">
                  <h4 className="text-xl font-semibold text-text">
                    {parent.name}
                  </h4>
                  <p className="text-md font-medium text-gray-500">
                    {parent.role}
                  </p>
                  <p className="text-md font-medium text-gray-400">
                    Bergabung sejak {parent.joined}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 md:gap-4">
                <Button
                  variant="outline"
                  onClick={comingSoon}
                  className="flex w-full items-center justify-center gap-2 md:w-fit"
                >
                  <Pencil className="size-5 md:size-6" />
                  Edit Profil
                </Button>
                <Button
                  variant="outline"
                  onClick={comingSoon}
                  className="flex w-full items-center justify-center gap-2 md:w-fit"
                >
                  <KeyRound className="size-5 md:size-6" />
                  Ubah Sandi
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4">
              {infoItems.map(({ label, value }) => (
                <Card key={label} variant="silver" className="px-8">
                  <h4 className="text-lg font-bold text-gray-500">{label}</h4>
                  <p className="break-words text-lg font-semibold text-text">
                    {value}
                  </p>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col gap-2 px-2 md:px-4">
              <div className="flex items-center gap-2">
                <Baby
                  strokeWidth={2}
                  className="size-6 text-secondary md:size-8"
                />
                <h3 className="text-xl font-semibold text-text md:text-2xl">
                  Profil Anak
                </h3>
              </div>
              <p className="text-xs font-medium text-gray-500 md:text-lg">
                Pantau kurva tumbuh kembang WHO dan kebutuhan gizi individual
                balita
              </p>
            </div>
            <Card variant="silver" padding="sm">
              <p className="md:text-md text-center text-xs font-semibold text-text">
                {childList.length} Anak Terdaftar
              </p>
            </Card>
          </div>

          {childLoading && <Spinner center label="Memuat profil anak..." />}

          {!childLoading && childList.length === 0 && (
            <Card className="mb-6 flex flex-col gap-4 p-8">
              <div className="flex w-fit items-center gap-2 rounded-2xl bg-soft px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary md:text-sm">
                <Sparkles className="size-4 fill-primary md:size-5" />
                Langkah Pertama Pemantauan
              </div>
              <h3 className="text-xl font-bold text-text md:text-2xl">
                Belum ada profil anak
              </h3>
              <p className="text-lg font-medium text-gray-400">
                Tambahkan profil anak untuk mendapatkan rekomendasi nutrisi,
                pemantauan pertumbuhan, dan jawaban Asisten AI yang sesuai
                dengan kondisi anak Anda.
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Button
                  onClick={goAdd}
                  className="flex w-fit items-center justify-center gap-2"
                >
                  <Plus size={24} />
                  Tambah profil anak
                </Button>
                <p className="flex items-center gap-2 text-lg font-medium text-gray-500">
                  <Clock size={20} />
                  Hanya butuh 2 menit untuk melengkapi data
                </p>
              </div>
            </Card>
          )}

          {!childLoading &&
            childList.map((c) => {
              const isActive = c.id === child?.id;
              return (
                <Card
                  key={c.id}
                  variant={isActive ? "success" : "default"}
                  className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-soft text-primary">
                      {c.photo ? (
                        <img
                          src={c.photo}
                          alt={c.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Baby size={32} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-semibold text-text">
                          {c.name}
                        </h4>
                        {isActive && (
                          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-surface">
                            <Check size={12} /> Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-md font-medium text-gray-500">
                        {formatAge(getAgeInMonths(c.birthDate))} ·{" "}
                        {genderLabel[c.gender]}
                        {c.birthOrder ? ` · Anak ke-${c.birthOrder}` : ""}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid items-center justify-end gap-2 ${
                      isActive ? "grid-cols-2" : "grid-cols-3"
                    }`}
                  >
                    {!isActive && (
                      <Button
                        size="sm"
                        className="flex items-center gap-2 justify-center w-full rounded-md"
                        onClick={() => selectChild(c.id)}
                      >
                        <Check className="size-5" />
                        Jadikan Aktif
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => goEdit(c.id)}
                      className="flex items-center gap-2 justify-center w-50 rounded-md"
                    >
                      <Pencil className="size-5" /> Ubah
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteChild(c)}
                      className="group flex items-center justify-center gap-2 border bg-surface border-danger text-danger hover:bg-danger w-50"
                    >
                      <Trash2 className="size-5 text-danger group-hover:text-surface" />{" "}
                      <span className="text-danger group-hover:text-surface">
                        Hapus
                      </span>
                    </Button>
                  </div>
                </Card>
              );
            })}

          {!childLoading && childList.length > 0 && (
            <Button
              variant="outline"
              onClick={goAdd}
              className="mb-6 flex w-full items-center justify-center gap-2 md:w-fit"
            >
              <Plus size={20} />
              Tambah anak lainnya
            </Button>
          )}
        </div>

        <div className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <SlidersHorizontal
              strokeWidth={2}
              className="size-6 text-secondary md:size-8"
            />
            <h3 className="text-xl font-semibold tracking-wide text-text leading-none md:text-2xl">
              Pengaturan dan Preferensi Nutriva
            </h3>
          </div>

          <Card className="flex flex-col gap-6 p-4">
            <div className="flex items-center gap-2">
              <BellRing size={24} className="text-gray-500" />
              <h4 className="text-xl font-semibold uppercase text-text">
                Notifikasi & Pengingat
              </h4>
            </div>

            {preferenceItems.map(({ key, title, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-lg font-semibold text-text">{title}</p>
                  <p className="text-md font-medium text-gray-500">{desc}</p>
                </div>
                <Input
                  type="checkbox"
                  name={key}
                  checked={prefs[key]}
                  onChange={handlePrefChange}
                  aria-label={title}
                />
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-4 border-t-2 border-t-gray-500 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-semibold text-text">
              Keluar dari Akun Nutriva
            </h4>
            <p className="text-lg font-medium text-gray-500">
              Keluar dari sesi ini di peramban ini. Data Anda tetap tersimpan
              dengan aman.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 border border-danger px-4 py-2 hover:bg-danger"
          >
            <LogOut
              size={24}
              className="text-danger group-hover:text-surface"
            />
            <span className="text-danger group-hover:text-surface">
              Keluar Akun (Logout)
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
