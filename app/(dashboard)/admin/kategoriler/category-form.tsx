"use client";

import { useState } from "react";
import { X, Loader2, Tag, Smile } from "lucide-react";
import { CategoryData } from "@/lib/types";

interface CategoryFormProps {
  category?: CategoryData | null;
  onClose: () => void;
  onSave: () => void;
}

const iconOptions = ["📊", "💰", "📈", "🎯", "⚙️", "📝", "💡", "🚀", "🌟", "🔥", "💎", "🌈"];

export default function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: category?.name ?? "",
    icon: category?.icon ?? "📊"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = category?.id ? `/api/categories/${category.id}` : "/api/categories";
      const method = category?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
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
      <div className="glass rounded-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {category ? "Kategori Düzenle" : "Yeni Kategori"}
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
            <label className="text-sm text-gray-400">Kategori Adı</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={formData?.name ?? ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                placeholder="Kategori adı"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Ikon</label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions?.map?.((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-3 rounded-lg text-xl transition-colors ${formData?.icon === icon
                      ? "bg-blue-500/20 border border-blue-500"
                      : "bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-white/10"
                    }`}
                >
                  {icon}
                </button>
              )) ?? []}
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
