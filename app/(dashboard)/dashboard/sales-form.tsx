"use client";

import { useState } from "react";
import { X, Loader2, Calendar, DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { SalesMetricData } from "@/lib/types";

interface SalesFormProps {
  metric?: SalesMetricData | null;
  onClose: () => void;
  onSave: () => void;
}

export default function SalesForm({ metric, onClose, onSave }: SalesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: metric?.date?.split?.('T')?.[0] ?? new Date().toISOString().split('T')[0],
    totalSales: metric?.totalSales?.toString?.() ?? "",
    orderCount: metric?.orderCount?.toString?.() ?? "",
    newCustomers: metric?.newCustomers?.toString?.() ?? "",
    repeatCustomers: metric?.repeatCustomers?.toString?.() ?? "",
    netProfit: metric?.netProfit?.toString?.() ?? ""
  });

  const avgBasket = formData?.totalSales && formData?.orderCount
    ? (parseFloat(formData.totalSales) / parseInt(formData.orderCount)).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = metric?.id ? `/api/metrics/${metric.id}` : "/api/metrics";
      const method = metric?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData?.date,
          totalSales: parseFloat(formData?.totalSales ?? "0"),
          orderCount: parseInt(formData?.orderCount ?? "0"),
          newCustomers: parseInt(formData?.newCustomers ?? "0"),
          repeatCustomers: parseInt(formData?.repeatCustomers ?? "0"),
          netProfit: parseFloat(formData?.netProfit ?? "0")
        })
      });

      if (!res?.ok) {
        const data = await res?.json?.();
        throw new Error(data?.error ?? "Bir hata oluştu");
      }

      onSave();
    } catch (err: any) {
      setError(err?.message ?? "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {metric ? "Veri Düzenle" : "Yeni Satış Verisi"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Tarih</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={formData?.date ?? ""}
                onChange={(e) => setFormData({ ...(formData ?? {}), date: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Toplam Satış (₺)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  step="0.01"
                  value={formData?.totalSales ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), totalSales: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Sipariş Adedi</label>
              <div className="relative">
                <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={formData?.orderCount ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), orderCount: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Yeni Müşteri</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={formData?.newCustomers ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), newCustomers: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Tekrar Eden Müşteri</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={formData?.repeatCustomers ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), repeatCustomers: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Net Kar (₺)</label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="number"
                step="0.01"
                value={formData?.netProfit ?? ""}
                onChange={(e) => setFormData({ ...(formData ?? {}), netProfit: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                required
              />
            </div>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Ortalama Sepet Değeri</span>
              <span className="text-lg font-semibold text-blue-400">₺{avgBasket}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg font-medium text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
