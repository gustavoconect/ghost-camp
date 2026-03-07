'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment, Category } from '@/types';
import { EquipmentCard } from '@/components/ecommerce/EquipmentCard';
import { Compass, Loader2, Search, PackageX, ChevronDown } from 'lucide-react';

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
                const catSnapshot = await getDocs(collection(db, 'categories'));
                const catList: Category[] = [];
                catSnapshot.forEach(doc => catList.push({ id: doc.id, ...doc.data() } as Category));
                setCategories(catList);

                const q = query(collection(db, 'equipments'));
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
            if (eq.is_active === false) return false;
            const matchesSearch = eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
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
        <main className="min-h-screen bg-[#050510] px-5 sm:px-6 lg:px-8 pb-20 sm:pb-28">
            {/* Forced spacer for fixed navbar */}
            <div style={{ height: '100px', width: '100%' }} aria-hidden="true" />
            <div className="max-w-[1200px] mx-auto">

                {/* Hero / Header */}
                <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
                        <Compass className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Catálogo Oficial</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-10 tracking-tighter drop-shadow-sm">
                        Equipamentos <span className="text-blue-500">Premium</span>
                    </h1>

                    {/* Expandable Search Bar */}
                    <div className="w-full flex justify-center h-16 pointer-events-auto z-20">
                        <div className="group relative w-16 hover:w-full focus-within:w-full max-w-2xl transition-all duration-700 ease-out h-full bg-slate-900 border border-slate-700 hover:border-blue-500/50 focus-within:border-blue-500 rounded-full flex items-center overflow-hidden cursor-pointer shadow-2xl">
                            <div className="absolute left-0 w-16 h-16 flex items-center justify-center shrink-0 z-10 pointer-events-none">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar equipamento ideal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full bg-transparent pl-16 pr-6 text-white text-base sm:text-lg placeholder-slate-500 focus:outline-none opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 delay-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-slate-800 pb-8">

                    {/* Categories - Conditionally rendered if there are categories */}
                    {categories.length > 0 ? (
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`rounded-full text-sm font-bold transition-all shrink-0 border whitespace-nowrap h-12 px-6 flex items-center justify-center ${selectedCategory === 'all'
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                    : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                                    }`}
                            >
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`rounded-full text-sm font-bold transition-all shrink-0 border whitespace-nowrap h-12 px-6 flex items-center justify-center ${selectedCategory === cat.id
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                        : 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Empty state or specific design when no categories exist to keep layout balanced */}
                        </div>
                    )}

                    {/* Sort Dropdown */}
                    <div className="relative shrink-0 w-full md:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full md:w-auto text-center appearance-none bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer h-12 pl-6 pr-12 transition-colors hover:border-slate-500"
                        >
                            <option value="default" className="bg-slate-900">Relevância</option>
                            <option value="price-asc" className="bg-slate-900">Menor Preço</option>
                            <option value="price-desc" className="bg-slate-900">Maior Preço</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="p-4 rounded-full bg-slate-900/50 border border-slate-800 mb-6">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Carregando catálogo...</p>
                    </div>
                ) : filteredAndSorted.length === 0 ? (
                    <div className="text-center py-24 sm:py-32 bg-slate-900/30 border border-slate-800 rounded-3xl max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto mb-8 flex items-center justify-center border border-slate-800">
                            <PackageX className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                            {searchTerm || selectedCategory !== 'all' ? 'Nenhum equipamento encontrado' : 'Catálogo vazio'}
                        </h3>
                        <p className="text-slate-400 px-6 font-medium text-lg max-w-md mx-auto leading-relaxed">
                            Tente ajustar seus filtros ou remover o termo de busca para visualizar os itens.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8 px-2">
                            <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">
                                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'item disponível' : 'itens disponíveis'}
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
