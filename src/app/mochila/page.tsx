'use client';

import { useCartStore } from '@/store/useCartStore';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowLeft,
    Calendar as CalendarIcon,
    MessageCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';

export default function CartPage() {
    const {
        items,
        rentalDays,
        removeItem,
        updateQuantity,
        setRentalDays,
        getTotalPrice,
        clearCart
    } = useCartStore();

    const [mounted, setMounted] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        setMounted(true);
        async function fetchSettings() {
            try {
                const docRef = doc(db, 'site_settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as SiteSettings);
                }
            } catch (error) {
                console.error("Erro ao buscar configurações:", error);
            }
        }
        fetchSettings();
    }, []);

    if (!mounted) return null;

    const handleCheckout = async () => {
        if (items.length === 0) {
            toast.error('Sua mochila está vazia!');
            return;
        }

        if (!customerName.trim() || !customerPhone.trim()) {
            toast.error('Por favor, preencha seu nome e telefone.');
            return;
        }

        setIsSubmitting(true);

        try {
            const bookingData = {
                customer_name: customerName,
                customer_phone: customerPhone,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price_per_day
                })),
                rental_days: rentalDays,
                total_value: getTotalPrice(),
                status: 'pending',
                created_at: new Date().toISOString()
            };

            await addDoc(collection(db, 'bookings'), bookingData);

            let message = `*NOVA RESERVA - GHOST CAMP*\n\n`;
            message += `*Cliente:* ${customerName}\n`;
            message += `*Contato:* ${customerPhone}\n`;
            message += `*Período:* ${rentalDays} diária(s)\n\n`;
            message += `*Itens Solicitados:*\n`;

            items.forEach(item => {
                message += `• ${item.quantity}x ${item.name} - R$ ${(item.price_per_day * item.quantity * rentalDays).toFixed(2)}\n`;
            });

            message += `\n*TOTAL:* R$ ${getTotalPrice().toFixed(2)}\n\n`;
            message += `Olá! Gostaria de confirmar a disponibilidade para essas datas.`;

            const encodedMessage = encodeURIComponent(message);
            const rawPhone = settings?.whatsapp_number || '5511982703261';
            const cleanNumber = rawPhone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

            toast.success('Pedido criado com sucesso! Redirecionando...');
            clearCart();

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);

        } catch (error) {
            console.error("Erro ao salvar reserva:", error);
            toast.error('Ocorreu um erro ao processar seu pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-black w-full pt-24 sm:pt-28">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-20">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10 sm:mb-12">
                        <Link
                            href="/catalogo"
                            className="p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0 border border-zinc-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Voltar ao catálogo"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-300" />
                        </Link>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Sua Mochila</h1>
                            <p className="text-zinc-400 text-sm mt-1">Revise seus itens e finalize sua pré-reserva.</p>
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="border border-zinc-800 bg-zinc-950/40 rounded-3xl p-12 sm:p-20 text-center max-w-xl mx-auto">
                            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-zinc-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Sua mochila está vazia</h2>
                            <p className="text-zinc-400 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                                Explore nosso catálogo de equipamentos e comece a planejar sua expedição.
                            </p>
                            <Link
                                href="/catalogo"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-xl min-h-[48px]"
                            >
                                Explorar Catálogo
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 lg:gap-12">
                            {/* Items List */}
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 border border-zinc-800 bg-zinc-900/60 rounded-2xl"
                                    >
                                        {/* Item Image */}
                                        <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                                            <Image
                                                src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=600&auto=format&fit=crop'}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 112px, 160px"
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex flex-col justify-between flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h3 className="font-bold text-white text-lg sm:text-xl line-clamp-2 leading-snug">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-zinc-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                                                        R$ {item.price_per_day.toFixed(2)} / dia
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                                                    aria-label={`Remover ${item.name} da mochila`}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-auto">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                        aria-label={`Diminuir quantidade de ${item.name}`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-bold text-white w-6 text-center text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                                        aria-label={`Aumentar quantidade de ${item.name}`}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-zinc-400 text-xs mb-0.5 uppercase tracking-wide font-medium">Subtotal</p>
                                                    <p className="text-white font-black text-lg sm:text-xl">
                                                        R$ {(item.price_per_day * item.quantity * rentalDays).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Panel */}
                            <div className="border border-zinc-800 bg-zinc-950/80 rounded-2xl p-6 sm:p-8 lg:p-10 shrink-0 flex flex-col h-max lg:sticky lg:top-32">
                                <h2 className="text-2xl font-black text-white mb-8 border-b border-zinc-800 pb-6">
                                    Resumo da Reserva
                                </h2>

                                <div className="space-y-8 mb-10 flex-1">
                                    {/* Rental Days Input */}
                                    <div>
                                        <label htmlFor="rental-days" className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-2">
                                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                                            Dias de Aventura
                                        </label>
                                        <input
                                            id="rental-days"
                                            type="number"
                                            min="1"
                                            value={rentalDays}
                                            onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                                            className="w-full min-h-[48px] bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-3 text-lg focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                            placeholder="Quantos dias?"
                                        />
                                    </div>

                                    {/* Client Info Form */}
                                    <div className="space-y-5 pt-8 border-t border-zinc-800">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2">Seus Dados</h3>
                                        <div>
                                            <label htmlFor="customer-name" className="sr-only">Nome completo</label>
                                            <input
                                                id="customer-name"
                                                type="text"
                                                placeholder="Nome completo"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                required
                                                className="w-full min-h-[48px] bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-3 text-base focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="customer-phone" className="sr-only">WhatsApp</label>
                                            <input
                                                id="customer-phone"
                                                type="tel"
                                                placeholder="WhatsApp (ex: 11 99999-9999)"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                required
                                                className="w-full min-h-[48px] bg-zinc-900 border border-zinc-800 text-white rounded-xl px-5 py-3 text-base focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Summary calculations */}
                                    <div className="pt-8 border-t border-zinc-800 space-y-4">
                                        <div className="flex justify-between text-base text-zinc-300">
                                            <span>Valor diário total</span>
                                            <span className="text-white font-medium">
                                                R$ {(getTotalPrice() / rentalDays).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Grand total */}
                                        <div className="flex justify-between items-end text-3xl md:text-4xl font-black text-white pt-2">
                                            <span className="text-zinc-400 text-xl font-bold">Total</span>
                                            <span className="text-blue-400">R$ {getTotalPrice().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp CTA */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    className="w-full min-h-[56px] py-4 bg-[#25D366] hover:bg-[#1ebc59] text-black font-black rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-auto cursor-pointer"
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

                                <p className="text-sm text-center text-zinc-400 mt-6 leading-relaxed">
                                    Você será redirecionado para a nossa equipe fechar as datas do seu pedido.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
