'use client';

import { useEffect, useRef } from 'react';
import { Tent, Compass, ArrowRight, Shield, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Image from 'next/image';

/* ── Animated Artifacts ─────────────────────── */

function DoubleHelixGear() {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.helix-gear-a', { rotation: 360, transformOrigin: '50% 50%', duration: 8, repeat: -1, ease: 'linear' });
      gsap.to('.helix-gear-b', { rotation: -360, transformOrigin: '50% 50%', duration: 12, repeat: -1, ease: 'linear' });
    }, svgRef);
    return () => ctx.revert();
  }, []);
  return (
    <svg ref={svgRef} viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Outer gear */}
      <g className="helix-gear-a">
        <circle cx="60" cy="60" r="40" stroke="rgba(37,99,235,0.3)" strokeWidth="2" fill="none" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = parseFloat((60 + 36 * Math.cos(angle)).toFixed(2));
          const y1 = parseFloat((60 + 36 * Math.sin(angle)).toFixed(2));
          const x2 = parseFloat((60 + 46 * Math.cos(angle)).toFixed(2));
          const y2 = parseFloat((60 + 46 * Math.sin(angle)).toFixed(2));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(37,99,235,0.5)" strokeWidth="3" strokeLinecap="round" />;
        })}
      </g>
      {/* Inner gear */}
      <g className="helix-gear-b">
        <circle cx="60" cy="60" r="22" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" fill="none" />
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x1 = parseFloat((60 + 18 * Math.cos(angle)).toFixed(2));
          const y1 = parseFloat((60 + 18 * Math.sin(angle)).toFixed(2));
          const x2 = parseFloat((60 + 26 * Math.cos(angle)).toFixed(2));
          const y2 = parseFloat((60 + 26 * Math.sin(angle)).toFixed(2));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(96,165,250,0.6)" strokeWidth="2.5" strokeLinecap="round" />;
        })}
      </g>
      <circle cx="60" cy="60" r="5" fill="rgba(37,99,235,0.8)" />
    </svg>
  );
}


function EKGWaveform() {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    const ctx = gsap.context(() => {
      const path = svgRef.current?.querySelector('.ekg-path') as SVGPathElement;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, { strokeDashoffset: 0, duration: 2, repeat: -1, ease: 'linear' });
      }
      gsap.to('.ekg-dot', { opacity: 1, scale: 1.5, duration: 0.6, repeat: -1, yoyo: true, ease: 'power2.inOut' });
    }, svgRef);
    return () => ctx.revert();
  }, []);
  return (
    <svg ref={svgRef} viewBox="0 0 120 60" className="w-full h-full" fill="none">
      <path
        className="ekg-path"
        d="M0,30 L15,30 L20,30 L25,10 L30,50 L35,20 L40,40 L45,30 L60,30 L65,30 L70,10 L75,50 L80,20 L85,40 L90,30 L120,30"
        stroke="rgba(16,185,129,0.7)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="ekg-dot" cx="75" cy="50" r="3" fill="rgba(16,185,129,0.8)" />
    </svg>
  );
}

/* ── Feature Data ───────────────────────────── */

const features = [
  {
    icon: Tent,
    title: 'Camping Premium',
    description: 'Barracas resistentes e acessórios modulares para quem não abre mão do conforto e segurança no topo da montanha.',
    color: 'blue',
    artifact: DoubleHelixGear,
  },
  {
    icon: Compass,
    title: 'Rapel e Escalada',
    description: 'Equipamentos rigorosamente inspecionados. Sua vida e segurança são nossa prioridade máxima nas paredes.',
    color: 'emerald',
    artifact: EKGWaveform,
  },
];

