import { Calendar } from "lucide-react";

export default function CurrentDate() {
  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-surface border border-gray-300 rounded-md lg:px-4 lg:py-2">
      <Calendar strokeWidth={2} className="size-4 text-gray-500 lg:size-5" />
      <p className="text-xs text-gray-700 lg:text-sm lg:font-semibold">
        {tanggal}
      </p>
    </div>
  );
}
