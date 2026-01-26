"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, ShoppingCart, Users, DollarSign, Filter } from "lucide-react";
import { SalesMetricData } from "@/lib/types";
import SalesForm from "./sales-form";
import SalesCharts from "./sales-charts";
import SalesTable from "./sales-table";

interface DashboardClientProps {
  userId: string;
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const [metrics, setMetrics] = useState<SalesMetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMetric, setEditingMetric] = useState<SalesMetricData | null>(null);
  const [filter, setFilter] = useState("30");

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`/api/metrics?days=${filter}`);
      const data = await res.json();
      setMetrics(data?.metrics ?? []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [filter]);

  const handleSave = () => {
    setShowForm(false);
    setEditingMetric(null);
    fetchMetrics();
  };

  const handleEdit = (metric: SalesMetricData) => {
    setEditingMetric(metric);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/metrics/${id}`, { method: "DELETE" });
      fetchMetrics();
    } catch (error) {
      console.error("Error deleting metric:", error);
    }
  };

  const totalSales = metrics?.reduce?.((sum, m) => sum + (m?.totalSales ?? 0), 0) ?? 0;
  const totalOrders = metrics?.reduce?.((sum, m) => sum + (m?.orderCount ?? 0), 0) ?? 0;
  const totalNewCustomers = metrics?.reduce?.((sum, m) => sum + (m?.newCustomers ?? 0), 0) ?? 0;
  const avgBasket = totalOrders > 0 ? totalSales / totalOrders : 0;

  const summaryCards = [
    { label: "Toplam Satış", value: `₺${totalSales?.toLocaleString?.('tr-TR') ?? '0'}`, icon: DollarSign, color: "blue" },
    { label: "Sipariş Adedi", value: totalOrders?.toLocaleString?.('tr-TR') ?? '0', icon: ShoppingCart, color: "green" },
    { label: "Yeni Müşteri", value: totalNewCustomers?.toLocaleString?.('tr-TR') ?? '0', icon: Users, color: "cyan" },
    { label: "Ort. Sepet", value: `₺${avgBasket?.toFixed?.(2)?.replace?.('.', ',') ?? '0'}`, icon: TrendingUp, color: "orange" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Satış Metrikleri</h2>
          <p className="text-sm text-gray-400">Satış performansınızı takip edin</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] rounded-lg">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white"
            >
              <option value="7">Son 7 gün</option>
              <option value="30">Son 30 gün</option>
              <option value="90">Son 90 gün</option>
              <option value="365">Son 1 yıl</option>
            </select>
          </div>
          <button
            onClick={() => { setEditingMetric(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Veri Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards?.map?.((card, i) => {
          const Icon = card?.icon;
          const colorClass = card?.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                            card?.color === 'green' ? 'bg-green-500/10 text-green-500' :
                            card?.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                            'bg-orange-500/10 text-orange-500';
          return (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorClass?.split?.(' ')?.[0] ?? ''}`}>
                  {Icon && <Icon className={`w-5 h-5 ${colorClass?.split?.(' ')?.[1] ?? ''}`} />}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{card?.label}</p>
                  <p className="text-lg font-semibold text-white">{card?.value}</p>
                </div>
              </div>
            </div>
          );
        }) ?? []}
      </div>

      <SalesCharts metrics={metrics ?? []} />

      <SalesTable 
        metrics={metrics ?? []} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {showForm && (
        <SalesForm
          metric={editingMetric}
          onClose={() => { setShowForm(false); setEditingMetric(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
