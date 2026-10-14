import { Calendar } from "lucide-react"; 

export default function CurrentDate() {
  const tanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return(
            <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-300 rounded-lg">
              <Calendar strokeWidth={2} className="size-4 text-secondary md:size-6"/>
              <p className="text-xs text-gray-700 md:text-lg">{tanggal}</p>
            </div>
  );
}
