import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppChrome } from '@/components/layout/AppChrome';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ghost Camp | Aluguel de Equipamentos Outdoor',
  description: 'Aluguel de equipamentos de camping, trilhas e rapel. Reserve fácil via nosso site e retire de forma rápida!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-slate-50 min-h-screen flex flex-col`}>
        <AppChrome>
          {children}
        </AppChrome>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
