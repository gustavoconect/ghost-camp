'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import { EquipmentCard } from '@/components/ecommerce/EquipmentCard';
import { Compass, Loader2 } from 'lucide-react';

export default function Catalog() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEquipments() {
            try {
                const q = query(collection(db, 'equipments'), where('is_active', '==', true));
                const querySnapshot = await getDocs(q);
                const fetchedItems: Equipment[] = [];

                querySnapshot.forEach((doc) => {
                    fetchedItems.push({ id: doc.id, ...doc.data() } as Equipment);
                });

                setEquipments(fetchedItems);
            } catch (error) {
                console.error("Erro ao buscar equipamentos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEquipments();
    }, []);

    return (
        <main className="min-h-screen pt-24 bg-slate-900 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 mt-8">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-4">
                        <Compass className="w-10 h-10 text-orange-500" />
                        Catálogo <span className="text-orange-500">Oficial</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Todos os nossos equipamentos passam por uma revisão rigorosa após cada uso.
                        Aventure-se com segurança.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-orange-500">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="text-slate-400 font-medium">Buscando equipamentos...</p>
                    </div>
                ) : equipments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <h3 className="text-2xl text-white font-bold mb-2">Catálogo em atualização</h3>
                        <p className="text-slate-400">Retorne em breve para ver novos equipamentos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {equipments.map((eq) => (
                            <EquipmentCard key={eq.id} equipment={eq} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
