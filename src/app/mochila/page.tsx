'use client';

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Calendar as CalendarIcon, MessageCircle, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MochilaCheckout() {
    const { items, rentalDays, removeItem, updateQuantity, getTotalPrice, setRentalDays } = useCartStore();
    const [whatsappNumber, setWhatsappNumber] = useState('5511982703261');

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

    const handleCheckout = () => {
        let text = `Olá Ghost Camp! ⛺%0A%0AGostaria de locar os seguintes itens:%0A%0A`;

        items.forEach((item) => {
            text += `- ${item.quantity}x *${item.name}* (R$ ${item.price_per_day.toFixed(2)}/dia)%0A`;
        });

        const total = getTotalPrice();

        text += `%0A*PERÍODO*: ${rentalDays} diária(s)`;
        text += `%0A*VALOR ESTIMADO*: R$ ${total.toFixed(2)}`;
        text += `%0A%0APodemos confirmar disponibilidade?`;

        const url = `https://wa.me/${whatsappNumber}?text=${text}`;
        window.open(url, '_blank');
    };

    return (
        <main className="min-h-screen pt-28 bg-slate-900 px-4 pb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/catalogo" className="glass p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </Link>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-orange-500" />
                            Sua Mochila
                        </h1>
                        {items.length > 0 && (
                            <p className="text-slate-400 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'itens'} selecionados</p>
                        )}
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-3xl">
                        <div className="w-20 h-20 glass rounded-full mx-auto mb-6 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl text-white font-bold mb-3">Sua mochila está vazia</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto font-light">
                            Volte ao catálogo e escolha os equipamentos ideais para sua próxima aventura.
                        </p>
                        <Link
                            href="/catalogo"
                            className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-orange-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] cursor-pointer"
                        >
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de Itens */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="glass-card rounded-2xl p-4 flex gap-4">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 rounded-xl overflow-hidden shrink-0">
                                        <img
                                            src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-tight">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-600 hover:text-red-400 transition-colors p-1.5 shrink-0 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-3">
                                            <div className="flex items-center glass rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-orange-400 font-bold text-sm sm:text-base">
                                                R$ {item.price_per_day.toFixed(2)} <span className="text-xs text-slate-500">/dia</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Painel de Resumo / Checkout */}
                        <div className="glass-card rounded-2xl p-6 h-fit sticky top-24">
                            <h3 className="text-lg font-bold text-white mb-5 pb-4 border-b border-white/5">
                                Resumo da Reserva
                            </h3>

                            <div className="space-y-5 mb-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                                        Dias de Aventura
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rentalDays}
                                        onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition-colors"
                                        placeholder="Quantos dias?"
                                    />
                                </div>

                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>Valor diário:</span>
                                    <span className="text-slate-200">R$ {(getTotalPrice() / rentalDays).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-white/5">
                                    <span>Total:</span>
                                    <span className="text-orange-500">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.25)] cursor-pointer"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Reservar pelo WhatsApp
                            </button>

                            <p className="text-[11px] text-center text-slate-600 mt-4 leading-relaxed">
                                Nenhum pagamento será cobrado agora. Ao clicar, você falará diretamente com nossa equipe via WhatsApp.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
