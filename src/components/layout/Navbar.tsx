'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [mounted, setMounted] = useState(false);

    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isAdminRoute) return null;

    const navLinks = [
        { label: 'Início', href: '/' },
        { label: 'Equipamentos', href: '/catalogo' },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? 'bg-black backdrop-blur-3xl shadow-2xl border-b border-white/20 py-3 sm:py-4'
                : 'bg-black/85 backdrop-blur-md py-4 sm:py-8 border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between w-full">

                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 group magnetic-btn shrink-0 z-10 hover:scale-105 transition-transform">
                        <div className="relative w-10 h-10 sm:w-14 sm:h-14 transition-all duration-300">
                            <Image
                                src="/ghost_camp_premium_logo.png"
                                alt="Ghost Camp Logo"
                                fill
                                className="object-contain drop-shadow-lg"
                                sizes="(max-width: 640px) 40px, 56px"
                            />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white drop-shadow-md hidden md:block">
                            Ghost Camp
                        </span>
                    </Link>

                    {/* Right/Center: Horizontal Nav (Flex-1 allows centering properly between logo and end on mobile) */}
                    <nav className="flex-1 flex justify-center sm:justify-end items-center gap-1 sm:gap-6 lg:gap-8">
                        <div className="flex items-center gap-1 sm:gap-6 shrink-0">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`magnetic-btn slide-bg rounded-full font-black transition-all text-xs sm:text-base uppercase drop-shadow-sm flex items-center justify-center leading-normal shrink-0 ${isActive
                                            ? '!text-white bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)] border border-white/20'
                                            : '!text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                            }`}
                                        style={{ padding: '10px 24px' }}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="w-px h-5 bg-white/20 hidden sm:block" />

                        {/* Cart Button */}
                        <Link
                            href="/mochila"
                            className="relative flex items-center justify-center glass p-2.5 sm:p-3 rounded-full hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer group"
                            aria-label="Ver mochila"
                        >
                            <ShoppingBag className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black animate-in zoom-in duration-300">
                                    {itemCount}
                                    <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-40"></span>
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
