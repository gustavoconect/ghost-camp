'use client';

import { Equipment } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);

    const imageUrl = equipment.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop';

    const handleAdd = () => {
        addItem(equipment);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                    src={imageUrl}
                    alt={equipment.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded-full">
                    <span className="text-orange-400 font-black text-sm">
                        R$ {equipment.price_per_day.toFixed(2)}
                        <span className="text-slate-400 font-normal text-xs"> /dia</span>
                    </span>
                </div>

                {/* Name on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                        {equipment.name}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col gap-4">
                <p className="text-slate-400 text-sm line-clamp-2 flex-grow font-light leading-relaxed">
                    {equipment.description}
                </p>

                <button
                    onClick={handleAdd}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${added
                            ? 'bg-emerald-600 text-white scale-[0.98]'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 hover:shadow-[0_0_20px_rgba(234,88,12,0.3)]'
                        }`}
                >
                    {added ? (
                        <>
                            <Check className="w-5 h-5" />
                            Adicionado!
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5" />
                            Adicionar à Viagem
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
