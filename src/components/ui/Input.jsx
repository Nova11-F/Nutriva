import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const fieldStyle =
  "w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-text " +
  "placeholder:text-gray-400 outline-none transition " +
  "focus:border-secondary focus:bg-surface focus:ring-2 focus:ring-green-100";

export default function Input({
  label,
  type = "text",
  error,
  hint,
  className = "",
  ...props 
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  if (type === "checkbox") {
    return (
      <div className={className}>
        <label htmlFor={id} className="flex items-start gap-2 text-xs text-gray-600">
          <input
            id={id}
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
            {...props}
          />
          <span>{label}</span>
        </label>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-xs text-gray-500">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`${fieldStyle} ${error ? "border-danger" : "border-gray-200"} ${
            isPassword ? "pr-10" : ""
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>

      {hint && !error && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function RadioGroup({ label, name, options, value, onChange, error, className = "" }) {
  return (
    <div className={className}>
      {label && <p className="mb-1 text-xs text-gray-500">{label}</p>}

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text
                       has-[:checked]:border-secondary has-[:checked]:bg-green-50"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className="accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}