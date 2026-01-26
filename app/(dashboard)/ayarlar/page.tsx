"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Loader2, Save, CheckCircle2 } from "lucide-react";

export default function AyarlarPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        firstName: (session?.user as any)?.firstName || "",
        lastName: (session?.user as any)?.lastName || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("Yeni şifreler eşleşmiyor.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Güncelleme sırasında bir hata oluştu.");
            }

            await update();
            setSuccess(true);
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));

            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h2 className="text-xl font-semibold text-white">Profil Ayarları</h2>
                <p className="text-sm text-gray-400">Hesap bilgilerinizi ve şifrenizi güncelleyin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Kişisel Bilgiler
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Ad</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Soyad</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white transition-colors"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" />
                        Şifre Değiştir
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Mevcut Şifre</label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Yeni Şifre</label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Yeni Şifre (Tekrar)</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-shake">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Profiliniz başarıyla güncellendi.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Güncelleniyor...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
