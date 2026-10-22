import CurrentDate from "../ui/Date";
import NotificationItems from "../ui/NotificationItems";
import { useChild } from "../../hooks/useChild";

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
}){
    const {
      childList,
      loading: childLoading,
    } = useChild();

  return (
    <div
      className={`flex items-center justify-between px-4 md:px-6 mb-4 ${className}`}
      {...props}
    >
      <div className="flex gap-2 items-center lg:gap-4">
        <h1 className="text-xl font-bold text-text md:text-3xl">
          {titles[variant] || titles.default}
        </h1>
        {!childLoading && childList.length === 0 && (
        <div className="inline-flex items-center gap-2 bg-yellow-50 text-warning border border-warning px-3 py-1 rounded-xl text-xs lg:text-md font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
          Belum mendaftarkan Profil Anak
        </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        <CurrentDate />
        <NotificationItems />
      </div>
    </div>
  );
}
