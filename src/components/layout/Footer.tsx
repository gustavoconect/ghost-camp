'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MapPin, Phone } from 'lucide-react';

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
        <footer className="w-full bg-[#030308] border-t border-slate-800/80 relative mt-24">

            <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-8 pt-24 pb-12 flex flex-col gap-20">
                {/* 
                  Main Split Container
                  Desktop: Row (Logo Left / Links Right)
                  Mobile: Col (Centered everything)
                */}
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-16 lg:gap-10">

                    {/* Left Block: Brand Identity (Up to 50% width on Desktop) */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:w-1/2">
                        {/* Giant Image Area */}
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(37,99,235,0.15)] flex items-center justify-center bg-black">
                            <Image
                                src="/ghost_camp_premium_logo.png"
                                alt="Ghost Camp Logo"
                                fill
                                className="object-cover scale-[1.05]"
                                sizes="(max-width: 768px) 160px, 192px"
                                priority
                            />
                        </div>

                        {/* Bio & Contact */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left h-full justify-center mt-2">
                            <Link href="/">
                                <span className="text-4xl font-black !text-white tracking-tighter mb-4 inline-block drop-shadow-sm">
                                    Ghost<span className="text-blue-500">Camp</span>
                                </span>
                            </Link>

                            <p className="!text-slate-300 font-medium text-sm sm:text-base leading-relaxed max-w-sm mb-6">
                                Sua aventura começa com o equipamento certo. Aluguel simples, rápido e com a garantia de qualidade que todo explorador merece.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-2 !text-slate-300">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <span className="font-semibold text-sm">São Paulo, SP</span>
                                </div>
                                {settings?.whatsapp_number && (
                                    <div className="flex items-center gap-2 !text-slate-300">
                                        <Phone className="w-5 h-5 text-blue-500" />
                                        <span className="font-semibold text-sm">WhatsApp</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Block: Links (Pushed right via lg:ml-auto) */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-16 sm:gap-24 lg:ml-auto w-full lg:w-auto lg:justify-end pt-4">

                        {/* Navigation Column */}
                        <div className="flex flex-col items-center sm:items-start min-w-max">
                            <h4 className="!text-white font-black mb-6 text-sm uppercase tracking-widest flex flex-col items-center sm:items-start gap-4">
                                Navegação
                                <span className="w-10 h-1 bg-blue-500 block rounded-full" />
                            </h4>
                            <nav className="flex flex-col items-center sm:items-start gap-5">
                                <Link href="/" className="!text-white hover:text-blue-400 transition-colors w-fit text-base font-bold drop-shadow-sm">
                                    Início
                                </Link>
                                <Link href="/catalogo" className="!text-white hover:text-blue-400 transition-colors w-fit text-base font-bold drop-shadow-sm">
                                    Equipamentos
                                </Link>
                                <Link href="/mochila" className="!text-white hover:text-blue-400 transition-colors w-fit text-base font-bold drop-shadow-sm">
                                    Minha Mochila
                                </Link>
                            </nav>
                        </div>

                        {/* Social Column */}
                        <div className="flex flex-col items-center sm:items-start min-w-max">
                            <h4 className="!text-white font-black mb-6 text-sm uppercase tracking-widest flex flex-col items-center sm:items-start gap-4">
                                Social
                                <span className="w-10 h-1 bg-blue-500 block rounded-full" />
                            </h4>
                            {settings?.instagram_url ? (
                                <a
                                    href={settings.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 w-fit group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/30">
                                        <Instagram className="w-5 h-5 !text-white" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="!text-white font-bold text-sm group-hover:text-blue-400 transition-colors">Instagram</span>
                                        <span className="!text-slate-400 text-xs font-semibold">@ghosttripsoficial</span>
                                    </div>
                                </a>
                            ) : (
                                <p className="!text-slate-400 text-sm font-semibold">Insta não linkado</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Bottom Copyright Row */}
                <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="!text-slate-500 text-xs sm:text-sm font-bold text-center md:text-left">
                        &copy; {new Date().getFullYear()} Ghost Camp. Todos os direitos reservados.
                    </p>
                    <p className="!text-slate-500 text-xs sm:text-sm font-bold text-center md:text-right">
                        Equipamentos para quem vive a aventura.
                    </p>
                </div>

            </div>
        </footer>
    );
}
