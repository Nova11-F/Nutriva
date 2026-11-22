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
      className={`px-4 mb-4 flex flex-col gap-2 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between ">
      <div className="flex flex-col gap-2 lg:gap-4">
        <h1 className="text-xl font-bold text-text lg:text-2xl">
          {titles[variant] || titles.default}
        </h1>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        <CurrentDate />
        <NotificationItems />
      </div>
    </div>
            {!childLoading && childList.length === 0 && (
        <div className="w-fit inline-flex items-center gap-1 md:gap-2 bg-yellow-50 text-warning border border-warning px-2 py-1 rounded-md text-[10px] md:text-xs font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
          Belum mendaftarkan Profil Anak
        </div>
        )}
        </div>
  );
}
