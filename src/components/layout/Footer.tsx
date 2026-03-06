'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';
import Link from 'next/link';
import { Tent, Instagram, ArrowUpRight } from 'lucide-react';

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
        <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Tent className="w-8 h-8 text-orange-500" />
                            <span className="text-2xl font-black text-white tracking-widest uppercase">
                                Ghost<span className="text-orange-500">Camp</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm">
                            Sua aventura começa com o equipamento certo. Aluguel simples, rápido e com a garantia de qualidade que você merece.
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Acesso Rápido</h4>
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="text-slate-400 hover:text-orange-500 transition-colors w-fit">Home</Link>
                            <Link href="/catalogo" className="text-slate-400 hover:text-orange-500 transition-colors w-fit">Catálogo de Equipamentos</Link>
                            <Link href="/mochila" className="text-slate-400 hover:text-orange-500 transition-colors w-fit">Carrinho de Reserva</Link>
                        </nav>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Redes Sociais</h4>
                        {settings?.instagram_url ? (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 p-4 rounded-xl text-slate-300 hover:text-white transition-all w-fit group"
                            >
                                <Instagram className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="text-sm font-bold">Siga no Instagram</p>
                                    <p className="text-xs text-slate-500">@ghosttripsoficial</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <p className="text-slate-500 text-sm">Instagram não configurado</p>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Ghost Camp. Todos os direitos reservados.
                    </p>
                    <p className="text-slate-600 text-xs">
                        Desenvolvido com dedicação às experiências outdoor.
                    </p>
                </div>
            </div>
        </footer>
    );
}
