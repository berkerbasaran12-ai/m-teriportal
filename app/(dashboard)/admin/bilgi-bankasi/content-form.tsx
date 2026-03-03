"use client";

import { useState, useCallback } from "react";
import { X, Loader2, FileText, Video, Link as LinkIcon, Upload } from "lucide-react";
import { ContentData, CategoryData } from "@/lib/types";
import RichTextEditor from "@/components/rich-text-editor";

interface ContentFormProps {
  content?: ContentData | null;
  categories: CategoryData[];
  onClose: () => void;
  onSave: () => void;
}

export default function ContentForm({ content, categories, onClose, onSave }: ContentFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: content?.title ?? "",
    description: content?.description ?? "",
    type: content?.type ?? "VIDEO",
    url: content?.url ?? "",
    fileUrl: content?.fileUrl ?? "",
    isPublic: content?.isPublic ?? false,
    status: content?.status ?? "DRAFT",
    categoryId: content?.categoryId ?? (categories?.[0]?.id ?? "")
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true
        })
      });

      const presignedData = await presignedRes?.json?.();
      if (!presignedRes?.ok) throw new Error(presignedData?.error);

      const { uploadUrl, cloud_storage_path } = presignedData ?? {};

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": "attachment"
        }
      });

      if (!uploadRes?.ok) throw new Error("Dosya yüklenemedi");

      setFormData(prev => ({ ...prev, fileUrl: cloud_storage_path, isPublic: true }));
    } catch (err: any) {
      setError(err?.message ?? "Dosya yüklenirken hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = content?.id ? `/api/contents/${content.id}` : "/api/contents";
      const method = content?.id ? "PUT" : "POST";

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
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {content ? "İçerik Düzenle" : "Yeni İçerik"}
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
            <label className="text-sm text-gray-400">Başlık</label>
            <input
              type="text"
              value={formData?.title ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Kategori</label>
              <select
                value={formData?.categoryId ?? ""}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                required
              >
                {categories?.map?.((cat) => (
                  <option key={cat?.id} value={cat?.id}>{cat?.icon} {cat?.name}</option>
                )) ?? []}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">İçerik Tipi</label>
              <div className="flex gap-2">
                {["VIDEO", "PDF", "LINK"]?.map?.((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type as any }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg transition-colors ${formData?.type === type
                      ? "bg-blue-500/20 border border-blue-500 text-blue-400"
                      : "bg-[#2a2a2a] border border-white/10 text-gray-400 hover:bg-[#3a3a3a]"
                      }`}
                  >
                    {type === "VIDEO" && <Video className="w-4 h-4" />}
                    {type === "PDF" && <FileText className="w-4 h-4" />}
                    {type === "LINK" && <LinkIcon className="w-4 h-4" />}
                    <span className="text-sm">{type}</span>
                  </button>
                )) ?? []}
              </div>
            </div>
          </div>

          {formData?.type === "PDF" ? (
            <div className="space-y-2">
              <label className="text-sm text-gray-400">PDF Dosyası</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                {formData?.fileUrl ? (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <FileText className="w-5 h-5" />
                    <span>Dosya yüklendi</span>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-500" />
                          <span className="text-gray-400">PDF dosyası yüklemek için tıklayın</span>
                        </>
                      )}
                    </label>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {formData?.type === "VIDEO" ? "Video URL (YouTube/Vimeo)" : "Harici Link"}
              </label>
              <input
                type="url"
                value={formData?.url ?? ""}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-4 py-3 bg-[#2a2a2a] rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none text-white"
                placeholder={formData?.type === "VIDEO" ? "https://youtube.com/watch?v=..." : "https://..."}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Açıklama</label>
            <RichTextEditor
              content={formData?.description ?? ""}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="status"
                checked={formData?.status === "PUBLISHED"}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? "PUBLISHED" : "DRAFT" }))}
                className="w-4 h-4 rounded bg-[#2a2a2a] border-white/10 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="status" className="text-sm text-gray-400">Yayınla</label>
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
              disabled={loading || uploading}
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
