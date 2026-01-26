"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { UserSession } from "@/lib/types";

interface HeaderProps {
  user: UserSession;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname?.startsWith?.("/admin/musteriler")) return "Müşteri Yönetimi";
    if (pathname?.startsWith?.("/admin/bilgi-bankasi")) return "Bilgi Bankası Yönetimi";
    if (pathname?.startsWith?.("/admin/kategoriler")) return "Kategori Yönetimi";
    if (pathname?.startsWith?.("/bilgi-bankasi")) return "Bilgi Bankası";
    return "Portal";
  };

  return (
    <header className="glass sticky top-0 z-30 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="md:hidden w-10" />
        <h1 className="text-lg md:text-xl font-semibold text-white">{getPageTitle()}</h1>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Ara..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-40"
            />
          </div>
          <button className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
