import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import Button from "../ui/Button";

const menus = [
  { name: "Beranda", id: "beranda" },
  { name: "Fitur", id: "fitur" },
  { name: "Cara Kerja", id: "cara-kerja" },
  { name: "Tentang Nutriva", id: "tentang" },
];

export default function navbar() {
const navigate = useNavigate();
const [activeMenu, setActiveMenu] = useState("beranda");

  useEffect(() => {
    const sections = menus
      .map((menu) => document.getElementById(menu.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveMenu(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleMenuClick = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="w-full sticky top-0 z-50 flex items-center justify-between bg-surface border-b border-gray-300 px-10 py-4">
      <div className="flex items-center gap-2">
        <img
          src={Logo}
          alt="logo nutriva"
          className="w-auto h-20 object-cover"
        />
        <h1 className="text-primary font-bold text-3xl">Nutriva</h1>
      </div>
      <div className="flex items-center justify-center gap-14">
        {menus.map((menu) => (
          <button
            key={menu.id}
            type="button"
            onClick={() => handleMenuClick(menu.id)}
            aria-current={
              activeMenu === menu.id ? "location" : undefined
            }
            className={`text-lg cursor-pointer transition-colors duration-300 ${
              activeMenu === menu.id
                ? "font-bold text-text"
                : "font-medium text-gray-500 hover:text-text"
            }`}
          >
            {menu.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="md" onClick={() => navigate("/login")}>
          Masuk
        </Button>
        <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
          Mulai Sekarang
        </Button>
      </div>
    </nav>
  );
}
