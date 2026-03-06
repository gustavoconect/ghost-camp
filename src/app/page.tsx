import { Tent, MountainSnow, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Modern Premium Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900/60 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop"
            alt="Acampamento na montanha"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-200">Equipamentos de alta performance liberados</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Aventura Sem <span className="text-orange-500">Limites</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Aluguel premium de equipamentos para camping, trilhas e rapel.
            Sua expedição começa com o equipamento certo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in zoom-in duration-1000 delay-300">
            <Link
              href="/catalogo"
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl overflow-hidden flex items-center gap-3 hover:bg-orange-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] group"
            >
              Ver Equipamentos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features - Ultra Spaced with Fallback */}
      <section
        className="py-48 bg-slate-900 relative"
        style={{ paddingTop: '12rem', paddingBottom: '12rem' }}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Projetado para Exploradores</h2>
            <p className="text-slate-400 text-lg leading-relaxed">Trabalhamos com marcas de ponta para garantir que seu único foco seja a jornada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Tent className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Camping Premium</h3>
              <p className="text-slate-400 leading-relaxed font-light text-base">Barracas resistentes e acessórios modulares para quem não abre mão do conforto e segurança no topo da montanha.</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MountainSnow className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Trilhas Extrema</h3>
              <p className="text-slate-400 leading-relaxed font-light text-base">Mochilas cargueiras anatômicas, isolantes térmicos e itens essenciais para jornadas longas e travessias duras.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-10 rounded-3xl group hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Rapel e Escalada</h3>
              <p className="text-slate-400 leading-relaxed font-light text-base">Equipamentos rigorosamente inspecionados. Sua vida e segurança são nossa prioridade máxima nas paredes.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
