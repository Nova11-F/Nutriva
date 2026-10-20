import CurrentDate from "../ui/Date";
import NotificationItems from "../ui/NotificationItems";

const titles = {
  default: "Dashboard",
  profil: "Profil",
  nutrisi: "Nutrisi",
  pertumbuhan: "Growth",
  ai: "AI Nutriva",
  pengaturan: "Pengaturan",
};

export default function Header({
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 md:px-6 mb-4 ${className}`}
      {...props}
    >
      <h1 className="text-xl font-bold text-text md:text-3xl">
        {titles[variant] || titles.default}
      </h1>

      <div className="flex items-center gap-1.5 md:gap-2">
        <CurrentDate />
        <NotificationItems />
      </div>
    </div>
  );
}