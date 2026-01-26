"use client";

import { useState } from "react";
import { X, Loader2, User, Lock, Building, UserCircle } from "lucide-react";
import { ClientData } from "@/lib/types";

interface ClientFormProps {
  client?: ClientData | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ClientForm({ client, onClose, onSave }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: client?.username ?? "",
    password: "",
    firstName: client?.firstName ?? "",
    lastName: client?.lastName ?? "",
    companyName: client?.companyName ?? ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = client?.id ? `/api/clients/${client.id}` : "/api/clients";
      const method = client?.id ? "PUT" : "POST";

      const payload: any = {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        companyName: formData?.companyName
      };

      if (!client?.id) {
        payload.username = formData?.username;
        payload.password = formData?.password;
      } else if (formData?.password) {
        payload.password = formData?.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
            {client ? "Müşteri Düzenle" : "Yeni Müşteri"}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Ad</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData?.firstName ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), firstName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Soyad</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData?.lastName ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), lastName: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Firma Adı</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={formData?.companyName ?? ""}
                onChange={(e) => setFormData({ ...(formData ?? {}), companyName: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
              />
            </div>
          </div>

          {!client && (
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={formData?.username ?? ""}
                  onChange={(e) => setFormData({ ...(formData ?? {}), username: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              {client ? "Şifre (boş bırakırsanız değişmez)" : "Şifre"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={formData?.password ?? ""}
                onChange={(e) => setFormData({ ...(formData ?? {}), password: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                required={!client}
              />
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
