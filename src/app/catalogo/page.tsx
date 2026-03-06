'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import { EquipmentCard } from '@/components/ecommerce/EquipmentCard';
import { Compass, Loader2, Search } from 'lucide-react';

export default function Catalog() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filtered = equipments.filter((eq) =>
        eq.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen pt-24 bg-slate-900 px-4 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <Compass className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium text-slate-200">Catálogo Oficial</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Equipamentos <span className="text-orange-500">Premium</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-light">
                        Todos os nossos equipamentos passam por revisão rigorosa após cada uso. Aventure-se com segurança.
                    </p>
                </div>

                {/* Search */}
                {!loading && equipments.length > 0 && (
                    <div className="max-w-md mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar equipamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full glass pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none border-0 transition-all"
                            />
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="glass p-6 rounded-full mb-4">
                            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                        </div>
                        <p className="text-slate-400 font-medium">Buscando equipamentos...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 glass-card rounded-3xl">
                        <h3 className="text-2xl text-white font-bold mb-2">
                            {searchTerm ? 'Nenhum resultado' : 'Catálogo em atualização'}
                        </h3>
                        <p className="text-slate-400">
                            {searchTerm
                                ? `Nenhum equipamento encontrado para "${searchTerm}".`
                                : 'Retorne em breve para ver novos equipamentos.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-slate-500 text-sm mb-6">{filtered.length} {filtered.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((eq) => (
                                <EquipmentCard key={eq.id} equipment={eq} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
