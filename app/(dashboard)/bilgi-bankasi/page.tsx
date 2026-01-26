"use client";

import { useState, useEffect } from "react";
import { Search, Video, FileText, Link as LinkIcon, Loader2, FolderOpen } from "lucide-react";
import Link from "next/link";
import { ContentData, CategoryData } from "@/lib/types";

export default function BilgiBankasiPage() {
  const [contents, setContents] = useState<ContentData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
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

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="w-5 h-5 text-blue-400" />;
      case "PDF": return <FileText className="w-5 h-5 text-red-400" />;
      case "LINK": return <LinkIcon className="w-5 h-5 text-green-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-semibold text-white">Bilgi Bankası</h2>
        <p className="text-sm text-gray-400">Eğitim içerikleri ve kaynaklar</p>
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
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedCategory
              ? "bg-blue-500 text-white"
              : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]"
          }`}
        >
          Tümü
        </button>
        {categories?.map?.((cat) => (
          <button
            key={cat?.id}
            onClick={() => setSelectedCategory(cat?.id ?? "")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedCategory === cat?.id
                ? "bg-blue-500 text-white"
                : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]"
            }`}
          >
            <span>{cat?.icon}</span>
            <span>{cat?.name}</span>
          </button>
        )) ?? []}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (contents?.length ?? 0) === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Bu kategoride henüz içerik bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents?.map?.((content) => (
            <Link
              key={content?.id}
              href={`/bilgi-bankasi/${content?.id}`}
              className="glass-card rounded-xl p-5 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-white/5">
                  {getTypeIcon(content?.type ?? "")}
                </div>
                <span className="text-xs text-gray-500">
                  {content?.category?.icon} {content?.category?.name}
                </span>
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                {content?.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ 
                __html: content?.description?.replace?.(/<[^>]*>/g, '')?.slice?.(0, 100) ?? '' 
              }} />
            </Link>
          )) ?? []}
        </div>
      )}
    </div>
  );
}
