'use client';

import { useCartStore } from '@/store/useCartStore';
import { Trash2, Calendar as CalendarIcon, MessageCircle, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MochilaCheckout() {
    const { items, rentalDays, removeItem, updateQuantity, getTotalPrice, setRentalDays } = useCartStore();
    const [whatsappNumber, setWhatsappNumber] = useState('5511982703261'); // Fallback provisório

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
        // Constrói O Carrinho Textual Formatado
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
                <h1 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
                    Sua Mochila <span className="text-orange-500">[{items.length}]</span>
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <span className="text-4xl">🎒</span>
                        </div>
                        <h3 className="text-2xl text-white font-bold mb-4">Sua mochila está vazia</h3>
                        <p className="text-slate-400 mb-8">Volte ao catálogo e escolha os seus equipamentos para aventura.</p>
                        <Link
                            href="/catalogo"
                            className="inline-block bg-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-500 transition-colors"
                        >
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de Itens */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-slate-800 rounded-xl p-4 flex gap-4 border border-slate-700/50">
                                    <div className="w-24 h-24 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-lg font-bold text-white line-clamp-2">{item.name}</h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 text-slate-400 hover:text-white"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 text-slate-400 hover:text-white"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-orange-500 font-bold">R$ {item.price_per_day.toFixed(2)} <span className="text-xs text-slate-400">/dia</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Painel de Resumo / Checkout */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700/50 h-fit sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Resumo da Reserva</h3>

                            <div className="space-y-4 mb-6">
                                {/* Input de Quantidade de Dias Simplificado (Poderia ser React-Datepicker no futuro, mas input number é mais fluido em MVP mobile) */}
                                <div>
                                    <label className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" /> Dias de Aventura
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={rentalDays}
                                        onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        placeholder="Quantos dias de acampamento?"
                                    />
                                </div>

                                <div className="flex justify-between text-slate-300">
                                    <span>Equipamentos:</span>
                                    <span>R$ {(getTotalPrice() / rentalDays).toFixed(2)} / dia</span>
                                </div>
                                {/* Neste mock momentaneo consideraremos 1 dia ja que nao mockamos a view o startDate no state */}
                                <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-slate-700">
                                    <span>Total Estimado:</span>
                                    <span className="text-orange-500">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                            >
                                <MessageCircle className="w-6 h-6" />
                                Reservar pelo WhatsApp
                            </button>

                            <p className="text-xs text-center text-slate-500 mt-4">
                                O pagamento não será cobrado agora. Ao clicar você falará direto com nossa equipe.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
