import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import CurrentDate from "../../components/ui/Date";
import { SquareUserRound,
    KeyRound,
    Pencil
 } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
    <div className="px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <h1 className="text-4xl text-text font-bold">Profil</h1>
          <p className="w-fit inline-flex items-center gap-2 bg-soft border border-secondary py-1 px-4 rounded-2xl text-secondary text-md font-semibold">
            <span className="h-2 w-2 bg-secondary rounded-full"></span>
            Akun Aktif
          </p>
        </div>
        <CurrentDate />
      </div>
      <p className="text-md text-gray-400 font-medium">Akun orang tua, manajemen data anak, dan preferensi aplikasi Nutriva</p>
      <div className="flex flex-col mt-10">
        <div className="flex items-center gap-4 px-4 mb-4">
        <SquareUserRound size={36} strokeWidth={2} className="text-secondary"/>
        <h3 className="text-text text-2xl font-semibold">Profil Orang Tua</h3>
        </div>
        <Card className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Card className="bg-secondary p-8 font-bold text-2xl">
                            P
                        </Card>
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
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                            <Pencil size={24}/>
                            <p>Edit Profil</p>
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center gap-2">
                            <KeyRound size={24}/>
                            <p>Ubah Sandi</p>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <Card variant="silver" className="px-8">
                        <h4 className="text-lg text-gray-500 font-bold">
                            Email Aktif
                        </h4>
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
                        <h4 className="text-lg text-gray-500 font-bold">
                            Peran
                        </h4>
                        <p className="text-lg text-text font-semibold">
                            Ibu
                        </p>
                    </Card>
                </div>
        </Card>
      </div>
      </div>
    </>
  );
}
