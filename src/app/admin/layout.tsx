'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Tent, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
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
        { label: 'Configurações', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex text-slate-200">
            {/* Menu Mobile */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50">
                <span className="text-xl font-black text-white">Ghost<span className="text-orange-500">Camp</span> Admin</span>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-400 hover:text-white">
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Desktop e Mobile Wrapper */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full h-[100dvh]">
                    <div className="h-16 flex items-center justify-center border-b border-slate-700 hidden lg:flex">
                        <span className="text-2xl font-black text-white tracking-widest uppercase">
                            Ghost<span className="text-orange-500">Camp</span>
                        </span>
                    </div>

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
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active
                                            ? 'bg-orange-600 border border-orange-500 text-white font-bold shadow-lg shadow-orange-900/20'
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

                    <div className="p-4 border-t border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair do Sistema
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>

        </div>
    );
}
