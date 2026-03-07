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
        <main className="min-h-screen bg-black px-5 sm:px-6 lg:px-8 pb-20 sm:pb-28">
            {/* Espaçador OBRIGATÓRIO (100px) para compensar a Navbar fixa em todas as telas */}
            <div style={{ height: '100px', flexShrink: 0 }} aria-hidden="true" />
            <style dangerouslySetInnerHTML={{
                __html: `
                .mochila-container {
                    width: 100%;
                    max-width: 1450px; /* Aumentado drasticamente o limite Desktop */
                    margin: 0 auto;
                }
                .mochila-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px;
                }
                @media (min-width: 1024px) {
                    .mochila-grid {
                        /* Coluna da esquerda pega o espaço que sobrar, resumo amarrado em 450px (bem largo) */
                        grid-template-columns: 1fr 450px; 
                        gap: 48px;
                    }
                }
                .produto-card {
                    display: flex;
                    gap: 24px;
                    padding: 24px;
                    border: 1px solid #27272a;
                    background-color: #09090b;
                    border-radius: 16px;
                }
                .produto-img-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(39, 39, 42, 0.5);
                    background-color: #18181b;
                }
                /* Em monitores maiores o item cresce mais */
                @media (min-width: 640px) {
                    .produto-img-wrapper { width: 160px; height: 160px; }
                }
                @media (min-width: 1024px) {
                    .produto-img-wrapper { width: 180px; height: 180px; }
                    .produto-card { padding: 32px; gap: 32px; }
                }
            `}} />

            <div className="mochila-container">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10 sm:mb-12">
                    <Link
                        href="/catalogo"
                        className="p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0 border border-zinc-800"
                        aria-label="Voltar ao catálogo"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-300" />
                    </Link>
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white flex items-center gap-4 tracking-tight">
                            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0" />
                            Sua Mochila
                        </h1>
                        {items.length > 0 && (
                            <p className="text-zinc-400 text-base mt-2">
                                {items.length} {items.length === 1 ? 'item' : 'itens'} selecionados
                            </p>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    /* ── Empty State ──────────────── */
                    <div className="text-center py-24 sm:py-32 border border-zinc-800 bg-zinc-950/50 rounded-2xl max-w-3xl mx-auto mt-10">
                        <div className="w-24 h-24 bg-zinc-900 rounded-full mx-auto mb-7 flex items-center justify-center border border-zinc-800">
                            <ShoppingBag className="w-10 h-10 text-zinc-500" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white font-black mb-5 tracking-tight">
                            Sua mochila está vazia
                        </h3>
                        <p className="text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed px-6 text-lg">
                            Dê espaço para o equipamento certo e garanta segurança na sua próxima aventura.
                        </p>
                        <Link
                            href="/catalogo"
                            className="inline-flex items-center justify-center bg-white text-black hover:bg-zinc-200 font-bold transition-colors cursor-pointer shrink-0 rounded-xl"
                            style={{ padding: '16px 40px', fontSize: '1.1rem' }}
                        >
                            Explorar Equipamentos
                        </Link>
                    </div>
                ) : (
                    /* ── Cart + Summary ──────────── */
                    <div className="mochila-grid">

                        {/* Items List */}
                        <div className="flex flex-col gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="produto-card">
                                    {/* Image */}
                                    <div className="produto-img-wrapper">
                                        <Image
                                            src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 180px"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                                                {item.name}
                                            </h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-zinc-500 hover:text-red-500 transition-colors shrink-0 p-2 -mr-2"
                                                aria-label={`Remover ${item.name}`}
                                            >
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-6">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-zinc-800 bg-zinc-900/80 rounded-lg h-12">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <span className="w-10 text-center text-white font-bold text-base">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-zinc-400 text-sm mb-1 uppercase tracking-wide font-medium">Valor diário</p>
                                                <p className="text-white font-black text-xl lg:text-2xl">
                                                    R$ {item.price_per_day.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="border border-zinc-800 bg-zinc-950/80 rounded-2xl p-6 sm:p-8 lg:p-10 shrink-0 flex flex-col h-max lg:sticky lg:top-32">
                            <h3 className="text-2xl font-black text-white mb-8 border-b border-zinc-800 pb-6">
                                Resumo da Reserva
                            </h3>

                            <div className="space-y-8 mb-10 flex-1">
                                {/* Rental Days Input */}
                                <div>
                                    <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-zinc-500" />
                                        Dias de Aventura
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rentalDays}
                                        onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-4 text-lg focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                        placeholder="Quantos dias?"
                                    />
                                </div>

                                {/* Client Info Form */}
                                <div className="space-y-5 pt-8 border-t border-zinc-800">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">Seus Dados</h4>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nome completo"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-4 text-base focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp (ex: 11 99999-9999)"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            required
                                            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-4 text-base focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Summary calculations */}
                                <div className="pt-8 border-t border-zinc-800 space-y-4">
                                    <div className="flex justify-between text-base text-zinc-400">
                                        <span>Valor diário (Todos)</span>
                                        <span className="text-zinc-300 font-medium">
                                            R$ {(getTotalPrice() / rentalDays).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Grand total */}
                                    <div className="flex justify-between items-end text-3xl md:text-4xl font-black text-white pt-2">
                                        <span className="text-zinc-500 text-xl font-bold">Total</span>
                                        <span>R$ {getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp CTA */}
                            <button
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className="w-full bg-[#25D366] hover:bg-[#1ebc59] text-black font-black rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                                style={{ padding: '20px' }}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                                ) : (
                                    <>
                                        <MessageCircle className="w-6 h-6" />
                                        <span className="text-lg">Reservar pelo WhatsApp</span>
                                    </>
                                )}
                            </button>

                            <p className="text-sm text-center text-zinc-500 mt-6 leading-relaxed">
                                Você será redirecionado para a nossa equipe fechar as datas do seu pedido.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
