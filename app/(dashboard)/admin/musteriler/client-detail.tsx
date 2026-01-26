"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Building, Calendar, TrendingUp } from "lucide-react";

interface ClientDetailProps {
  clientId: string;
  onClose: () => void;
}

export default function ClientDetail({ clientId, onClose }: ClientDetailProps) {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        const data = await res?.json?.();
        setClient(data?.client ?? null);
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const totalSales = client?.salesMetrics?.reduce?.((sum: number, m: any) => sum + (m?.totalSales ?? 0), 0) ?? 0;
  const totalOrders = client?.salesMetrics?.reduce?.((sum: number, m: any) => sum + (m?.orderCount ?? 0), 0) ?? 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Müşteri Detayı</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : client ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">
                  {client?.firstName} {client?.lastName}
                </h4>
                <p className="text-gray-400">@{client?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Firma</span>
                </div>
                <p className="text-white">{client?.companyName ?? "-"}</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Kayıt Tarihi</span>
                </div>
                <p className="text-white">
                  {new Date(client?.createdAt ?? 0).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Toplam Satış</span>
                </div>
                <p className="text-white">₺{totalSales?.toLocaleString?.('tr-TR') ?? '0'}</p>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Toplam Sipariş</span>
                </div>
                <p className="text-white">{totalOrders?.toLocaleString?.('tr-TR') ?? '0'}</p>
              </div>
            </div>

            {(client?.salesMetrics?.length ?? 0) > 0 && (
              <div>
                <h5 className="font-medium text-white mb-3">Son Satış Verileri</h5>
                <div className="glass-card rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 border-b border-white/5">
                        <th className="px-4 py-2">Tarih</th>
                        <th className="px-4 py-2">Satış</th>
                        <th className="px-4 py-2">Sipariş</th>
                        <th className="px-4 py-2">Kar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {client?.salesMetrics?.slice?.(0, 10)?.map?.((m: any) => (
                        <tr key={m?.id} className="border-b border-white/5 text-sm">
                          <td className="px-4 py-2 text-white">
                            {new Date(m?.date ?? 0).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-2 text-white">
                            ₺{m?.totalSales?.toLocaleString?.('tr-TR') ?? '0'}
                          </td>
                          <td className="px-4 py-2 text-white">{m?.orderCount ?? 0}</td>
                          <td className="px-4 py-2 text-green-400">
                            ₺{m?.netProfit?.toLocaleString?.('tr-TR') ?? '0'}
                          </td>
                        </tr>
                      )) ?? []}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            Müşteri bulunamadı
          </div>
        )}
      </div>
    </div>
  );
}
