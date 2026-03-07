import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-slate-50 min-h-screen flex flex-col items-center`}>
        <Navbar />
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-12 px-4 sm:px-6 md:px-8 flex-1">
          {children}
        </div>
        <div className="w-full">
          <Footer />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
