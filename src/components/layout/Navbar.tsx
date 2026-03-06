'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Tent, Menu, X, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    // Hydration sync check: delay store usage until mounted 
    const [mounted, setMounted] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());

    // Esconder a navbar na rota de admin logado (deixar o layout do admin assumir)
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isAdminRoute) return null;

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Premium */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 overflow-hidden rounded-full shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-white/10 group-hover:border-orange-500/50 transition-all duration-300 group-hover:scale-105">
                            <img
                                src="/ghost_camp_premium_logo.png"
                                alt="Ghost Camp Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white drop-shadow-md hidden sm:block font-[system-ui]">
                            Ghost Camp
                        </span>
                    </Link>

                    {/* Nav Desktop Principal */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-slate-200 hover:text-orange-500 font-medium transition-colors">
                            Início
                        </Link>
                        <Link href="/catalogo" className="text-slate-200 hover:text-orange-500 font-medium transition-colors">
                            Equipamentos
                        </Link>

                        <div className="h-6 border-l border-slate-700 mx-2"></div>

                        <Link href="/mochila" className="relative p-2 text-slate-200 hover:text-orange-500 transition-colors flex items-center gap-2 group">
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold border-2 border-slate-900 shadow-sm animate-in fade-in zoom-in group-hover:scale-110 transition-transform">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <Link href="/admin/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
                            Área do Lojista
                        </Link>
                    </div>

                    {/* Mobile Menu Botão */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/mochila" className="relative p-2 text-slate-200 hover:text-orange-500 transition-colors group">
                            <ShoppingBag className="w-6 h-6" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold border-2 border-slate-900 shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-200 hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile Render */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 shadow-xl py-4 flex flex-col px-4 gap-4 pb-8">
                    <Link
                        href="/"
                        className="text-lg font-medium text-slate-200 p-2 hover:bg-slate-800 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Início
                    </Link>
                    <Link
                        href="/catalogo"
                        className="text-lg font-medium text-orange-500 p-2 hover:bg-slate-800 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Equipamentos
                    </Link>
                    <hr className="border-slate-800 my-2" />
                    <Link
                        href="/admin/login"
                        className="text-sm font-medium text-slate-400 p-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Área do Lojista
                    </Link>
                </div>
            )}
        </header>
    );
}
