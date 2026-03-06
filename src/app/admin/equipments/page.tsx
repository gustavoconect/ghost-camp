'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import { Loader2, Plus, Pencil, Trash2, Tent } from 'lucide-react';
import Link from 'next/link';

export default function AdminEquipmentsPage() {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchEquipments() {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'equipments'));
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

    useEffect(() => {
        fetchEquipments();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja apagar o equipamento "${name}"? Essa ação não pode ser desfeita.`)) {
            try {
                await deleteDoc(doc(db, 'equipments', id));
                fetchEquipments(); // Recarrega a lista
            } catch (error) {
                console.error("Erro ao apagar equipamento", error);
                alert('Erro ao apagar equipamento. Verifique sua conexão e tente novamente.');
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Equipamentos</h1>
                    <p className="text-slate-400">Gerencie o estoque do catálogo da loja.</p>
                </div>
                <Link
                    href="/admin/equipments/new"
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/20 whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" /> Novo Equipamento
                </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                        <p className="text-slate-400">Carregando catálogo completo...</p>
                    </div>
                ) : equipments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                            <Tent className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Nenhum equipamento cadastrado</h3>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            Sua vitrine está vazia no momento. Adicione os itens de aluguel como barracas, lanternas ou kits completos para que seus clientes possam visualizá-los.
                        </p>
                        <Link
                            href="/admin/equipments/new"
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                        >
                            Começar a cadastrar
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700">
                                    <th className="p-4 text-sm font-bold text-slate-300 uppercase tracking-wider">Produto</th>
                                    <th className="p-4 text-sm font-bold text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-sm font-bold text-slate-300 uppercase tracking-wider">Preço (Dia)</th>
                                    <th className="p-4 text-sm font-bold text-slate-300 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {equipments.map((eq) => (
                                    <tr key={eq.id} className="hover:bg-slate-700/20 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0">
                                                    <img
                                                        src={eq.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                                        alt={eq.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold line-clamp-1">{eq.name}</p>
                                                    <p className="text-slate-500 text-xs line-clamp-1 max-w-[200px] md:max-w-xs">{eq.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {eq.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                    Ativo Vitrine
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                    Oculto
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-orange-500 font-bold whitespace-nowrap">R$ {eq.price_per_day?.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors tooltip-trigger" title="Editar (Em Breve)">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(eq.id, eq.name)}
                                                    className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 rounded-lg transition-colors" title="Apagar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
