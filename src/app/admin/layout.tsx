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

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

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
        { label: 'Reservas', icon: ShoppingBag, href: '/admin/bookings' },
        { label: 'Configurações', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="admin-root">
            {/* Espaçador OBRIGATÓRIO (80px) para compensar a Navbar fixa do site */}
            <div style={{ height: '80px', flexShrink: 0, width: '100%' }} aria-hidden="true" />

            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-root {
                    display: flex;
                    flex-direction: column;
                    width: 100vw;
                    margin-left: calc(-50vw + 50%); /* Força ocupar 100vw passando as barreiras do layout global */
                    min-height: 100vh;
                    background: #000;
                    color: #fff;
                    font-family: inherit;
                }
                .admin-container {
                    display: flex;
                    flex: 1;
                    position: relative;
                }
                
                /* ========================
                   SIDEBAR (DESKTOP)
                   ======================== */
                .admin-sidebar {
                    width: 280px;
                    background-color: #09090b; /* zinc-950 */
                    border-right: 1px solid #27272a; /* zinc-800 */
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 80px; /* Alinhado abaixo do spacer do Navbar global */
                    height: calc(100vh - 80px);
                }
                .admin-sidebar-header {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #27272a;
                    font-size: 1.5rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .brand-blue {
                    color: #3b82f6; /* blue-500 */
                }
                .admin-nav {
                    flex: 1;
                    padding: 32px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    overflow-y: auto;
                }
                .admin-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    color: #94a3b8; /* slate-400 */
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .admin-nav-link:hover {
                    background-color: #27272a; /* zinc-800 */
                    color: #fff;
                }
                .admin-nav-link.active {
                    background-color: #2563eb; /* blue-600 */
                    color: #fff;
                    font-weight: bold;
                    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
                }
                .admin-logout-box {
                    padding: 16px;
                    border-top: 1px solid #27272a;
                }
                .admin-logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 12px;
                    color: #94a3b8;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                }
                .admin-logout-btn:hover {
                    color: #f87171;
                    background-color: rgba(248, 113, 113, 0.1);
                }

                /* ========================
                   MAIN CONTENT
                   ======================== */
                .admin-main {
                    flex: 1;
                    padding: 48px;
                    max-width: 1450px;
                    margin: 0 auto;
                    width: 100%;
                }

                /* ========================
                   MOBILE MODIFIERS
                   ======================== */
                .mobile-topbar {
                    display: none;
                    height: 64px;
                    background-color: #09090b;
                    border-bottom: 1px solid #27272a;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    position: sticky;
                    top: 80px;
                    z-index: 50;
                }
                .mobile-toggle {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 8px;
                }
                .mobile-backdrop {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    z-index: 30;
                }

                @media (max-width: 1024px) {
                    .admin-sidebar {
                        position: fixed;
                        top: 80px;
                        left: -100%;
                        z-index: 40;
                        transition: left 0.3s ease;
                    }
                    .admin-sidebar.open {
                        left: 0;
                    }
                    .mobile-topbar {
                        display: flex;
                    }
                    .mobile-backdrop.open {
                        display: block;
                    }
                    .admin-main {
                        padding: 32px 20px;
                    }
                }
                `
            }} />

            {/* Mobile Top Bar */}
            <div className="mobile-topbar">
                <span className="text-xl font-black text-white">
                    Ghost<span className="brand-blue">Camp</span> Admin
                </span>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="mobile-toggle"
                    aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Backdrop overlay mobile */}
            <div
                className={`mobile-backdrop ${mobileOpen ? 'open' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            <div className="admin-container">
                {/* Sidebar */}
                <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
                    <div className="admin-sidebar-header">
                        Ghost<span className="brand-blue">Camp</span>
                    </div>

                    <nav className="admin-nav">
                        {menuItems.map((item) => {
                            const active = pathname.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`admin-nav-link ${active ? 'active' : ''}`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="admin-logout-box">
                        <button onClick={handleLogout} className="admin-logout-btn">
                            <LogOut size={20} />
                            Sair do Sistema
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
