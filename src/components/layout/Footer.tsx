'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';
import Link from 'next/link';
import { Instagram, ArrowUpRight, MapPin, Phone } from 'lucide-react';

export function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const docRef = doc(db, 'site_settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as SiteSettings);
                }
            } catch (error) {
                console.error("Erro ao carregar footer", error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="relative bg-slate-950 border-t border-slate-800/50">
            {/* Gradient line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                                <img
                                    src="/ghost_camp_premium_logo.png"
                                    alt="Ghost Camp Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">
                                Ghost<span className="text-orange-500">Camp</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-md font-light leading-relaxed mb-6">
                            Sua aventura começa com o equipamento certo. Aluguel simples, rápido e com a garantia de qualidade que todo explorador merece.
                        </p>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                <span>São Paulo, SP</span>
                            </div>
                            {settings?.whatsapp_number && (
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" />
                                    <span>WhatsApp</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col">
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Navegação</h4>
                        <nav className="flex flex-col gap-3">
                            <Link href="/" className="text-slate-400 hover:text-orange-400 transition-colors w-fit text-sm">Início</Link>
                            <Link href="/catalogo" className="text-slate-400 hover:text-orange-400 transition-colors w-fit text-sm">Equipamentos</Link>
                            <Link href="/mochila" className="text-slate-400 hover:text-orange-400 transition-colors w-fit text-sm">Minha Mochila</Link>
                        </nav>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col">
                        <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Social</h4>
                        {settings?.instagram_url ? (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card flex items-center gap-3 p-4 rounded-xl text-slate-300 hover:text-white hover:border-orange-500/50 transition-all w-fit group cursor-pointer"
                            >
                                <Instagram className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-semibold">Instagram</p>
                                    <p className="text-xs text-slate-500">@ghosttripsoficial</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 ml-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <p className="text-slate-600 text-sm">Instagram não configurado</p>
                        )}
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-slate-500 text-xs">
                        &copy; {new Date().getFullYear()} Ghost Camp. Todos os direitos reservados.
                    </p>
                    <p className="text-slate-700 text-xs">
                        Equipamentos para quem vive a aventura.
                    </p>
                </div>
            </div>
        </footer>
    );
}
