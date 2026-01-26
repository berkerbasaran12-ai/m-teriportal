"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, GripVertical } from "lucide-react";
import { CategoryData } from "@/lib/types";
import CategoryForm from "./category-form";

export default function KategorilerPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res?.json?.();
      setCategories(data?.categories ?? []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Tüm içerikleri de silinecek.")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Kategori Yönetimi</h2>
          <p className="text-sm text-gray-400">Bilgi bankası kategorilerini yönetin</p>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kategori
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (categories?.length ?? 0) === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-gray-400">Henüz kategori bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map?.((category) => (
            <div key={category?.id} className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">
                    {category?.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{category?.name}</h3>
                    <p className="text-xs text-gray-500">
                      {category?._count?.contents ?? 0} içerik
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setEditingCategory(category); setShowForm(true); }}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(category?.id ?? "")}
                    className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          )) ?? []}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => { setShowForm(false); setEditingCategory(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
