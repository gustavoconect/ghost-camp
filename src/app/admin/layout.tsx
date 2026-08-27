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

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

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
        <div className="flex flex-col w-full min-h-screen bg-black text-white">
            {/* Mobile Top Bar */}
            <header className="lg:hidden h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-5 sticky top-0 z-50">
                <span className="text-xl font-black text-white">
                    Ghost<span className="text-blue-500">Camp</span> Admin
                </span>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-slate-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer hover:text-white"
                    aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Backdrop overlay mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${mobileOpen ? 'block opacity-100' : 'hidden opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />

            <div className="flex flex-1 relative w-full">
                {/* Sidebar */}
                <aside className={`w-[280px] bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 max-lg:fixed max-lg:top-0 max-lg:z-40 transition-all duration-300 shrink-0 ${mobileOpen ? 'max-lg:left-0' : 'max-lg:-left-full'}`}>
                    <div className="h-20 flex items-center justify-center border-b border-zinc-800 text-2xl font-black tracking-widest uppercase">
                        Ghost<span className="text-blue-500">Camp</span>
                    </div>

                    <nav className="flex-1 p-6 py-6 flex flex-col gap-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const active = pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 min-h-[44px] ${active ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25' : 'text-slate-300 hover:bg-zinc-800 hover:text-white font-medium'}`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-zinc-800">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-base cursor-pointer min-h-[44px]">
                            <LogOut size={20} />
                            Sair do Sistema
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 sm:p-8 lg:p-12 max-w-[1450px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
