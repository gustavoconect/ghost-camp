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
            <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={40} color="#3b82f6" className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-page {
                    animation: fadeIn 0.3s ease-out;
                }
                .admin-header {
                    margin-bottom: 48px;
                }
                .admin-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin-bottom: 8px;
                    color: #fff;
                    letter-spacing: -0.02em;
                }
                .admin-subtitle {
                    color: #94a3b8;
                    font-size: 1.1rem;
                }
                .dash-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 24px;
                    margin-bottom: 48px;
                }
                .dash-card {
                    background-color: #09090b;
                    border: 1px solid #27272a;
                    border-radius: 16px;
                    padding: 32px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                }
                .dash-card.actionable {
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 180px;
                }
                .dash-label {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .dash-value {
                    font-size: 3.5rem;
                    font-weight: 900;
                    color: #fff;
                    line-height: 1;
                }
                .dash-icon-box {
                    padding: 16px;
                    background-color: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    border-radius: 16px;
                    color: #3b82f6;
                }
                .dash-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #3b82f6;
                    font-weight: bold;
                    text-decoration: none;
                    margin-top: 16px;
                    transition: color 0.2s;
                    font-size: 1.1rem;
                }
                .dash-link:hover {
                    color: #60a5fa;
                }
                .dash-banner {
                    background-color: #09090b;
                    border: 1px solid #27272a;
                    border-radius: 16px;
                    padding: 48px;
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .dash-banner-icon {
                    width: 72px;
                    height: 72px;
                    background-color: #18181b;
                    border: 1px solid #27272a;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px auto;
                    font-size: 32px;
                }
                .dash-banner h3 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 12px;
                }
                .dash-banner p {
                    color: #94a3b8;
                    line-height: 1.6;
                    font-size: 1.1rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `
            }} />

            {/* Header */}
            <div className="admin-header">
                <h1 className="admin-title">Visão Geral</h1>
                <p className="admin-subtitle">Bem-vindo de volta! Aqui está o resumo operacional da Ghost Camp.</p>
            </div>

            {/* Stats Grid */}
            <div className="dash-grid">
                {/* Stats Card */}
                <div className="dash-card">
                    <div>
                        <p className="dash-label">Equipamentos Cadastrados</p>
                        <div className="dash-value">
                            {equipmentCount === null ? (
                                <Loader2 size={32} color="#94a3b8" className="animate-spin mt-2" />
                            ) : (
                                equipmentCount
                            )}
                        </div>
                    </div>
                    <div className="dash-icon-box">
                        <Tent size={32} />
                    </div>
                </div>

                {/* Quick Action Card */}
                <div className="dash-card actionable">
                    <div>
                        <p className="dash-label">Acesso Rápido</p>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Novo Equipamento</h3>
                    </div>
                    <Link href="/admin/equipments/new" className="dash-link">
                        <PlusCircle size={24} />
                        Adicionar ao catálogo
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            {/* Info Card */}
            <div className="dash-banner">
                <div className="dash-banner-icon">🚀</div>
                <h3>Painel Operacional Ativo</h3>
                <p>
                    O sistema de vendas e a vitrine pública estão rodando perfeitamente. Utilize o menu ao lado para adicionar ou editar os equipamentos, tudo refletirá em tempo real no site do cliente.
                </p>
            </div>
        </div>
    );
}