const colorMap: Record<string, { icon: string; border: string; bg: string }> = {
  orange: { icon: 'text-blue-500', border: 'border-orange-500/20', bg: 'bg-blue-500/10' },
  blue: { icon: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  emerald: { icon: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
};

/* ── Trust Badges ───────────────────────────── */

const trustBadges = [
  { icon: Shield, label: 'Equipamentos Certificados' },
  { icon: Star, label: 'Avaliação 4.9/5' },
  { icon: Clock, label: 'Entrega em 24h' },
];

/* ── Main Component ─────────────────────────── */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax on scroll
      gsap.to('.hero-image', {
        y: 80,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Hero text reveal
      gsap.fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.hero-title', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out' });
      gsap.fromTo('.hero-subtitle', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out' });
      gsap.fromTo('.hero-cta', { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.9, ease: 'back.out(1.4)' });

      // Trust badges stagger
      gsap.fromTo('.trust-badge', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 1.2, ease: 'power2.out' });

      // Stacking cards with ScrollTrigger + sticky positioning
      const cards = gsap.utils.toArray<HTMLElement>('.feature-card');
      cards.forEach((card, i) => {
        // Each card stacks with a slight offset
        const topOffset = 100 + i * 30;
        card.style.position = 'sticky';
        card.style.top = `${topOffset}px`;

        // O card anterior só começa a esmaecer quando o próximo já está bem visível (60%)
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.93,
            filter: 'blur(8px)',
            opacity: 0.55,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top 60%',
              end: 'top 10%',
              scrub: 0.8,
            },
          });
        }

        // Entrance animation per card
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });

      // CTA section entrance
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen">
      {/* ── HERO ─────────────────────────────── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop"
            alt="Acampamento na montanha sob céu estrelado"
            fill
            priority
            className="hero-image object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-5 sm:px-8 max-w-4xl mx-auto">
          <div
            className="hero-badge inline-flex items-center justify-center gap-3 rounded-full glass mb-8 w-max max-w-full"
            style={{ padding: '12px 24px' }}
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="text-sm font-medium text-slate-200">Equipamentos de alta performance liberados</span>
          </div>

          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-2xl leading-[1.1]">
            Aventura Sem{' '}
            <span className="text-blue-500">Limites</span>
          </h1>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light">
            Aluguel premium de equipamentos para camping, trilhas e rapel.
            Sua expedição começa com o equipamento certo.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/catalogo"
              className="magnetic-btn slide-bg bg-blue-600 text-white font-bold rounded-2xl inline-flex items-center justify-center gap-3 leading-normal hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] group shrink-0"
              style={{ padding: '16px 32px' }}
            >
              Ver Equipamentos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-14">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="trust-badge flex items-center gap-2 text-slate-300/70">
                  <Icon className="w-4 h-4 text-blue-500/70" />
                  <span className="text-xs sm:text-sm font-medium">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-slate-400 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-400/40 flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-400/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── FEATURES (Stacking Cards) ────────── */}
      <section className="section-spacer relative bg-black flex flex-col items-center w-full">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col items-center">
          {/* Section header */}
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mb-16 sm:mb-24 w-full">
            <p className="text-blue-500/80 text-sm font-bold uppercase tracking-widest mb-4 inline-block">
              Por que nos escolher
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight w-full">
              Projetado para Exploradores
            </h2>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Trabalhamos com marcas de ponta para garantir que seu único foco seja a jornada.
            </p>
          </div>

          {/* Stacking feature cards */}
          <div ref={cardsContainerRef} className="flex flex-col gap-10 sm:gap-14">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const Artifact = feature.artifact;
              const colors = colorMap[feature.color];
              return (
                <div key={idx} className="w-full">
                  <div
                    className="feature-card stacking-card glass-card flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:gap-24 w-full"
                    style={{ borderRadius: 'var(--radius-card)', padding: '64px' }}
                  >
                    {/* Artifact side — sempre primeiro no mobile, grande e centralizado */}
                    <div className={`flex items-center justify-center w-full ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className={`w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 ${colors.bg} border ${colors.border} rounded-3xl flex items-center justify-center p-6 sm:p-8`}>
                        <div className="w-full h-full opacity-80">
                          <Artifact />
                        </div>
                      </div>
                    </div>

                    {/* Text side */}
                    <div className={`flex flex-col items-center lg:items-start text-center lg:text-left ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'} px-4 sm:px-8`}>
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 ${colors.bg} border ${colors.border} ${colors.icon} rounded-2xl flex items-center justify-center mb-6 sm:mb-8`}>
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-5 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed font-medium text-base sm:text-lg max-w-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP CTA ────────────────────── */}
      <section className="section-spacer w-full bg-black relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div ref={ctaRef} className="w-full max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10 flex flex-col items-center">
          <p className="text-blue-500/80 text-sm font-bold uppercase tracking-widest mb-4">
            Comece Agora
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Sua Próxima Aventura
            <br className="hidden sm:block" />
            <span className="text-blue-500"> Começa Aqui</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 max-w-xl mx-auto">
            Escolha seus equipamentos, defina o período e finalize pelo WhatsApp. Sem complicação, sem burocracia.
          </p>
          <Link
            href="/catalogo"
            className="magnetic-btn slide-bg inline-flex items-center justify-center gap-3 leading-normal bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] group text-xl mx-auto shrink-0 whitespace-nowrap"
            style={{ padding: '16px 32px' }}
          >
            Explorar Catálogo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
