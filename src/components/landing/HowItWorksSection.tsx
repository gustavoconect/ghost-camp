'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Clock,
  CalendarDays,
  Banknote,
  ChevronDown
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: 'Escolha seus itens',
    description: 'Acesse o catálogo e confira os equipamentos com fotos, detalhes e valores por diária.',
  },
  {
    title: 'Faça sua solicitação',
    description: 'Fale com a gente pelo WhatsApp ou site informando itens, data de retirada e devolução.',
  },
  {
    title: 'Confirmação',
    description: 'Verificamos a disponibilidade e te enviamos as informações para a reserva.',
  },
  {
    title: 'Reserva garantida',
    description: 'Reserva confirmada após o pagamento inicial (50%) e envio dos dados.',
  },
];

const faqs = [
  {
    icon: MapPin,
    title: 'Retirada e Devolução',
    content: (
      <ul className="space-y-4 text-sm text-slate-300">
        <li><strong className="text-white">Retirada presencial:</strong> Com horário agendado em nosso ponto.</li>
        <li><strong className="text-white">Entrega por parceiro:</strong> Enviamos via parceiro (solicite cotação com endereço).</li>
        <li><strong className="text-white">Aplicativo (Uber/99):</strong> Solicite um motorista. Responsabilidade do cliente.</li>
        <li><strong className="text-white">Ponto alternativo:</strong> Retirada em local parceiro (mediante agendamento).</li>
      </ul>
    )
  },
  {
    icon: CalendarDays,
    title: 'Como funcionam as diárias?',
    content: (
      <div className="text-sm text-slate-300 space-y-4">
        <p>A diária corresponde ao uso do equipamento por um dia completo. Pacotes de fim de semana:</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> <strong>Sexta a segunda:</strong> 3 diárias</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> <strong>Sábado a segunda:</strong> 2 diárias</li>
        </ul>
      </div>
    )
  },
  {
    icon: Banknote,
    title: 'Formas de Pagamento',
    content: (
      <div className="text-sm text-slate-300 space-y-3">
        <p>Trabalhamos com Pix ou transferência bancária:</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 50% na reserva</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 50% até a retirada</li>
        </ul>
        <p className="text-xs text-slate-400 mt-2">* Pagamento no cartão disponível (com taxas da operadora).</p>
      </div>
    )
  },
  {
    icon: Clock,
    title: 'Horários de Atendimento',
    content: (
      <ul className="space-y-3 text-sm text-slate-300">
        <li className="flex justify-between border-b border-slate-800/50 pb-2">
          <span>Segunda a sexta</span><span className="text-white">Comercial</span>
        </li>
        <li className="flex justify-between border-b border-slate-800/50 pb-2">
          <span>Sábados</span><span className="text-white">Reduzido</span>
        </li>
        <li className="flex justify-between pb-2">
          <span>Domingos e Feriados</span><span className="text-white">Sob consulta</span>
        </li>
      </ul>
    )
  }
];

function AccordionItem({ item, isOpen, onClick }: { item: any, isOpen: boolean, onClick: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  return (
    <div className="border-b border-slate-800/60 overflow-hidden">
      <button
        className="w-full flex items-center justify-between py-6 min-h-[44px] text-left group transition-colors hover:text-blue-400 outline-none cursor-pointer"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors duration-300 ${isOpen ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-900/50 text-slate-400 group-hover:text-blue-400'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h4 className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-300'}`}>
            {item.title}
          </h4>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-500 ease-in-out"
        style={{ height: isOpen ? contentRef.current?.scrollHeight : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="pb-8 pl-14">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openAccordion, setOpenAccordion] = useState<number>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(['.how-header', '.step-item', '.accordion-container'], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo('.how-header',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.how-header',
            start: 'top 82%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Steps entrance
      gsap.fromTo('.step-item',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 82%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Accordion entrance
      gsap.utils.toArray<HTMLElement>('.accordion-container').forEach((container) => {
        gsap.fromTo(container,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              end: 'bottom top',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] flex flex-col items-center w-full py-32 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center z-10 gap-12 md:gap-16">

        {/* Header */}
        <div className="how-header max-w-3xl text-center flex flex-col items-center w-full">
          <p className="text-blue-500 text-sm font-bold uppercase tracking-widest mb-4">
            Aventura Descomplicada
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Seu equipamento em <br className="hidden sm:block" />
            <span className="text-slate-400">4 passos simples.</span>
          </h2>
        </div>

        {/* 4 Steps Timeline */}
        <div className="steps-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20 lg:gap-8 w-full">
          {steps.map((step, idx) => (
            <div key={idx} className="step-item relative flex flex-col items-center text-center lg:px-6 group">
              {/* Connecting Line (Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[50%] right-[-50%] h-px bg-slate-800/60 group-hover:bg-blue-500/30 transition-colors duration-500" />
              )}

              <div className="text-5xl lg:text-6xl font-bold text-slate-500 group-hover:text-blue-400 transition-colors duration-300 mb-8 font-mono tracking-tighter relative z-10 bg-[#0a0a0a] px-6">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-[280px]">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="flex flex-col items-center max-w-3xl w-full gap-8 md:gap-12">

          {/* Accordion FAQ */}
          <div className="accordion-container w-full flex flex-col">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                item={faq}
                isOpen={openAccordion === idx}
                onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
              />
            ))}
          </div>

          {/* Outro Text */}
          <div className="text-center accordion-container w-full">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Tudo pensado para a sua logística.</h3>
            <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
              Oferecemos diversas opções de retirada, pagamento e flexibilidade de diárias para que você só se preocupe com o destino.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
