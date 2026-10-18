import { BellRing } from "lucide-react";
import CurrentDate from "../ui/Date";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function Header({
  variant = "default",
  className = "",
  userName = "",
  ...props
}) {
  const titles = {
    default: "Dashboard",
    profil: "Profil",
    nutrisi: "Nutrisi",
    pertumbuhan: "Growth",
    ai: "AI Nutriva",
    pengaturan: "Pengaturan",
  };

 const greeting = getGreeting();

  const title =
    variant === "greeting"
      ? userName
        ? `${greeting}, ${userName}!`
        : `${greeting}!`
      : titles[variant] || titles.default;

  return (
    <div
      className={`flex items-center justify-between px-4 md:px-6 mb-4 ${className}`}
      {...props}
    >
      <h1 className="text-xl  text-text font-bold md:text-3xl">{title}</h1>

      <div className="flex items-center gap-1.5 md:gap-2">
        <CurrentDate />
        <div className="border border-gray-300 rounded-md md:rounded-lg py-1.5 px-2 md:py-2.5 md:px-3">
          <BellRing className="size-4 text-gray-500 md:size-5" />
        </div>
      </div>
    </div>
  );
}
