import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Header from "../../components/navigation/Header";
import { SquareUserRound, KeyRound, Pencil, Baby, Sparkles,
    Plus, Clock, LogOut, SlidersHorizontal, BellRing
 } from "lucide-react";
 import Input from "../../components/ui/Input";

export default function ProfilePage() {
  return (
    <>
        <Header variant="profil"/>
      <div className="px-4">
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex items-center gap-4 px-4 mb-4">
            <SquareUserRound
              size={32}
              strokeWidth={2}
              className="text-secondary"
            />
            <h3 className="text-text text-2xl font-semibold">
              Profil Orang Tua
            </h3>
          </div>
          <Card className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Card className="bg-secondary p-8 font-bold text-2xl">P</Card>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl text-text font-semibold">
                    Siti Aminah
                  </h4>
                  <p className="text-md text-gray-500 font-medium">
                    Ibu / Orang Tua
                  </p>
                  <p className="text-md text-gray-400 font-medium">
                    Bergabung sejak Oktober 2026
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Pencil size={24} />
                  <p>Edit Profil</p>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <KeyRound size={24} />
                  <p>Ubah Sandi</p>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card variant="silver" className="px-8">
                <h4 className="text-lg text-gray-500 font-bold">Email Aktif</h4>
                <p className="text-lg text-text font-semibold">
                  siti.aminah@gmail.com
                </p>
              </Card>
              <Card variant="silver" className="px-8">
                <h4 className="text-lg text-gray-500 font-bold">
                  Nomor WhatssApp
                </h4>
                <p className="text-lg text-text font-semibold">
                  0812-3456-7890
                </p>
              </Card>
              <Card variant="silver" className="px-8">
                <h4 className="text-lg text-gray-500 font-bold">
                  Kota Domisili
                </h4>
                <p className="text-lg text-text font-semibold">
                  Jakarta Selatan, DKI
                </p>
              </Card>
              <Card variant="silver" className="px-8">
                <h4 className="text-lg text-gray-500 font-bold">Peran</h4>
                <p className="text-lg text-text font-semibold">Ibu</p>
              </Card>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col gap-2 px-4">
              <div className="flex items-center gap-4">
                <Baby size={32} strokeWidth={2} className="text-secondary" />
                <h3 className="text-text text-2xl font-semibold">
                  Profil Anak
                </h3>
              </div>
              <p className="text-gray-500 text-md font-medium">
                Pantau kurva tumbuh kembang WHO dan kebutuhan gizi individual
                balita
              </p>
            </div>
            <Card variant="silver" padding="sm">
              <p className="text-gray-500 text-md font-semibold">
                0 Anak Terdaftar
              </p>
            </Card>
          </div>
          <Card  className="flex flex-col gap-4 mb-10">
            <div className="w-fit flex items-center gap-2 bg-soft text-primary px-4 py-2 rounded-2xl text-md font-semibold tracking-wide uppercase">
              <Sparkles size={18} className="fill-primary"/>
              Langkah Pertama Pemantauan
            </div>
            <h3 className="text-2xl text-text font-bold px-4">Belum ada profil anak</h3>
            <p className="text-lg font-medium text-gray-400">Tambahkan fitur Profil Anak yang mencakup identitas, riwayat kelahiran, data antropometri, dan informasi nutrisi. Lindungi data melalui autentikasi, pembatasan akses, persetujuan orang tua/wali, dan penyimpanan yang aman. Gunakan data tersebut untuk mempersonalisasi fitur Nutrisi, Pertumbuhan, dan AI Nutriva.</p>
            <div className="flex items-center gap-4">
            <Button variant="primary" className="w-fit flex items-center justify-center">
                <Plus size={24}/>
                <p>Tambah profil anak</p>
            </Button>
            <p className="flex items-center gap-2 text-lg text-gray-500 font-medium"><Clock size={20} />hanya butuh 2 menit untuk melengkapi data</p>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-2 px-4">
        <SlidersHorizontal size={32} strokeWidth={3} className="text-secondary"/>
        <h3 className="text-2xl text-text font-semibold">Pengaturan dan Preverensi Nutriva</h3>
            </div>
            <Card className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-2 ">
                    <BellRing size={24} className="text-gray-500"/>
                    <h4 className="text-text text-xl font-semibold uppercase">Notifikasi & Pengingat</h4>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-lg text-text font-semibold"> jadwal Makan & MPASI</p>
                    <p className="text-md text-gray-500 font-medium">Alarm jam makan pagi, camilan, dan malam</p>
                    </div>
                    <Input type="checkbox"></Input>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-lg text-text font-semibold"> Timbang Berat Badan Bulanan</p>
                    <p className="text-md text-gray-500 font-medium">Pengingat update data kurva tiap tanggal 1</p>
                    </div>
                    <Input type="checkbox"></Input>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-lg text-text font-semibold"> Tips Nutrisi AI Harian</p>
                    <p className="text-md text-gray-500 font-medium">Rekomendasi menu berdasarkan kebutuhan mikro gizi</p>
                    </div>
                    <Input type="checkbox"></Input>
                </div>
            </Card>
        </div>
        <div className="flex items-center justify-between pt-6 border-t-2 border-t-gray-500">
            <div className="flex flex-col gap-2">
                <h4 className="text-xl text-text font-semibold">Keluar dari Akun Nutriva</h4>
                <p className="text-lg text-gray-500 font-medium">Keluar dari sesi ini di peramban ini. Data Anda tetap tersimpan dengan aman di cloud.</p>
            </div>
            <Button variant="ghost" className="group flex items-center justify-center gap-2 py-2 px-4 border border-danger hover:bg-danger">
                <LogOut size={24} className="text-danger group-hover:text-surface"/>
                <p className="text-danger group-hover:text-surface">Keluar Akun (Logout)</p>
            </Button>
        </div>
      </div>
    </>
  );
}
