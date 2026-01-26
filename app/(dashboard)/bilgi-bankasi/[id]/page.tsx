"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  ExternalLink,
  ChevronLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { ContentData } from "@/lib/types";

export default function BilgiBankasiDetay() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/contents/${params.id}`);
        const data = await res.json();
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen -mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">İçerik bulunamadı</h2>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] rounded-lg text-white mx-auto hover:bg-[#3a3a3a] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="w-6 h-6 text-blue-400" />;
      case "PDF": return <FileText className="w-6 h-6 text-red-400" />;
      case "LINK": return <LinkIcon className="w-6 h-6 text-green-400" />;
      default: return null;
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Bilgi Bankasına Dön
      </button>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            {getTypeIcon(content.type)}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium uppercase tracking-wider">
              <span>{content.category?.icon} {content.category?.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mt-1">{content.title}</h1>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {content.type === "VIDEO" && content.url && (
          <div className="aspect-video bg-black">
            {getYoutubeId(content.url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(content.url)}`}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Video className="w-12 h-12 mb-4 block mx-auto opacity-20" />
                <p>Geçersiz Video Linki</p>
              </div>
            )}
          </div>
        )}

        {content.type === "PDF" && (content.fileUrl || content.url) && (
          <div className="p-8 text-center bg-white/5">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">PDF Dokümanı</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Bu içeriği görüntülemek veya indirmek için aşağıdaki butonu kullanabilirsiniz.
            </p>
            <a
              href={content.fileUrl || content.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Dosyayı Aç / İndir
            </a>
          </div>
        )}

        {content.type === "LINK" && content.url && (
          <div className="p-8 text-center bg-white/5">
            <LinkIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Harici Bağlantı</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Bu içerik harici bir platformda (Google Drive, Notion vb.) barındırılmaktadır.
            </p>
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all hover:scale-105"
            >
              <ExternalLink className="w-5 h-5" />
              Bağlantıya Git
            </a>
          </div>
        )}
      </div>

      {/* Description / Text Content */}
      <div className="glass-card rounded-2xl p-8 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          İçerik Detayları
        </h2>
        <div 
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: content.description }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
        <span>Eklenme Tarihi: {new Date(content.createdAt).toLocaleDateString('tr-TR')}</span>
        <span>Kategori: {content.category?.name}</span>
      </div>
    </div>
  );
}
