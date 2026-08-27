'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import Image from 'next/image';

import {
    ArrowLeft,
    ShoppingBag,
    Check,
    ShieldCheck,
    Truck,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { EquipmentCard } from '@/components/ecommerce/EquipmentCard';

export default function EquipmentDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [recommended, setRecommended] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [adding, setAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            try {
                const docRef = doc(db, 'equipments', id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEquipment({ id: docSnap.id, ...docSnap.data() } as Equipment);
                } else {
                    toast.error('Equipamento não encontrado');
                    router.push('/catalogo');
                    return;
                }

                const q = query(collection(db, 'equipments'), limit(12));
                const querySnapshot = await getDocs(q);
                const fetchedRecs: Equipment[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (doc.id !== id && data.is_active !== false) {
                        fetchedRecs.push({ id: doc.id, ...data } as Equipment);
                    }
                });

                setRecommended(fetchedRecs.slice(0, 8));

            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
                toast.error('Erro ao carregar detalhes');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
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
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!equipment) return null;

    const images = equipment.image_urls && equipment.image_urls.length > 0
        ? equipment.image_urls
        : ['https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'];

    return (
        <main className="min-h-screen bg-black w-full pt-24 sm:pt-28">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-20 sm:pb-32">
                    {/* Back Button */}
                    <div className="mb-10">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-3 text-slate-300 hover:text-white transition-colors group cursor-pointer font-medium min-h-[44px]"
                        >
                            <div className="p-2.5 bg-slate-800/80 group-hover:bg-blue-600 rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
                            </div>
                            <span>Voltar ao catálogo</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Visual Side */}
                        <div className="space-y-6">
                            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl">
                                <Image
                                    src={images[activeImage]}
                                    alt={equipment.name}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>

                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            aria-label={`Ver foto ${idx + 1} de ${equipment.name}`}
                                            className={`relative aspect-square overflow-hidden bg-slate-900 cursor-pointer border rounded-xl transition-all min-h-[44px] ${activeImage === idx ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${equipment.name} miniatura ${idx + 1}`}
                                                fill
                                                sizes="120px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Side */}
                        <div className="flex flex-col">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-5 rounded-full">
                                    Equipamento Premium
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                                    {equipment.name}
                                </h1>
                                <p className="text-4xl font-black text-blue-500 flex items-baseline gap-2">
                                    R$ {equipment.price_per_day.toFixed(2)}
                                    <span className="text-slate-400 text-lg font-bold uppercase tracking-widest">/dia</span>
                                </p>
                            </div>

                            <div className="relative mb-10">
                                <div className="max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {equipment.description}
                                    </p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Higienizado</p>
                                        <p className="text-slate-400 text-xs font-medium">Limpeza profissional</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Pronta Entrega</p>
                                        <p className="text-slate-400 text-xs font-medium">Disponível em 24h</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="mt-auto pt-8 border-t border-slate-800">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={adding}
                                    aria-label={`Adicionar ${equipment.name} à mochila`}
                                    className={`w-full py-5 min-h-[56px] font-black text-lg sm:text-xl rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer outline-none ${adding
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                        : 'bg-white text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]'
                                        }`}
                                >
                                    {adding ? (
                                        <>
                                            <Check className="w-6 h-6" />
                                            ITEM ADICIONADO!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-6 h-6" />
                                            ADICIONAR À MOCHILA
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Section */}
                    {recommended.length > 0 && (
                        <div className="mt-20 sm:mt-28 pt-12 border-t border-slate-800/60">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight">
                                        Completando sua Aventura
                                    </h2>
                                    <p className="text-slate-300 text-sm font-medium">Outros aventureiros costumam alugar junto</p>
                                </div>
                                <Link href="/catalogo" className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors flex items-center gap-2 group shrink-0 min-h-[44px]">
                                    Ver todo catálogo
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Horizontal scroll carousel */}
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
                                {recommended.map(eq => (
                                    <div key={eq.id} className="w-[calc(33.333%-8px)] min-w-[160px] max-w-[220px] shrink-0">
                                        <EquipmentCard equipment={eq} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
