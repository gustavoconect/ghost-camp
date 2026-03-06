import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

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
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-900 text-slate-50`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
