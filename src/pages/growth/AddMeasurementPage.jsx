import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Form from "../../components/ui/Form";
import Input, { Select, Textarea } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useChild } from "../../hooks/useChild";
import { useToast } from "../../hooks/useToast";
import { growthService } from "../../services/growthService";

function getDiffMonths(birthDateStr, targetDateStr) {
  if (!birthDateStr || !targetDateStr) return 0;
  const b = new Date(birthDateStr);
  const t = new Date(targetDateStr);
  const diffTime = t - b;
  const months = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375)));
  return months;
}

function getTodayLocalDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AddMeasurementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { child, childList } = useChild();
  const { showSuccess, showError } = useToast();

  const backTo = location.state?.from ?? "/growth";

  const [selectedChildId, setSelectedChildId] = useState("");
  const [measurementDate, setMeasurementDate] = useState(getTodayLocalDate);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Derivasi child yang aktif: prioritaskan yang dipilih manual, jika belum ada ambil child aktif atau anak pertama
  const activeChildId = selectedChildId || child?.id || childList[0]?.id || "";
  const selectedChild = useMemo(() => {
    return childList.find((c) => c.id === activeChildId) ?? child ?? childList[0] ?? null;
  }, [childList, activeChildId, child]);

  const childOptions = useMemo(() => {
    return childList.map((c) => {
      const ageMonths = getDiffMonths(c.birthDate, new Date());
      return {
        value: c.id,
        label: `${c.name} (${ageMonths} bulan)`,
      };
    });
  }, [childList]);

  const currentAgeMonths = useMemo(() => {
    if (!selectedChild?.birthDate) return 0;
    return getDiffMonths(selectedChild.birthDate, measurementDate);
  }, [selectedChild, measurementDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeChild = selectedChild || childList.find((c) => c.id === activeChildId) || child;

    if (!activeChildId || !activeChild) {
      showError("Silakan pilih anak terlebih dahulu.");
      return;
    }

    if (!measurementDate) {
      showError("Tanggal pengukuran wajib diisi.");
      return;
    }

    if (!weight || Number(weight) <= 0) {
      showError("Berat badan wajib diisi dengan nilai yang valid.");
      return;
    }

    if (!height || Number(height) <= 0) {
      showError("Tinggi / panjang badan wajib diisi dengan nilai yang valid.");
      return;
    }

    try {
      setLoading(true);
      await growthService.add({
        childId: activeChildId,
        date: measurementDate,
        weight: Number(weight),
        height: Number(height),
        headCircumference: headCircumference ? Number(headCircumference) : null,
        ageInMonths: currentAgeMonths,
        birthDate: activeChild.birthDate,
        gender: activeChild.gender || "Laki-laki",
        note: note ? note.trim() : undefined,
      });

      showSuccess("Data pengukuran pertumbuhan berhasil disimpan!");
      navigate("/growth");
    } catch (err) {
      console.error("Gagal menyimpan pengukuran:", err);
      showError(err.message || "Gagal menyimpan pengukuran.");
    } finally {
      setLoading(false);
    }
  };

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
          onSubmit={handleSubmit}
          footer={
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/growth")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Pengukuran"}
              </Button>
            </div>
          }
        >
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">1. Pilih Anak</h3>
            <Select
              label="Anak"
              placeholder="Pilih anak"
              options={childOptions}
              value={activeChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              required
            />
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">
              2. Waktu Pengukuran
            </h3>
            <Input
              label="Tanggal Pengukuran"
              name="date"
              type="date"
              value={measurementDate}
              onChange={(e) => setMeasurementDate(e.target.value)}
              max={getTodayLocalDate()}
              required
            />
            {selectedChild && (
              <Card variant="soft" padding="sm" className="text-xs text-gray-600">
                Usia {selectedChild.name} pada tanggal ini: <b>{currentAgeMonths} bulan</b>.{" "}
                {currentAgeMonths < 24
                  ? "Anak di bawah 2 tahun diukur dalam posisi berbaring (panjang badan)."
                  : "Anak 2 tahun ke atas diukur dalam posisi berdiri tegak (tinggi badan)."}
              </Card>
            )}
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
                step="0.05"
                min="1"
                max="50"
                inputMode="decimal"
                placeholder="Contoh: 9.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
              <Input
                label="Panjang / Tinggi Badan (cm)"
                name="height"
                type="number"
                step="0.1"
                min="30"
                max="160"
                inputMode="decimal"
                placeholder="Contoh: 75.5"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
            <Input
              label="Lingkar Kepala (cm), opsional"
              name="headCircumference"
              type="number"
              step="0.1"
              min="20"
              max="70"
              inputMode="decimal"
              placeholder="Contoh: 45"
              value={headCircumference}
              onChange={(e) => setHeadCircumference(e.target.value)}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </section>
        </Form>
      </div>
    </>
  );
}
