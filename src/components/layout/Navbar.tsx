'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, Tent, LayoutDashboard, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import gsap from 'gsap';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [mounted, setMounted] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate mobile menu
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        const ctx = gsap.context(() => {
            if (mobileMenuOpen) {
                gsap.fromTo(
                    mobileMenuRef.current,
                    { opacity: 0, y: -20 },
                    { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
                );
                gsap.fromTo(
                    '.mobile-nav-link',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out', delay: 0.1 }
                );
            }
        }, mobileMenuRef);
        return () => ctx.revert();
    }, [mobileMenuOpen]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    if (isAdminRoute) return null;

    const navLinks = [
        { label: 'Início', href: '/' },
        { label: 'Equipamentos', href: '/catalogo' },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-slate-950 backdrop-blur-3xl shadow-2xl border-b border-white/20 py-4'
                : 'bg-slate-950/85 backdrop-blur-md py-8 border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group magnetic-btn">
                        <div className="relative w-14 h-14 overflow-hidden rounded-full shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-white/20 group-hover:border-orange-500/50 transition-all duration-300">
                            <Image
                                src="/ghost_camp_premium_logo.png"
                                alt="Ghost Camp Logo"
                                fill
                                className="object-cover"
                                sizes="56px"
                            />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white drop-shadow-md hidden sm:block">
                            Ghost Camp
                        </span>
                    </Link>

                    {/* Nav Desktop */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`magnetic-btn slide-bg px-5 py-2.5 rounded-2xl font-black transition-all text-base tracking-widest uppercase drop-shadow-sm ${isActive
                                        ? '!text-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)] border border-white/20'
                                        : '!text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        <div className="w-px h-5 bg-white/20" />

                        <Link
                            href="/mochila"
                            className="relative glass p-3 rounded-full hover:bg-orange-600 hover:border-orange-500 transition-all cursor-pointer group"
                            aria-label="Ver mochila"
                        >
                            <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 animate-in zoom-in duration-300">
                                    {itemCount}
                                    <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-40"></span>
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/admin/login"
                            className="magnetic-btn slide-bg text-sm font-black !text-white hover:text-white transition-all bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 uppercase tracking-widest"
                        >
                            Área do Lojista
                        </Link>
                    </nav>

                    {/* Mobile Actions */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link
                            href="/mochila"
                            className="relative p-3 text-white hover:text-white transition-colors magnetic-btn"
                            aria-label="Minha Mochila"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold border-2 border-slate-900 shadow-sm">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-3 text-white hover:text-white cursor-pointer magnetic-btn"
                            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Fullscreen Overlay */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div
                        ref={mobileMenuRef}
                        className="md:hidden fixed inset-x-0 top-0 z-50 bg-slate-900/98 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
                        style={{ paddingTop: 'env(safe-area-inset-top)' }}
                    >
                        {/* Close Button */}
                        <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
                            <span className="text-lg font-black text-white">Ghost Camp</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-3 text-white cursor-pointer"
                                aria-label="Fechar menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-col px-6 py-8 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`mobile-nav-link text-lg font-semibold p-4 rounded-2xl transition-colors ${pathname === link.href
                                        ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                                        : 'text-white hover:bg-white/5'
                                        }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link
                                href="/mochila"
                                className="mobile-nav-link text-lg font-semibold text-white p-4 hover:bg-white/5 rounded-2xl transition-colors flex items-center gap-3"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShoppingBag className="w-5 h-5 text-orange-500" />
                                Minha Mochila
                                {mounted && itemCount > 0 && (
                                    <span className="ml-auto bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <hr className="border-slate-800 my-4" />

                            <Link
                                href="/admin/login"
                                className="mobile-nav-link text-sm font-medium text-slate-400 p-4 hover:bg-white/5 rounded-2xl transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Área do Lojista
                            </Link>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}
