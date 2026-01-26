"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, UserCheck, UserX, Loader2 } from "lucide-react";
import { ClientData } from "@/lib/types";
import ClientForm from "./client-form";
import ClientDetail from "./client-detail";

export default function MusterilerPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [viewingClient, setViewingClient] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?search=${search}`);
      const data = await res?.json?.();
      setClients(data?.clients ?? []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = () => {
    setShowForm(false);
    setEditingClient(null);
    fetchClients();
  };

  const handleToggleActive = async (client: ClientData) => {
    try {
      await fetch(`/api/clients/${client?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, isActive: !client?.isActive })
      });
      fetchClients();
    } catch (error) {
      console.error("Error toggling client:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu müşteriyi silmek istediğinize emin misiniz? Tüm verileri silinecek.")) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Müşteri Yönetimi</h2>
          <p className="text-sm text-gray-400">Müşterilerinizi yönetin</p>
        </div>
        <button
          onClick={() => { setEditingClient(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Müşteri
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] rounded-lg">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Müşteri ara..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (clients?.length ?? 0) === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-gray-400">Henüz müşteri bulunmuyor.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Müşteri</th>
                  <th className="px-4 py-3 font-medium">Firma</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı Adı</th>
                  <th className="px-4 py-3 font-medium">Veri Sayısı</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {clients?.map?.((client) => (
                  <tr key={client?.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white">{client?.firstName} {client?.lastName}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {client?.companyName ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{client?.username}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      {client?._count?.salesMetrics ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client?.isActive 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {client?.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingClient(client?.id ?? null)}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          title="Detay"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => { setEditingClient(client); setShowForm(true); }}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(client)}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          title={client?.isActive ? "Pasif Yap" : "Aktif Yap"}
                        >
                          {client?.isActive ? (
                            <UserX className="w-4 h-4 text-orange-400" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(client?.id ?? "")}
                          className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                          title="Sil"
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
      )}

      {showForm && (
        <ClientForm
          client={editingClient}
          onClose={() => { setShowForm(false); setEditingClient(null); }}
          onSave={handleSave}
        />
      )}

      {viewingClient && (
        <ClientDetail
          clientId={viewingClient}
          onClose={() => setViewingClient(null)}
        />
      )}
    </div>
  );
}
