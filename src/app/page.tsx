import { Tent, MountainSnow, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900 z-10" />
          <img
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop"
            alt="Acampamento na montanha"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
            Aventura Sem <span className="text-orange-500">Limites</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Aluguel premium de equipamentos para camping, trilhas e rapel.
            Sua expedição começa com o equipamento certo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/catalogo"
              className="group relative px-8 py-4 bg-orange-600 text-white font-bold rounded-lg overflow-hidden flex items-center gap-2 hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/30"
            >
              Ver Equipamentos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-orange-500/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <Tent className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Camping Premium</h3>
              <p className="text-slate-400 leading-relaxed">Barracas e acessórios para quem não abre mão do conforto na natureza.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-orange-500/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <MountainSnow className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Trilhas Extrema</h3>
              <p className="text-slate-400 leading-relaxed">Mochilas, botas e impermeáveis das melhores marcas para proteger sua jornada.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-orange-500/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Rapel e Escalada</h3>
              <p className="text-slate-400 leading-relaxed">Cordas, mosquetões e cadeirinhas rigorosamente inspecionados para sua segurança.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
