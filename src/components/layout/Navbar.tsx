'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const totalItems = useCartStore((state) => state.getTotalItems());

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
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-white/5 py-3'
                : 'bg-slate-900/70 backdrop-blur-sm py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-[0_0_12px_rgba(234,88,12,0.35)] border border-white/10 group-hover:border-orange-500/50 transition-all duration-300 group-hover:scale-105">
                            <img
                                src="/ghost_camp_premium_logo.png"
                                alt="Ghost Camp Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white drop-shadow-md hidden sm:block">
                            Ghost Camp
                        </span>
                    </Link>

                    {/* Nav Desktop - Ultra Spaced for Premium Look */}
                    <nav className="hidden md:flex items-center gap-12">
                        <Link
                            href="/"
                            className={`px-6 py-3 rounded-2xl font-black transition-all text-sm tracking-widest uppercase ${pathname === '/'
                                ? 'text-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                }`}
                        >
                            Início
                        </Link>
                        <Link
                            href="/catalogo"
                            className={`px-6 py-3 rounded-2xl font-black transition-all text-sm tracking-widest uppercase ${pathname === '/catalogo'
                                ? 'text-orange-400 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.2)] border border-orange-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                }`}
                        >
                            Equipamentos
                        </Link>

                        <div className="w-px h-5 bg-slate-700 mx-3"></div>

                        <Link href="/mochila" className="relative p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all group">
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold border-2 border-slate-900 shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/admin/login"
                            className="ml-2 text-xs font-medium text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-white/20"
                        >
                            Área do Lojista
                        </Link>
                    </nav>

                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link href="/mochila" className="relative p-2 text-slate-300 hover:text-white transition-colors">
                            <ShoppingBag className="w-6 h-6" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold border-2 border-slate-900 shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-300 hover:text-white cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-lg border-t border-white/5 shadow-2xl py-4 flex flex-col px-5 gap-1 pb-6">
                    <Link
                        href="/"
                        className="text-base font-medium text-slate-200 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Início
                    </Link>
                    <Link
                        href="/catalogo"
                        className="text-base font-medium text-orange-400 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Equipamentos
                    </Link>
                    <hr className="border-slate-800 my-2" />
                    <Link
                        href="/admin/login"
                        className="text-sm font-medium text-slate-500 p-3 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Área do Lojista
                    </Link>
                </div>
            )}
        </header>
    );
}
