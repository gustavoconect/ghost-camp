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
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-10 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Painel do Lojista</h1>
                <p className="text-slate-400 text-sm sm:text-base">
                    Bem-vindo de volta! Aqui está o resumo atual da Ghost Camp.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
                {/* Stats Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-xl flex items-start justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-2">Equipamentos Cadastrados</p>
                        <h3 className="text-3xl sm:text-4xl font-black text-white">
                            {equipmentCount === null ? (
                                <Loader2 className="w-6 h-6 animate-spin mt-2 text-slate-500" />
                            ) : (
                                equipmentCount
                            )}
                        </h3>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 shrink-0">
                        <Tent className="w-6 h-6 text-orange-500" />
                    </div>
                </div>

                {/* Quick Action Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between min-h-[140px]">
                    <div className="mb-5">
                        <p className="text-slate-400 text-sm font-medium mb-2">Acesso Rápido</p>
                        <h3 className="text-lg font-bold text-white">Novo Equipamento</h3>
                    </div>
                    <Link
                        href="/admin/equipments/new"
                        className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors w-fit"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Adicionar ao catálogo
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Painel Preparado</h3>
                <p className="text-slate-400 leading-relaxed max-w-lg mx-auto">
                    O sistema de vendas e vitrine está rodando no cliente. Utilize o menu lateral para criar ou editar itens
                    que vão aparecer imediatamente no catálogo público da loja.
                </p>
            </div>
        </div>
    );
}
