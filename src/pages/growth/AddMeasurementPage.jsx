import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Form from "../../components/ui/Form";
import Input, { Select, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const children = [
  { value: "1", label: "Rayyan Al-Fatih (18 bulan)" },
  { value: "2", label: "Aisha Humaira (6 bulan)" },
];

export default function AddMeasurementPage() {
  const navigate = useNavigate();
  const backTo = location.state?.from ?? "/home";

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-5 px-4 py-6 md:px-6">
        <div className="flex items-center justify-between">
          <div className="px-4">
            <h2 className="text-2xl font-bold text-text">
              Catat Pengukuran Baru
            </h2>
            <p className="text-sm text-gray-500">
              Catat berat dan tinggi badan anak untuk memantau pola
              pertumbuhannya dari waktu ke waktu.
            </p>
          </div>
          <div>
            <Button
              variant="noborder"
              onClick={() => navigate(backTo)}
              className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4 md:size-6" /> Kembali
            </Button>
          </div>
        </div>

        <Form
          footer={
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/growth")}
              >
                Batal
              </Button>
              <Button type="submit">Simpan Pengukuran</Button>
            </div>
          }
        >
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">1. Pilih Anak</h3>
            <Select
              label="Anak"
              placeholder="Pilih anak"
              options={children}
              defaultValue="1"
            />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">
              2. Waktu Pengukuran
            </h3>
            <Input label="Tanggal Pengukuran" name="date" type="date" />
            <Card variant="soft" padding="sm" className="text-xs text-gray-600">
              Usia Rayyan pada tanggal ini: <b>18 bulan</b>. Anak di bawah 2
              tahun diukur dalam posisi berbaring (panjang badan).
            </Card>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">
              3. Antropometri Balita
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Berat Badan (kg)"
                name="weight"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="Contoh: 9.5"
              />
              <Input
                label="Panjang Badan (cm)"
                name="height"
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="Contoh: 72"
              />
            </div>
            <Input
              label="Lingkar Kepala (cm), opsional"
              name="headCircumference"
              type="number"
              step="0.1"
              inputMode="decimal"
              placeholder="Contoh: 45"
            />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">
              4. Keterangan{" "}
              <span className="font-normal text-gray-400">(opsional)</span>
            </h3>
            <Textarea
              name="note"
              rows={3}
              maxLength={200}
              placeholder="Contoh: ditimbang di posyandu, anak sedang batuk pilek"
            />
          </section>
        </Form>
      </div>
    </>
  );
}
