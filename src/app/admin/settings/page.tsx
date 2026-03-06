'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Settings2, Save, CheckCircle } from 'lucide-react';
import { SiteSettings } from '@/types';

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
            // Limpa caracteres especiais do Whatsapp pra salvar limpo (apenas numeros)
            const cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
            const dataToSave = { ...settings, whatsapp_number: cleanPhone };

            await setDoc(doc(db, 'site_settings', 'global'), dataToSave);
            setSettings(dataToSave);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Erro ao salvar config", error);
            alert('Houve um erro ao salvar as configurações. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                    <Settings2 className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Configurações da Loja</h1>
                    <p className="text-slate-400">Gerencie informações públicas e dados de contato do sistema.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
            ) : (
                <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp de Recebimento de Reservas</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">+</span>
                                <input
                                    type="text"
                                    value={settings.whatsapp_number}
                                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    disabled={saving}
                                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    placeholder="Ex: 5511982703261"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Dica: Inclua sempre o DDI (55) e o DDD. Apenas números.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Link do Instagram</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 font-bold">@</span>
                                <input
                                    type="text"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    disabled={saving}
                                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    placeholder="Ex: https://instagram.com/ghosttripsoficial"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Este link aparecerá na área pública (ex: rodapé ou hero).</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                        {success ? (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-in fade-in">
                                <CheckCircle className="w-5 h-5" /> Configurações atualizadas!
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500">Alterações são refletidas imediatamente na loja.</div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 md:mt-0 shadow-lg shadow-orange-900/20"
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
