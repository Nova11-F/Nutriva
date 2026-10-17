import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import Button from "./Button";

const MAX_FILE_MB = 5;

function resizeToSquare(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = Math.min(side, size);
      canvas.getContext("2d").drawImage(
        img, (img.width - side) / 2, (img.height - side) / 2, side, side,
        0, 0, canvas.width, canvas.height
      );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak dapat dibaca"));
    };
    img.src = url;
  });
}

export default function PhotoUpload({ label = "Foto Profil Anak", value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("File harus berupa gambar");
    if (file.size > MAX_FILE_MB * 1024 * 1024) return setError(`Ukuran maksimal ${MAX_FILE_MB} MB`);

    setError("");
    setBusy(true);
    try {
      onChange(await resizeToSquare(file));
    } catch {
      setError("Gambar tidak dapat dibaca. Coba format JPG atau PNG");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
          {value ? <img src={value} alt="Foto anak" className="size-full object-cover" /> : <Camera size={28} />}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" loading={busy} onClick={() => inputRef.current?.click()}>
              {value ? "Ganti foto" : "Pilih foto"}
            </Button>
            {value && <Button type="button" size="sm" variant="ghost" onClick={() => onChange("")}>Hapus</Button>}
          </div>
          <p className="text-[11px] text-gray-400">Opsional. JPG atau PNG, maksimal {MAX_FILE_MB} MB.</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}