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
              <Calendar size={20} strokeWidth={3} className="text-secondary"/>
              <p className="text-gray-700 text-md">{tanggal}</p>
            </div>
  );
}
