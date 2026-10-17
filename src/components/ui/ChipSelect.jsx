import { Check } from "lucide-react";

export default function ChipSelect({ label, options, value, onChange, exclusiveValue, error, hint }) {
  const toggle = (opt) => {
    if (opt === exclusiveValue) return onChange(value.includes(opt) ? [] : [opt]);
    const base = value.filter((v) => v !== exclusiveValue);
    onChange(base.includes(opt) ? base.filter((v) => v !== opt) : [...base, opt]);
  };

  return (
    <div>
      {label && <p className="mb-2 text-xs text-gray-500">{label}</p>}
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(opt)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition ${
                selected
                  ? "border-primary bg-soft font-medium text-primary"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary"
              }`}
            >
              {selected && <Check size={14} />}
              {opt}
            </button>
          );
        })}
      </div>
      {hint && !error && <p className="mt-2 text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}