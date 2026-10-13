import { BellRing } from "lucide-react";
import CurrentDate from "../ui/Date";

export default function Header({
  variant = "default",
  className = "",
  ...props
}) {
  const titles = {
    default: "Dashboard",
    profil: "Profil",
    nutrisi: "Nutrisi",
    pertumbuhan: "Pertumbuhan",
    ai: "AI Nutriva",
    pengaturan: "Pengaturan",
  };

  const title = titles[variant] || titles.default;

  return (
    <div
      className={`flex items-center justify-between px-6 mb-4 ${className}`}
      {...props}
    >
      <h1 className="text-4xl text-text font-bold">
        {title}
      </h1>

        <div className="flex items-center gap-2">
      <CurrentDate />
        <div className="border border-gray-300 rounded-lg py-2 px-4">
            <BellRing size={20} className="text-gray-500"/>
        </div>
      </div>
    </div>
  );
}
