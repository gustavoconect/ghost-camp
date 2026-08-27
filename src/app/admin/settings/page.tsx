'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Settings2, Save, CheckCircle } from 'lucide-react';
import { SiteSettings } from '@/types';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [settings, setSettings] = useState<SiteSettings>({
        whatsapp_number: '',
        instagram_url: ''
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const docRef = doc(db, 'site_settings', 'global');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSettings(docSnap.data() as SiteSettings);
                }
            } catch (error) {
                console.error("Erro ao buscar configurações", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
            const dataToSave = { ...settings, whatsapp_number: cleanPhone };

            await setDoc(doc(db, 'site_settings', 'global'), dataToSave);
            setSettings(dataToSave);
            setSuccess(true);
            toast.success('Configurações salvas com sucesso!');

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Erro ao salvar config", error);
            toast.error('Houve um erro ao salvar as configurações. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 text-blue-500">
                    <Settings2 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Configurações da Loja</h1>
                    <p className="text-slate-400 text-sm">Gerencie informações públicas e dados de contato do sistema.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            ) : (
                <form
                    onSubmit={handleSave}
                    className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 space-y-7 shadow-xl"
                >
                    <div className="space-y-6">
                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="settings-whatsapp" className="block text-sm font-semibold text-slate-300 mb-2">
                                WhatsApp de Recebimento de Reservas
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">+</span>
                                <input
                                    id="settings-whatsapp"
                                    type="text"
                                    value={settings.whatsapp_number}
                                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    disabled={saving}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-8 pr-4 py-3.5 focus:border-blue-500 focus:outline-none text-base min-h-[48px]"
                                    placeholder="Ex: 5511982703261"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Dica: Inclua sempre o DDI (55) e o DDD. Apenas números.
                            </p>
                        </div>

                        {/* Instagram */}
                        <div>
                            <label htmlFor="settings-instagram" className="block text-sm font-semibold text-slate-300 mb-2">
                                Link do Instagram
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">@</span>
                                <input
                                    id="settings-instagram"
                                    type="text"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    disabled={saving}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3.5 focus:border-blue-500 focus:outline-none text-base min-h-[48px]"
                                    placeholder="Ex: https://instagram.com/ghosttripsoficial"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Este link aparecerá na área pública (ex: rodapé ou hero).
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-zinc-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                        {success ? (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-in fade-in">
                                <CheckCircle className="w-5 h-5" /> Configurações atualizadas!
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 text-center sm:text-left">
                                Alterações são refletidas imediatamente na loja.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 leading-normal rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-600/30 min-h-[48px] cursor-pointer"
                        >
                            {saving ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
                            ) : (
                                <><Save className="w-5 h-5" /> Salvar Alterações</>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
