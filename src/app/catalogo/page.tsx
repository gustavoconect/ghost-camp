'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment, Category } from '@/types';
import { EquipmentCard } from '@/components/ecommerce/EquipmentCard';
import { Compass, Loader2, Search, PackageX, Filter, ChevronDown } from 'lucide-react';

export default function Catalog() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Categories
                const catSnapshot = await getDocs(collection(db, 'categories'));
                const catList: Category[] = [];
                catSnapshot.forEach(doc => catList.push({ id: doc.id, ...doc.data() } as Category));
                setCategories(catList);

                // Fetch Equipments
                const q = query(collection(db, 'equipments'), where('is_active', '==', true));
                const querySnapshot = await getDocs(q);
                const fetchedItems: Equipment[] = [];

                querySnapshot.forEach((doc) => {
                    fetchedItems.push({ id: doc.id, ...doc.data() } as Equipment);
                });

                setEquipments(fetchedItems);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const filteredAndSorted = useMemo(() => {
        let result = equipments.filter((eq) => {
            const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || eq.category_id === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price_per_day - b.price_per_day);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price_per_day - a.price_per_day);
        }

        return result;
    }, [equipments, searchTerm, selectedCategory, sortBy]);

    return (
        <main className="min-h-screen pt-28 sm:pt-32 bg-slate-900 px-5 sm:px-6 lg:px-8 pb-20 sm:pb-28">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10 sm:mb-12 mt-4 sm:mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <Compass className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium text-slate-200">Catálogo Oficial</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
                        Equipamentos{' '}
                        <span className="text-orange-500">Premium</span>
                    </h1>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar equipamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full glass pl-12 pr-4 py-3.5 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:outline-none border-0 transition-all text-sm"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                            <div className="relative shrink-0">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="appearance-none glass pl-4 pr-10 py-3 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 border-0 cursor-pointer"
                                >
                                    <option value="default">Relevância</option>
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all shrink-0 border ${selectedCategory === 'all'
                                        ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20'
                                        : 'glass border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all shrink-0 border ${selectedCategory === cat.id
                                            ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20'
                                            : 'glass border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 sm:py-32">
                        <div className="glass p-6 rounded-full mb-5">
                            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                        </div>
                        <p className="text-slate-400 font-medium animate-pulse">Buscando equipamentos...</p>
                    </div>
                ) : filteredAndSorted.length === 0 ? (
                    <div className="text-center py-20 sm:py-28 glass-card max-w-lg mx-auto" style={{ borderRadius: 'var(--radius-card)' }}>
                        <div className="w-16 h-16 glass rounded-full mx-auto mb-6 flex items-center justify-center">
                            <PackageX className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl text-white font-bold mb-3">
                            {searchTerm || selectedCategory !== 'all' ? 'Nenhum resultado' : 'Catálogo em atualização'}
                        </h3>
                        <p className="text-slate-400 px-6 leading-relaxed">
                            Tente ajustar seus filtros ou busca para encontrar o que procura.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-slate-500 text-sm">
                                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                            {filteredAndSorted.map((eq) => (
                                <EquipmentCard key={eq.id} equipment={eq} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
