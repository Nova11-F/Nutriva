import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/images/logo.png";
import Button from "../ui/Button";

const menus = [
  { name: "Beranda", id: "beranda" },
  { name: "Fitur", id: "fitur" },
  { name: "Cara Kerja", id: "cara-kerja" },
  { name: "Tentang Nutriva", id: "tentang" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("beranda");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = (event) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const handleMenuClick = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveMenu(id);
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300 bg-surface">
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 lg:px-10 lg:py-4">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <img
            src={Logo}
            alt="Logo Nutriva"
            className="h-12 w-auto object-contain lg:h-20"
          />
          <h1 className="text-2xl font-bold text-primary lg:text-3xl">
            Nutriva
          </h1>
        </div>

        <div className="hidden items-center justify-center gap-8 lg:flex xl:gap-14">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              onClick={() => handleMenuClick(menu.id)}
              aria-current={
                activeMenu === menu.id ? "location" : undefined
              }
              className={`cursor-pointer whitespace-nowrap text-lg transition-colors duration-300 ${
                activeMenu === menu.id
                  ? "font-bold text-text"
                  : "font-medium text-gray-500 hover:text-text"
              }`}
            >
              {menu.name}
            </button>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <Button
            variant="outline"
            size="md"
            onClick={handleLogin}
          >
            Masuk
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleLogin}
          >
            Mulai Sekarang
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="flex items-center justify-center rounded-lg p-2 text-text transition-colors hover:bg-soft lg:hidden"
        >
          {isMenuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-gray-200 bg-surface transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen
            ? "max-h-[420px] opacity-100"
            : "pointer-events-none max-h-0 border-t-0 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col gap-1 px-5 py-4 sm:px-8">
          {menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={() => handleMenuClick(menu.id)}
              aria-current={
                activeMenu === menu.id ? "location" : undefined
              }
              className={`w-full rounded-lg px-4 py-3 text-left text-base transition-colors duration-200 ${
                activeMenu === menu.id
                  ? "bg-soft font-bold text-primary"
                  : "font-medium text-gray-600 hover:bg-soft hover:text-primary"
              }`}
            >
              {menu.name}
            </button>
          ))}

          <div className="mt-3 flex flex-col gap-3 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleLogin}
            >
              Masuk
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
            >
              Mulai Sekarang
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}