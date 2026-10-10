import { User, Sprout, Sparkle, ChartNoAxesCombined, House,} from "lucide-react";
import Logo from "../../assets/images/logo.png";

export default function SideBar() {
  return (
    <>
    <aside className="w-80 h-screen bg-surface flex flex-col border border-r-2 border-gray-300 px-4 py-20 gap-10">
      <div className="flex items-center gap-2 px-4">
        <img
          src={Logo}
          alt="logo nutriva"
          className="w-auto h-20 object-cover"
        />
        <h1 className="text-primary font-bold text-3xl">Nutriva</h1>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-start bg-soft h-auto p-4 rounded-xl gap-4 duration-300">
        <House size={20} strokeWidth={3} className="text-primary"/>
        <a className="text-primary font-medium">Beranda</a>
        </div>
        <div className="flex items-center justify-start h-auto p-4 rounded-xl gap-4 hover:bg-soft hover:text-primary transition-all duration-300">
        <Sprout size={20} className="text-gray-500"/>
        <a className="text-gray-500 font-medium">Nutrisi</a>
        </div>
        <div className="flex items-center justify-start h-auto p-4 rounded-xl gap-4 hover:bg-soft transition-all duration-300">
        <ChartNoAxesCombined size={20} className="text-gray-500"/>
        <a className="text-gray-500 font-medium">Pertumbuhan</a>
        </div>
        <div className="flex items-center justify-start h-auto p-4 rounded-xl gap-4 hover:bg-soft transition-all duration-300">
        <Sparkle size={20} className="text-gray-500"/>
        <a className="text-gray-500 font-medium">Asisten AI</a>
        </div>
        <div className="flex items-center justify-start h-auto p-4 rounded-xl gap-4 hover:bg-soft transition-all duration-300">
        <User size={20} className="text-gray-500"/>
        <a className="text-gray-500 font-medium">Profil</a>
        </div>
      </div>
      <div>

      </div>
    </aside>
    </>
  );
}
