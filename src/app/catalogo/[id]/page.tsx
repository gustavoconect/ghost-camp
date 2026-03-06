'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import Image from 'next/image';
import {
    ChevronLeft,
    ShoppingBag,
    Check,
    ShieldCheck,
    RefreshCw,
    Truck,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function EquipmentDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [adding, setAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchEquipment() {
            if (!id) return;
            try {
                const docRef = doc(db, 'equipments', id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEquipment({ id: docSnap.id, ...docSnap.data() } as Equipment);
                } else {
                    toast.error('Equipamento não encontrado');
                    router.push('/catalogo');
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
                toast.error('Erro ao carregar detalhes');
            } finally {
                setLoading(false);
            }
        }
        fetchEquipment();
    }, [id, router]);

    const handleAddToCart = () => {
        if (!equipment) return;
        setAdding(true);
        addItem(equipment);
        toast.success('Mochila atualizada!', {
            description: `${equipment.name} foi adicionado com sucesso.`,
            action: {
                label: 'Ver Mochila',
                onClick: () => router.push('/mochila')
            }
        });
        setTimeout(() => setAdding(false), 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!equipment) return null;

    const images = equipment.image_urls.length > 0
        ? equipment.image_urls
        : ['https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'];

    return (
        <main className="min-h-screen pt-28 sm:pt-32 bg-slate-900 px-5 sm:px-6 lg:px-8 pb-20 sm:pb-32">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Voltar ao catálogo
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Visual Side */}
                    <div className="space-y-6">
                        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden glass border border-white/5 shadow-2xl">
                            <Image
                                src={images[activeImage]}
                                alt={equipment.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-xl overflow-hidden glass border transition-all ${activeImage === idx ? 'border-orange-500 scale-95 ring-2 ring-orange-500/20' : 'border-white/5 opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img} alt={`${equipment.name} ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider mb-4">
                                Equipamento Original
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {equipment.name}
                            </h1>
                            <p className="text-3xl font-black text-orange-500 flex items-baseline gap-2">
                                R$ {equipment.price_per_day.toFixed(2)}
                                <span className="text-slate-500 text-lg font-normal">/diária</span>
                            </p>
                        </div>

                        <div className="prose prose-invert max-w-none mb-10">
                            <p className="text-slate-400 text-lg leading-relaxed font-light">
                                {equipment.description}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="glass p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Higienizado</p>
                                    <p className="text-slate-500 text-xs">Limpeza profissional</p>
                                </div>
                            </div>
                            <div className="glass p-4 rounded-2xl flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Pronta Entrega</p>
                                    <p className="text-slate-500 text-xs">Retirada em 24h</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto pt-8 border-t border-white/5">
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className={`magnetic-btn slide-bg group w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl cursor-pointer ${adding
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-orange-600 text-white hover:bg-orange-500 hover:shadow-orange-900/40'
                                    }`}
                            >
                                {adding ? (
                                    <>
                                        <Check className="w-6 h-6 animate-in zoom-in" />
                                        ITEM ADICIONADO!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-6 h-6" />
                                        ADICIONAR À MOCHILA
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-slate-500 text-sm mt-4 font-light">
                                Verifique a disponibilidade para suas datas no checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
