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
      <h1 className="text-2xl  text-text font-bold md:text-4xl">
        {title}
      </h1>

        <div className="flex items-center gap-2 md:gap-4">
      <CurrentDate />
        <div className="border border-gray-300 rounded-lg py-2 px-3">
            <BellRing className="size-4 text-gray-500 md:size-6"/>
        </div>
      </div>
    </div>
  );
}
