import { useId, useState } from "react";
import { X } from "lucide-react";

export default function TagInput({ label, value, onChange, placeholder, hint, error, disabled = false, max = 15 }) {
  const id = useId();
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    setDraft("");
    if (!tag || value.length >= max) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // jangan submit form
      addTag();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={disabled ? "opacity-50" : ""}>
      {label && <label htmlFor={id} className="mb-1 block text-xs text-gray-500">{label}</label>}
      <div className={`flex flex-wrap items-center gap-2 rounded-lg border bg-gray-50 px-2 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 ${
        error ? "border-red-400" : "border-gray-200 focus-within:border-primary"
      }`}>
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary">
            {tag}
            <button type="button" disabled={disabled} onClick={() => onChange(value.filter((t) => t !== tag))}
                    aria-label={`Hapus ${tag}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag} 
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-32 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      {hint && !error && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}