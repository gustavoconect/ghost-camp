'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function AppChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <div className="flex-1 w-full">
                {children}
            </div>
            {!isAdminRoute && <Footer />}
        </>
    );
}
