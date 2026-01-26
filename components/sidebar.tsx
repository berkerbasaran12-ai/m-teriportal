"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings
} from "lucide-react";
import { UserSession } from "@/lib/types";

interface SidebarProps {
  user: UserSession;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const clientLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bilgi-bankasi", label: "Bilgi Bankası", icon: BookOpen },
    { href: "/ayarlar", label: "Ayarlar", icon: Settings }
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/musteriler", label: "Müşteriler", icon: Users },
    { href: "/admin/bilgi-bankasi", label: "Bilgi Bankası", icon: BookOpen },
    { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderOpen },
    { href: "/ayarlar", label: "Ayarlar", icon: Settings }
  ];

  const links = isAdmin ? adminLinks : clientLinks;

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center overflow-hidden border border-blue-500/20 group-hover:border-blue-500/50 transition-all">
            <div className="absolute inset-0 bg-blue-500 opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-6 h-6 object-contain z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-lg font-bold text-blue-500 z-10">H</span>';
              }}
            />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">Havana Dijital</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Müşteri Portalı</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links?.map((link) => {
          const Icon = link?.icon;
          const isActive = pathname === link?.href ||
            (link?.href !== "/dashboard" && pathname?.startsWith?.(link?.href ?? ""));

          return (
            <Link
              key={link?.href}
              href={link?.href ?? "#"}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${isActive
                ? "bg-blue-500/10 text-blue-500"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className="flex-1">{link?.label}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-4 py-3 mb-4">
          <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-500">{user?.companyName ?? (isAdmin ? "Admin" : "Müşteri")}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] z-50 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col h-full">
          <NavContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] border-r border-white/10 flex-col">
        <NavContent />
      </div>
    </>
  );
}
