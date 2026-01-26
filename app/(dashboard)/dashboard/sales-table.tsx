"use client";

import { Edit2, Trash2, Loader2 } from "lucide-react";
import { SalesMetricData } from "@/lib/types";

interface SalesTableProps {
  metrics: SalesMetricData[];
  loading: boolean;
  onEdit: (metric: SalesMetricData) => void;
  onDelete: (id: string) => void;
}

export default function SalesTable({ metrics, loading, onEdit, onDelete }: SalesTableProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if ((metrics?.length ?? 0) === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-medium text-white">Geçmiş Veriler</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-white/5">
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Satış</th>
              <th className="px-4 py-3 font-medium">Sipariş</th>
              <th className="px-4 py-3 font-medium">Yeni Müş.</th>
              <th className="px-4 py-3 font-medium">Tekrar Müş.</th>
              <th className="px-4 py-3 font-medium">Net Kar</th>
              <th className="px-4 py-3 font-medium">Ort. Sepet</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {metrics?.map?.((m) => (
              <tr key={m?.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-sm text-white">
                  {new Date(m?.date ?? 0).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-4 py-3 text-sm text-white">
                  ₺{m?.totalSales?.toLocaleString?.('tr-TR') ?? '0'}
                </td>
                <td className="px-4 py-3 text-sm text-white">{m?.orderCount ?? 0}</td>
                <td className="px-4 py-3 text-sm text-white">{m?.newCustomers ?? 0}</td>
                <td className="px-4 py-3 text-sm text-white">{m?.repeatCustomers ?? 0}</td>
                <td className="px-4 py-3 text-sm text-green-400">
                  ₺{m?.netProfit?.toLocaleString?.('tr-TR') ?? '0'}
                </td>
                <td className="px-4 py-3 text-sm text-blue-400">
                  ₺{m?.avgBasketValue?.toFixed?.(2)?.replace?.('.', ',') ?? '0'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(m)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => onDelete(m?.id ?? "")}
                      className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            )) ?? []}
          </tbody>
        </table>
      </div>
    </div>
  );
}
