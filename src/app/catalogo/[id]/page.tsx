'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';

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
                // Fetch Main Equipment
                const docRef = doc(db, 'equipments', id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEquipment({ id: docSnap.id, ...docSnap.data() } as Equipment);
                } else {
                    toast.error('Equipamento não encontrado');
                    router.push('/catalogo');
                    return;
                }

                // Fetch Recommended (just pulling a few docs for now)
                const q = query(collection(db, 'equipments'), limit(6));
                const querySnapshot = await getDocs(q);
                const fetchedRecs: Equipment[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (doc.id !== id && data.is_active !== false) {
                        fetchedRecs.push({ id: doc.id, ...data } as Equipment);
                    }
                });

                // Keep max 4
                setRecommended(fetchedRecs.slice(0, 4));

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
            <div className="min-h-screen flex items-center justify-center bg-[#050510]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!equipment) return null;

    const images = equipment.image_urls && equipment.image_urls.length > 0
        ? equipment.image_urls
        : ['https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'];

    return (
        <main className="min-h-screen bg-[#050510] px-5 sm:px-6 lg:px-8 pb-20 sm:pb-32">
            {/* Forced spacer for fixed navbar */}
            <div style={{ height: '100px', width: '100%' }} aria-hidden="true" />
            <div className="max-w-[1200px] mx-auto">
                {/* Back Button */}
                <div className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-3 text-slate-400 hover:text-white transition-colors group cursor-pointer font-medium"
                    >
                        <div className="p-2 bg-slate-800/50 rounded-full group-hover:bg-blue-600 transition-colors">
                            <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors" />
                        </div>
                        Voltar
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Visual Side */}
                    <div className="space-y-6">
                        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={images[activeImage]}
                                alt={equipment.name}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=800&auto=format&fit=crop';
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative aspect-square rounded-xl overflow-hidden bg-black cursor-pointer border transition-all ${activeImage === idx ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`${equipment.name} ${idx}`} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=200&auto=format&fit=crop'; }} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider mb-5">
                                Equipamento Premium
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                                {equipment.name}
                            </h1>
                            <p className="text-4xl font-black text-blue-500 flex items-baseline gap-2">
                                R$ {equipment.price_per_day.toFixed(2)}
                                <span className="text-slate-500 text-lg font-bold uppercase tracking-widest">/dia</span>
                            </p>
                        </div>

                        <div className="prose prose-invert max-w-none mb-10">
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                {equipment.description}
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Higienizado</p>
                                    <p className="text-slate-500 text-xs font-medium">Limpeza profissional</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Pronta Entrega</p>
                                    <p className="text-slate-500 text-xs font-medium">Disponível em 24h</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto pt-8 border-t border-slate-800">
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer outline-none ${adding
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                                    : 'bg-white text-black hover:bg-blue-600 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]'
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
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recommended Section */}
                {recommended.length > 0 && (
                    <div className="mt-24 sm:mt-32 pt-16 border-t border-slate-800/50">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
                                    Completando sua Aventura
                                </h2>
                                <p className="text-slate-400 font-medium">Outros aventureiros costumam alugar junto</p>
                            </div>
                            <Link href="/catalogo" className="text-blue-500 font-bold hover:text-blue-400 transition-colors flex items-center gap-2 group">
                                Ver todo catálogo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {recommended.map(eq => (
                                <EquipmentCard key={eq.id} equipment={eq} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
