import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import Header from "../../components/navigation/Header";
import ChildProfileForm from "../../components/forms/ChildProfileForm";
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
  const [formState, setFormState] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    child,
    childList,
    loading: childLoading,
    selectChild,
    saveChild,
    updateChild,
    clearChild,
  } = useChild();
  const { showToast } = useToast();

  const [editingChild, setEditingChild] = useState(false);
  const [prefs, setPrefs] = useState({ meal: true, weight: true, tips: false });

  const handlePrefChange = (e) => {
    const { name, checked } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddChild = async (values) => {
    try {
      await saveChild(values);
      showToast(`Profil ${values.name} ditambahkan`, "success");
      setFormState(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateChild = async (id, { name, birthDate, gender }) => {
    try {
      await updateChild({ name, birthDate, gender }, id);
      showToast("Profil anak diperbarui", "success");
      setFormState(null);
    } catch (err) {
      showToast(err.message, "error");
    }
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
            <Card variant="default" padding="sm">
              <p className="text-center text-xs font-semibold text-text md:text-md">
                {childList.length} Anak Terdaftar
              </p>
            </Card>
          </div>

          {childLoading && <Spinner center label="Memuat profil anak..." />}

          {!childLoading && childList.length === 0 && formState === null && (
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
                  onClick={() => setFormState({ mode: "add" })}
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
              const isEditing =
                formState?.mode === "edit" && formState.id === c.id;

              if (isEditing) {
                return (
                  <ChildProfileForm
                    key={c.id}
                    title={`Ubah Profil ${c.name}`}
                    initialValues={c}
                    onSubmit={(values) => handleUpdateChild(c.id, values)}
                    footer={
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Simpan Perubahan
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormState(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    }
                  />
                );
              }

              return (
                <Card
                  key={c.id}
                  variant={isActive ? "success" : "default"}
                  className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-xl bg-soft text-primary">
                      <Baby size={32} />
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
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <Button size="sm" onClick={() => selectChild(c.id)}>
                        Jadikan Aktif
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFormState({ mode: "edit", id: c.id })}
                      className="flex items-center justify-center gap-2 w-full md:w-fit"
                    >
                      <Pencil className="size-4 md:size-5"/> Ubah
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteChild(c)}
                      className="group flex items-center justify-center gap-2 w-full md:w-fit bg-surface  border border-danger hover:bg-danger hover:text-surface"
                    >
                      <Trash2 className="size-4 text-danger md:size-5 group-hover:text-surface"/> <span className=" text-danger group-hover:text-surface">Hapus</span>
                    </Button>
                  </div>
                </Card>
              );
            })}

          {!childLoading && formState?.mode === "add" && (
            <ChildProfileForm
              key="add"
              title="Tambah Profil Anak"
              onSubmit={handleAddChild}
              footer={
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Simpan Profil
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormState(null)}
                  >
                    Batal
                  </Button>
                </div>
              }
            />
          )}

          {!childLoading && childList.length > 0 && formState === null && (
            <Button
              variant="outline"
              onClick={() => setFormState({ mode: "add" })}
              className="mb-6 flex w-full items-center justify-center gap-2 md:w-fit"
            >
              <Plus size={20} />
              Tambah anak lainnya
            </Button>
          )}
        </div>

        <div className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-4">
            <SlidersHorizontal
              size={32}
              strokeWidth={2}
              className="text-secondary"
            />
            <h3 className="text-2xl font-semibold text-text">
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
