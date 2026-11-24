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
import Reveal from "../../components/Reveal";

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

  const goEditParent = () =>
    navigate("/onboarding?mode=parent", { state: { from: "/profile" } });
  const goChangePassword = () => navigate("/profile/changepass");

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
          <Reveal variant="slide-up">
            <div className="mb-1 md:mb-2 flex items-center gap-2">
              <SquareUserRound
                strokeWidth={2}
                className="size-6 text-secondary md:size-8"
              />
              <h3 className="text-xl font-semibold text-text md:text-2xl">
                Profil Orang Tua
              </h3>
            </div>
          </Reveal>

          <Reveal variant="slide-up">
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
                    onClick={goEditParent}
                    className="flex w-full items-center justify-center gap-2 md:w-fit"
                  >
                    <Pencil className="size-5 md:size-6" />
                    Edit Profil
                  </Button>
                  <Button
                    variant="outline"
                    onClick={goChangePassword}
                    className="flex w-full items-center justify-center gap-2 md:w-fit"
                  >
                    <KeyRound className="size-5 md:size-6" />
                    Ubah Sandi
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                {infoItems.map(({ label, value }, index) => (
                  <Reveal key={label} variant="pop-up" delay={index * 0.1}>
                    <Card key={label} variant="silver" className="px-4 py-3">
                      <h4 className="text-base font-bold text-gray-500 lg:text-lg">
                        {label}
                      </h4>
                      <p className="break-words text-sm font-semibold text-text lg:text-base">
                        {value}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          <Reveal variant="slide-up">
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Baby
                    strokeWidth={2}
                    className="size-6 text-secondary md:size-8"
                  />
                  <h3 className="text-xl font-semibold text-text md:text-2xl">
                    Profil Anak
                  </h3>
                </div>
                <p className="text-xs font-medium text-gray-500 lg:text-sm">
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
          </Reveal>

          {childLoading && <Spinner center label="Memuat profil anak..." />}

          {!childLoading && childList.length === 0 && (
             <Reveal variant="slide-up">
            <Card className="mb-6 flex flex-col gap-2 p-4 lg:p-6">
              <div className="flex w-fit items-center gap-2 rounded-2xl bg-soft px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-primary ">
                <Sparkles className="size-4 fill-primary lg:size-5" />
                Langkah Pertama Pemantauan
              </div>
              <h3 className="text-xl font-bold text-text tracking-wide lg:text-2xl">
                Belum ada profil anak
              </h3>
              <p className="text-sm text-gray-500 lg:text-base">
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
                <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Clock className="size-4 lg:size-5" />
                  Hanya butuh 2 menit untuk melengkapi data
                </p>
              </div>
            </Card>
            </Reveal>
          )}

          {!childLoading &&
            childList.map((c, index) => {
              const isActive = c.id === child?.id;
              return (
                <Reveal key={c.id} variant="pop-up" delay={index * 0.1}>
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
                </Reveal>
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
          <Reveal variant="slide-up">
          <div className="flex items-center gap-2 px-2">
            <SlidersHorizontal
              strokeWidth={2}
              className="size-6 text-secondary md:size-8"
            />
            <h3 className="text-xl font-semibold tracking-wide text-text leading-none md:text-2xl">
              Pengaturan dan Preferensi Nutriva
            </h3>
          </div>
          </Reveal>

          <Reveal variant="slide-up">
          <Card className="flex flex-col gap-6 p-4">
            <div className="flex items-center gap-2">
              <BellRing className="size-5 lg:size-6 text-gray-500" />
              <h4 className="text-lg text-text font-semibold lg:text-xl">
                Notifikasi & Pengingat
              </h4>
            </div>

            {preferenceItems.map(({ key, title, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-base font-semibold text-text lg:text-lg">
                    {title}
                  </p>
                  <p className="text-xs text-gray-500 lg:text-sm">{desc}</p>
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
          </Reveal>
        </div>

        <Reveal variant="slide-up">
        <div className="flex flex-col gap-4 border-t-2 border-t-gray-500 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-semibold text-text lg:text-xl">
              Keluar dari Akun Nutriva
            </h4>
            <p className="text-xs font-medium text-gray-500 lg:text-sm">
              Keluar dari sesi ini di peramban ini. Data Anda tetap tersimpan
              dengan aman.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 border border-danger px-4 py-2 hover:bg-danger"
          >
            <LogOut className="size-5 text-danger group-hover:text-surface" />
            <span className="text-xs text-danger group-hover:text-surface">
              Keluar Akun (Logout)
            </span>
          </Button>
        </div>
        </Reveal>
      </div>
    </>
  );
}
