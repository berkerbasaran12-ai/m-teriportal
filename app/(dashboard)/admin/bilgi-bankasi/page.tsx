"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Video, FileText, Link as LinkIcon, Loader2 } from "lucide-react";
import { ContentData, CategoryData } from "@/lib/types";
import ContentForm from "./content-form";

export default function BilgiBankasiAdminPage() {
  const [contents, setContents] = useState<ContentData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentData | null>(null);

  const fetchData = async () => {
    try {
      const [contentsRes, categoriesRes] = await Promise.all([
        fetch(`/api/contents?search=${search}&categoryId=${selectedCategory}`),
        fetch("/api/categories")
      ]);
      const contentsData = await contentsRes?.json?.();
      const categoriesData = await categoriesRes?.json?.();
      setContents(contentsData?.contents ?? []);
      setCategories(categoriesData?.categories ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const handleSave = () => {
    setShowForm(false);
    setEditingContent(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/contents/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="w-4 h-4" />;
      case "PDF": return <FileText className="w-4 h-4" />;
      case "LINK": return <LinkIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Bilgi Bankası Yönetimi</h2>
          <p className="text-sm text-gray-400">İçerikleri yönetin</p>
        </div>
        <button
          onClick={() => { setEditingContent(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni İçerik
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-[#2a2a2a] rounded-lg">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İçerik ara..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-[#2a2a2a] rounded-lg border-none outline-none text-white"
        >
          <option value="">Tüm Kategoriler</option>
          {categories?.map?.((cat) => (
            <option key={cat?.id} value={cat?.id}>{cat?.icon} {cat?.name}</option>
          )) ?? []}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (contents?.length ?? 0) === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-gray-400">Henüz içerik bulunmuyor.</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-white/5">
                  <th className="px-4 py-3 font-medium">Başlık</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Tip</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {contents?.map?.((content) => (
                  <tr key={content?.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white">{content?.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {content?.category?.icon} {content?.category?.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {getTypeIcon(content?.type ?? "")}
                        <span>{content?.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content?.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {content?.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingContent(content); setShowForm(true); }}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(content?.id ?? "")}
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
      )}

      {showForm && (
        <ContentForm
          content={editingContent}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingContent(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
