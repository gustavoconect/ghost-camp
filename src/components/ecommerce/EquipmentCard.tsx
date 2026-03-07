'use client';

import { Equipment } from '@/types';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Check, Eye } from 'lucide-react';
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
        <div
            className="glass-card overflow-hidden group flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
            style={{ borderRadius: 'var(--radius-card)' }}
        >
            <Link href={`/catalogo/${equipment.id}`} className="block relative aspect-[4/3] overflow-hidden bg-black">
                {/* Image */}
                <Image
                    src={imageUrl}
                    alt={equipment.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />

                {/* View Details Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="bg-white text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-2xl">
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                    </div>
                </div>

                {/* Price Badge */}
                <div
                    className="absolute top-3 right-3 glass rounded-full z-10 shadow-xl flex items-center justify-center w-max border border-white/10 pointer-events-none shrink-0"
                    style={{ padding: '8px 16px' }}
                >
                    <span className="text-blue-400 font-bold text-sm whitespace-nowrap leading-none">
                        R$ {equipment.price_per_day.toFixed(2)}
                        <span className="text-slate-300 font-medium text-xs ml-1 leading-none">/dia</span>
                    </span>
                </div>

                {/* Name on Image */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                        {equipment.name}
                    </h3>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col gap-4">
                <p className="text-slate-400 text-sm line-clamp-2 flex-grow font-light leading-relaxed">
                    {equipment.description}
                </p>

                <button
                    onClick={handleAdd}
                    className={`magnetic-btn slide-bg w-full leading-normal rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer min-h-[48px] shrink-0 whitespace-nowrap ${added
                        ? 'bg-emerald-600 text-white scale-[0.98]'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        }`}
                    style={{ padding: '12px 24px' }}
                >
                    {added ? (
                        <>
                            <Check className="w-5 h-5 animate-in zoom-in duration-300" />
                            Adicionado!
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5" />
                            Adicionar à mochila
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
