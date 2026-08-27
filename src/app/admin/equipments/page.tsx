'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Equipment } from '@/types';
import { Loader2, Plus, Pencil, Trash2, Tent } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Seeder } from './Seeder';
import { toast } from 'sonner';

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
            toast.error("Erro ao carregar a lista de equipamentos.");
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
                fetchEquipments();
                toast.success('Equipamento apagado com sucesso!');
            } catch (error) {
                console.error("Erro ao apagar equipamento", error);
                toast.error('Erro ao apagar equipamento. Verifique sua conexão e tente novamente.');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Equipamentos</h1>
                    <p className="text-slate-400 text-base">Gerencie seu catálogo, estoque e preços de locação.</p>
                </div>
                <Link
                    href="/admin/equipments/new"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 min-h-[44px] shrink-0"
                >
                    <Plus size={20} />
                    Novo Equipamento
                </Link>
            </div>

            {/* List Container */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400 text-sm">Carregando catálogo completo...</p>
                    </div>
                ) : equipments.length === 0 ? (
                    <div className="text-center py-20 px-6 max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                            <Tent size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Nenhum equipamento cadastrado</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Sua vitrine está vazia no momento. Adicione os itens de aluguel como barracas, lanternas ou kits completos
                            para que seus clientes possam visualizá-los.
                        </p>
                        <Link
                            href="/admin/equipments/new"
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 min-h-[44px]"
                        >
                            Começar a cadastrar
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-zinc-800 bg-zinc-900/50 text-slate-400 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="py-4 px-6">Produto</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6">Preço (Dia)</th>
                                    <th className="py-4 px-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {equipments.map((eq) => (
                                    <tr key={eq.id} className="hover:bg-zinc-900/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                                                    <Image
                                                        src={eq.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=200&auto=format&fit=crop'}
                                                        alt={eq.name}
                                                        fill
                                                        sizes="56px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white text-base truncate max-w-xs sm:max-w-md">{eq.name}</div>
                                                    <div className="text-slate-400 text-xs truncate max-w-xs sm:max-w-md">{eq.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${eq.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {eq.is_active ? 'Ativo Vitrine' : 'Oculto'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white text-base">
                                            R$ {eq.price_per_day?.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Link
                                                    href={`/admin/equipments/${eq.id}/edit`}
                                                    className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    title="Editar Informações e Fotos"
                                                    aria-label={`Editar ${eq.name}`}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(eq.id, eq.name)}
                                                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    title="Apagar"
                                                    aria-label={`Apagar ${eq.name}`}
                                                >
                                                    <Trash2 size={18} />
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

            <div className="mt-10">
                <Seeder />
            </div>
        </div>
    );
}
