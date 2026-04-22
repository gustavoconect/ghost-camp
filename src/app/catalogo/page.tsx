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
        <main className="min-h-screen bg-black w-full">
            {/* Forced spacer for fixed navbar */}
            <div style={{ height: '90px', width: '100%' }} aria-hidden="true" />

            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-20 sm:pb-32">

                    {/* Header Section */}
                    <div className="mb-8 md:mb-12">
                        {/* Badge */}
                        <div className="flex w-full justify-center mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-blue-500/20 bg-blue-500/5">
                                <Compass className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Catálogo Oficial</span>
                            </div>
                        </div>

                        {/* Title + Search Row */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                    Equipamentos <span className="text-blue-500">Premium</span>
                                </h1>
                                <p className="text-sm text-slate-400 max-w-lg">
                                    Equipamentos de alta performance testados em campo e prontos para sua próxima expedição.
                                </p>
                            </div>

                            {/* Search Bar - Constrained width on desktop */}
                            <div className="relative w-full md:w-72 lg:w-80 shrink-0">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Buscar equipamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-11 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 pb-6 border-b border-slate-800/60">

                        {/* Categories */}
                        {categories.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`text-xs font-bold transition-all shrink-0 border whitespace-nowrap h-9 sm:h-10 px-4 sm:px-5 flex items-center justify-center ${selectedCategory === 'all'
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                        : 'bg-transparent border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500'
                                        }`}
                                >
                                    Todos
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`text-xs font-bold transition-all shrink-0 border whitespace-nowrap h-9 sm:h-10 px-4 sm:px-5 flex items-center justify-center ${selectedCategory === cat.id
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                            : 'bg-transparent border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div />
                        )}

                        {/* Sort Dropdown */}
                        <div className="relative shrink-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none bg-slate-900/60 border border-slate-700/50 text-xs text-slate-300 font-bold focus:outline-none focus:border-blue-500 cursor-pointer h-9 sm:h-10 pl-4 pr-9 transition-colors hover:border-slate-500"
                            >
                                <option value="default" className="bg-slate-900">Relevância</option>
                                <option value="price-asc" className="bg-slate-900">Menor Preço</option>
                                <option value="price-desc" className="bg-slate-900">Maior Preço</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="p-4 rounded-full bg-slate-900/50 border border-slate-800 mb-6">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando catálogo...</p>
                        </div>
                    ) : filteredAndSorted.length === 0 ? (
                        <div className="text-center py-24 sm:py-32 glass-card max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-slate-900 mx-auto mb-6 flex items-center justify-center border border-slate-800">
                                <PackageX className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white mb-3 tracking-tight">
                                {searchTerm || selectedCategory !== 'all' ? 'Nenhum equipamento encontrado' : 'Catálogo vazio'}
                            </h3>
                            <p className="text-slate-400 px-6 font-medium text-sm max-w-md mx-auto leading-relaxed">
                                Tente ajustar seus filtros ou remover o termo de busca para visualizar os itens.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-5">
                                <p className="text-slate-600 font-bold text-xs tracking-widest uppercase">
                                    {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'item disponível' : 'itens disponíveis'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                                {filteredAndSorted.map((eq) => (
                                    <EquipmentCard key={eq.id} equipment={eq} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
