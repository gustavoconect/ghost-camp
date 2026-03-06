'use client';

import { Equipment } from '@/types';
import { useCartStore } from '@/store/useCartStore';

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
    const addItem = useCartStore((state) => state.addItem);

    // Fallback caso nao tenha imagem
    const imageUrl = equipment.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop';

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 group flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                    src={imageUrl}
                    alt={equipment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 truncate">{equipment.name}</h3>
                    <p className="text-orange-500 font-black text-lg">R$ {equipment.price_per_day.toFixed(2)} <span className="text-sm font-normal text-slate-400">/dia</span></p>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {equipment.description}
                </p>

                <button
                    onClick={() => addItem(equipment)}
                    className="w-full py-3 bg-slate-700 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Adicionar à Viagem
                </button>
            </div>
        </div>
    );
}
