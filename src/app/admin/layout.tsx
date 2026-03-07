'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Tent,
    Settings,
    LogOut,
    Menu,
    X,
    ShoppingBag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Não renderiza o menu lateral na tela de login
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/auth/session', { method: 'DELETE' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error', error);
        }
    };

    const menuItems = [
        { label: 'Visão Geral', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Equipamentos', icon: Tent, href: '/admin/equipments' },
        { label: 'Reservas', icon: ShoppingBag, href: '/admin/bookings' },
        { label: 'Configurações', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-black text-slate-200 flex flex-col lg:flex-row">
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700 flex items-center justify-between px-5 z-50">
                <span className="text-xl font-black text-white">
                    Ghost<span className="text-blue-500">Camp</span> Admin
                </span>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-3 text-slate-400 hover:text-white cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Backdrop overlay mobile */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 
                transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 lg:z-auto lg:h-screen lg:sticky lg:top-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Desktop */}
                    <div className="h-16 items-center justify-center border-b border-slate-700 hidden lg:flex shrink-0">
                        <span className="text-2xl font-black text-white tracking-widest uppercase">
                            Ghost<span className="text-blue-500">Camp</span>
                        </span>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto mt-16 lg:mt-0">
                        {menuItems.map((item) => {
                            const active = pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer min-h-[48px]
                                        ${active
                                            ? 'bg-blue-600 border border-blue-500 text-white font-bold shadow-lg shadow-blue-900/20'
                                            : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-slate-700 shrink-0">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-all cursor-pointer min-h-[48px]"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen pt-20 lg:pt-10 px-5 sm:px-6 lg:px-10 pb-12 overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
