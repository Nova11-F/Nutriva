import { House, Sprout, ChartNoAxesCombined, Sparkle, User } from "lucide-react";

export const navItems = [
  { label: "Beranda", path: "/home", icon: House },
  { label: "Nutrisi", path: "/nutrition", icon: Sprout },
  { label: "Pertumbuhan", path: "/growth", icon: ChartNoAxesCombined },
  { label: "Asisten AI", shortLabel: "AI", path: "/assistant", icon: Sparkle },
  { label: "Profil", path: "/profile", icon: User },
];