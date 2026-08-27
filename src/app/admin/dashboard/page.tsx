'use client';

import { useAuth } from '@/hooks/useAuth';
import { Loader2, PlusCircle, Tent, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const [equipmentCount, setEquipmentCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const snapshot = await getCountFromServer(collection(db, 'equipments'));
                setEquipmentCount(snapshot.data().count);
            } catch (error) {
                console.error("Erro ao buscar contagem", error);
                setEquipmentCount(0);
            }
        }

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Visão Geral</h1>
                <p className="text-slate-400 text-base">Bem-vindo de volta! Aqui está o resumo operacional da Ghost Camp.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Card */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 flex items-start justify-between">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Equipamentos Cadastrados</p>
                        <div className="text-5xl font-black text-white leading-none">
                            {equipmentCount === null ? (
                                <Loader2 size={32} className="text-slate-400 animate-spin mt-2" />
                            ) : (
                                equipmentCount
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500">
                        <Tent size={32} />
                    </div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between min-h-[180px]">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Acesso Rápido</p>
                        <h2 className="text-xl font-bold text-white">Novo Equipamento</h2>
                    </div>
                    <Link href="/admin/equipments/new" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold transition-colors text-lg mt-4 min-h-[44px]">
                        <PlusCircle size={22} />
                        Adicionar ao catálogo
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                    🚀
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Painel Operacional Ativo</h2>
                <p className="text-slate-300 leading-relaxed text-base">
                    O sistema de vendas e a vitrine pública estão rodando perfeitamente. Utilize o menu ao lado para adicionar ou editar os equipamentos, tudo refletirá em tempo real no site do cliente.
                </p>
            </div>
        </div>
    );
}
