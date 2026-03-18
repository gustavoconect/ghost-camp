'use client';

import { Equipment } from '@/types';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);

    const imageUrl = equipment.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop';

    const [isTouched, setIsTouched] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(equipment);
        setAdded(true);
        toast.success(`${equipment.name} adicionado à mochila!`, {
            description: 'Você pode ver seus itens clicando no ícone da mochila.',
        });
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group flex flex-col h-full bg-[#05050A] border border-slate-800/80 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]">

            {/* Image Container with Hover/Touch Overlay */}
            <div
                className="relative aspect-[4/3] w-full overflow-hidden bg-black shrink-0 cursor-pointer"
                onClick={() => setIsTouched(!isTouched)}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={equipment.name}
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=800&auto=format&fit=crop';
                    }}
                    className={`w-full h-full object-cover transition-all duration-500 ease-out ${isTouched ? 'scale-110 blur-sm brightness-[0.3]' : 'group-hover:scale-105 group-hover:blur-sm group-hover:brightness-[0.3]'}`}
                />

                {/* Overlay Content: Description + Ver Detalhes */}
                <div className={`absolute inset-0 p-4 sm:p-6 flex flex-col justify-center items-center text-center transition-all duration-300 ${isTouched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                    <p className="text-white text-sm sm:text-base font-medium leading-relaxed drop-shadow-md mb-6 line-clamp-4">
                        {equipment.description}
                    </p>
                    <Link
                        href={`/catalogo/${equipment.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-full border border-blue-400/30 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2"
                    >
                        Ver detalhes
                    </Link>
                </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col flex-grow bg-[#050510] relative z-10 transition-colors duration-300">

                {/* Always visible: Title */}
                <Link href={`/catalogo/${equipment.id}`}>
                    <h3 className="text-lg font-black text-white leading-snug mb-3 hover:text-blue-400 transition-colors line-clamp-2">
                        {equipment.name}
                    </h3>
                </Link>

                {/* Always visible: Price */}
                <div className="flex items-center gap-2 mb-5">
                    <span className="text-blue-500 font-black text-xl">R$ {equipment.price_per_day.toFixed(2)}</span>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/dia</span>
                </div>

                {/* Button - Always visible at bottom */}
                <div className="mt-auto pt-4 border-t border-slate-800/50">
                    <button
                        onClick={handleAdd}
                        className={`w-full font-bold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer rounded-lg h-[52px] shrink-0 outline-none ${added
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                            : 'bg-white text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                            }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-5 h-5 animate-in zoom-in duration-300" />
                                Adicionado!
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                                Adicionar à mochila
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
