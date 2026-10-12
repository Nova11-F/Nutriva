import { Loader2 } from "lucide-react";

const sizes = {
  sm: 16,
  md: 24,
  lg: 40,
};

export default function Spinner({
  size = "md",
  label,           
  center = false,  
  className = "",
}) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center gap-2 text-primary ${className}`}
    >
      <Loader2 size={sizes[size]} className="animate-spin" />
      {label ? (
        <span className="text-sm text-gray-500">{label}</span>
      ) : (
        <span className="sr-only">Memuat</span>
      )}
    </div>
  );

  if (center) {
    return <div className="flex min-h-[40vh] items-center justify-center">{content}</div>;
  }
  return content;
}