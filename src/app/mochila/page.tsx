'use client';

import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import { Trash2, Calendar as CalendarIcon, MessageCircle, Minus, Plus, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export default function MochilaCheckout() {
    const { items, rentalDays, removeItem, updateQuantity, getTotalPrice, setRentalDays } = useCartStore();
    const [whatsappNumber, setWhatsappNumber] = useState('5511982703261');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const docRef = doc(db, 'site_settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().whatsapp_number) {
                    setWhatsappNumber(docSnap.data().whatsapp_number);
                }
            } catch (e) {
                console.error('Falha ao obter configurações globais no checkout');
            }
        }
        fetchSettings();
    }, []);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName || !customerPhone) {
            toast.error('Preencha seu nome e telefone para continuar.');
            return;
        }

        setIsSubmitting(true);

        try {
            const total = getTotalPrice();

            // 1. Save to Firestore
            const bookingData = {
                customer_name: customerName,
                customer_phone: customerPhone,
                items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price_per_day })),
                rental_days: rentalDays,
                total_value: total,
                status: 'pending',
                created_at: new Date().toISOString(),
                source: 'website_cart'
            };

            const { addDoc, collection } = await import('firebase/firestore');
            await addDoc(collection(db, 'bookings'), bookingData);

            // 2. Prepare WhatsApp Text
            let text = `Olá Ghost Camp! ⛺%0A%0AGostaria de locar os seguintes itens:%0A%0A`;
            items.forEach((item) => {
                text += `- ${item.quantity}x *${item.name}* (R$ ${item.price_per_day.toFixed(2)}/dia)%0A`;
            });

            text += `%0A*PERÍODO*: ${rentalDays} diária(s)`;
            text += `%0A*VALOR ESTIMADO*: R$ ${total.toFixed(2)}`;
            text += `%0A*CLIENTE*: ${customerName}`;
            text += `%0A%0APodemos confirmar disponibilidade?`;

            const url = `https://wa.me/${whatsappNumber}?text=${text}`;
            window.open(url, '_blank');

            toast.success('Pedido registrado!', {
                description: 'Você está sendo redirecionado para o WhatsApp para combinar os detalhes.'
            });

        } catch (error) {
            console.error("Erro ao salvar reserva:", error);
            toast.error('Ocorreu um erro ao processar seu pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen pt-28 sm:pt-32 bg-slate-900 px-5 sm:px-6 lg:px-8 pb-20 sm:pb-28">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10 sm:mb-12">
                    <Link
                        href="/catalogo"
                        className="glass p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer magnetic-btn shrink-0"
                        aria-label="Voltar ao catálogo"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500 shrink-0" />
                            Sua Mochila
                        </h1>
                        {items.length > 0 && (
                            <p className="text-slate-400 text-sm mt-1.5">
                                {items.length} {items.length === 1 ? 'item' : 'itens'} selecionados
                            </p>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    /* ── Empty State ──────────────── */
                    <div
                        className="text-center py-20 sm:py-28 glass-card max-w-lg mx-auto"
                        style={{ borderRadius: 'var(--radius-card)' }}
                    >
                        <div className="w-20 h-20 glass rounded-full mx-auto mb-7 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl text-white font-bold mb-4">
                            Sua mochila está vazia
                        </h3>
                        <p className="text-slate-400 mb-10 max-w-md mx-auto font-light leading-relaxed px-6">
                            Volte ao catálogo e escolha os equipamentos ideais para sua próxima aventura.
                        </p>
                        <Link
                            href="/catalogo"
                            className="magnetic-btn slide-bg inline-flex items-center gap-2 bg-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] cursor-pointer"
                        >
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    /* ── Cart + Summary ──────────── */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 rounded-xl overflow-hidden shrink-0">
                                        <Image
                                            src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 80px, 96px"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-3">
                                            <h4 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-tight">
                                                {item.name}
                                            </h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-600 hover:text-red-400 transition-colors p-2 shrink-0 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                                                aria-label={`Remover ${item.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center glass rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center text-white font-semibold text-sm">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="text-orange-400 font-bold text-sm sm:text-base">
                                                R$ {item.price_per_day.toFixed(2)}{' '}
                                                <span className="text-xs text-slate-500">/dia</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="glass-card rounded-2xl p-6 sm:p-7 h-fit lg:sticky lg:top-28">
                            <h3 className="text-lg font-bold text-white mb-6 pb-5 border-b border-white/5">
                                Resumo da Reserva
                            </h3>

                            <div className="space-y-6 mb-8">
                                {/* Rental Days Input */}
                                <div>
                                    <label className="text-sm font-medium text-slate-400 mb-2.5 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                                        Dias de Aventura
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rentalDays}
                                        onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition-colors text-base"
                                        placeholder="Quantos dias?"
                                    />
                                </div>

                                {/* Client Info Form */}
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Seus Dados</h4>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nome completo"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp (ex: 11 99999-9999)"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            required
                                            className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Daily total */}
                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>Valor diário:</span>
                                    <span className="text-slate-200 font-medium">
                                        R$ {(getTotalPrice() / rentalDays).toFixed(2)}
                                    </span>
                                </div>

                                {/* Grand total */}
                                <div className="flex justify-between text-xl font-black text-white pt-5 border-t border-white/5">
                                    <span>Total:</span>
                                    <span className="text-orange-500">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className="magnetic-btn w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.25)] cursor-pointer min-h-[52px] text-base"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" />
                                        Reservar pelo WhatsApp
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-slate-600 mt-5 leading-relaxed px-2 uppercase tracking-tight">
                                Seus dados serão salvos para segurança da reserva e você será encaminhado ao chat.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
