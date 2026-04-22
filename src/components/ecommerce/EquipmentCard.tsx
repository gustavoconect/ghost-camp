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
        <div className="group flex flex-col h-full bg-slate-900/60 border border-slate-700/50 overflow-hidden hover:border-blue-500/40 transition-all duration-300">

            {/* Image Container */}
            <Link href={`/catalogo/${equipment.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={equipment.name}
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=800&auto=format&fit=crop';
                        }}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    />
                </div>
            </Link>

            {/* Content Area */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col">

                {/* Title */}
                <Link href={`/catalogo/${equipment.id}`} className="flex-grow">
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2 hover:text-blue-400 transition-colors min-h-[2rem] sm:min-h-[2.5rem] mb-2">
                        {equipment.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-end gap-1 mb-3">
                    <span className="text-blue-500 font-black text-sm sm:text-lg leading-none">
                        R$ {equipment.price_per_day.toFixed(2)}
                    </span>
                    <span className="text-slate-500 text-[9px] sm:text-[11px] font-bold leading-none mb-0.5">
                        /dia
                    </span>
                </div>

                {/* Button */}
                <button
                    onClick={handleAdd}
                    className={`w-full mt-auto font-bold text-[10px] sm:text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer h-9 sm:h-10 outline-none active:scale-[0.97] ${added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                >
                    {added ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adicionado</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Alugar</span>
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}
