import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";

export default function HomePage (){
  return (
    <>
    <div className="flex flex-col gap-8 my-10 px-4 mr-40">
    <h1 className="text-3xl text-text font-semibold">Beranda</h1>
    <Card variant="success" className="flex flex-col p-20 gap-6 shadow-lg">
      <h2 className="text-4xl text-primary font-bold">Tambahkan profil anak untuk mulai</h2>
      <p className="w-200 text-lg text-gray-500">Profil anak membantu Nutriva memberikan rekomendasi nutrisi, pemantauan pertumbuhan, dan bantuan AI yang lebih relevan.</p>
      <Button variant="outline" className="flex items-center justify-center w-fit"><Plus/>Tambah Profile Anak</Button>
    </Card>

    <h2 className="text-2xl text-text font-semibold">Yang bisa dilakukan di Nutriva</h2>
    <div className="flex items-center justify-between gap-10">
      <Card variant="success" className="flex flex-col gap-4 py-10 px-20 shadow-lg">
        <h3 className="text-2xl text-text font-semibold">Perencanaan & Pelacakan Nutrisi</h3>
        <p className="text-lg text-gray-500">Rencanakan menu dan catat makanan.</p>
      </Card>
      <Card variant="default" className="flex flex-col gap-4 py-10 px-20 shadow-lg">
        <h3 className="text-2xl text-text font-semibold">Pemantauan Pertumbuhan</h3>
        <p className="text-lg text-gray-500">Catat BB/TB dan lihat perkembangannya.</p>
      </Card>
      <Card variant="success" className="flex flex-col gap-4 py-10 px-20 shadow-lg">
        <h3 className="text-2xl text-text font-semibold">Asisten AI Nutrisi Personal</h3>
        <p className="text-lg text-gray-500">Dapatkan informasi edukatif dari sumber tepercaya.</p>
      </Card>
    </div>
    </div>
    </>
  );
}