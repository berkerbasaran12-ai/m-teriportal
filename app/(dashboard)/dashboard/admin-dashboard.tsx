"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, FolderOpen, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalClients: number;
  activeClients: number;
  totalContents: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res?.json?.();
        setStats(data ?? null);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const cards = [
    { label: "Toplam Müşteri", value: stats?.totalClients ?? 0, icon: Users, color: "blue", href: "/admin/musteriler" },
    { label: "Aktif Müşteri", value: stats?.activeClients ?? 0, icon: TrendingUp, color: "green", href: "/admin/musteriler" },
    { label: "Bilgi Bankası İçerikleri", value: stats?.totalContents ?? 0, icon: BookOpen, color: "cyan", href: "/admin/bilgi-bankasi" },
    { label: "Kategoriler", value: stats?.totalCategories ?? 0, icon: FolderOpen, color: "orange", href: "/admin/kategoriler" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Portal yönetim özeti</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards?.map?.((card, i) => {
          const Icon = card?.icon;
          const colorClass = card?.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                            card?.color === 'green' ? 'bg-green-500/10 text-green-500' :
                            card?.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                            'bg-orange-500/10 text-orange-500';
          return (
            <Link key={i} href={card?.href ?? "#"} className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClass?.split?.(' ')?.[0] ?? ''}`}>
                  {Icon && <Icon className={`w-5 h-5 ${colorClass?.split?.(' ')?.[1] ?? ''}`} />}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{card?.label}</p>
                  <p className="text-2xl font-semibold text-white">{card?.value}</p>
                </div>
              </div>
            </Link>
          );
        }) ?? []}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-medium text-white mb-4">Hızlı İşlemler</h3>
          <div className="space-y-3">
            <Link
              href="/admin/musteriler?action=new"
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-white">Yeni Müşteri Ekle</span>
            </Link>
            <Link
              href="/admin/bilgi-bankasi?action=new"
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-cyan-500" />
              <span className="text-white">Yeni İçerik Ekle</span>
            </Link>
            <Link
              href="/admin/kategoriler?action=new"
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-orange-500" />
              <span className="text-white">Yeni Kategori Ekle</span>
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-medium text-white mb-4">Portal Bilgisi</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Portal Adı</span>
              <span className="text-white">Havana Dijital</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Versiyon</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Durum</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
