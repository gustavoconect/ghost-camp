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
        <div className="admin-page">
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-page {
                    animation: fadeIn 0.3s ease-out;
                }
                .admin-header-flex {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 48px;
                    gap: 24px;
                    flex-wrap: wrap;
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
                .admin-btn-primary {
                    background-color: #2563eb;
                    color: #fff;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: background-color 0.2s;
                    white-space: nowrap;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .admin-btn-primary:hover {
                    background-color: #3b82f6;
                }

                .admin-list-container {
                    background-color: #09090b;
                    border: 1px solid #27272a;
                    border-radius: 16px;
                    overflow: hidden;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .admin-table th {
                    padding: 20px 24px;
                    font-size: 0.875rem;
                    font-weight: bold;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #27272a;
                    background-color: #18181b;
                }
                .admin-table td {
                    padding: 20px 24px;
                    border-bottom: 1px solid #27272a;
                    vertical-align: middle;
                }
                .admin-table tr:last-child td {
                    border-bottom: none;
                }
                .admin-table tr:hover {
                    background-color: rgba(39, 39, 42, 0.4);
                }

                .product-cell {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .product-img {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    background-color: #18181b;
                    object-fit: cover;
                    flex-shrink: 0;
                }
                .product-info {
                    min-width: 0; 
                }
                .product-name {
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .product-desc {
                    color: #71717a;
                    font-size: 0.875rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 300px;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .status-badge.active {
                    background-color: rgba(34, 197, 94, 0.1);
                    color: #4ade80;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }
                .status-badge.inactive {
                    background-color: rgba(161, 161, 170, 0.1);
                    color: #a1a1aa;
                    border: 1px solid rgba(161, 161, 170, 0.2);
                }
                .price-cell {
                    color: #3b82f6;
                    font-weight: bold;
                    font-size: 1.1rem;
                    white-space: nowrap;
                }
                
                .actions-cell {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 8px;
                }
                .action-btn {
                    padding: 10px;
                    border-radius: 8px;
                    background-color: transparent;
                    border: 1px solid transparent;
                    color: #71717a;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .action-btn:hover {
                    background-color: #27272a;
                    color: #fff;
                    border-color: #3f3f46;
                }
                .action-btn.delete:hover {
                    color: #ef4444;
                    background-color: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.2);
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    text-align: center;
                }
                .empty-icon {
                    width: 72px;
                    height: 72px;
                    background-color: #18181b;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    color: #71717a;
                }
                .empty-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 12px;
                }
                .empty-desc {
                    color: #94a3b8;
                    max-width: 400px;
                    line-height: 1.6;
                    margin-bottom: 32px;
                }
                .loader-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px 0;
                }

                @media (max-width: 1024px) {
                    .admin-table {
                        display: block;
                    }
                    .admin-table thead {
                        display: none;
                    }
                    .admin-table tbody {
                        display: block;
                    }
                    .admin-table tr {
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        border-bottom: 1px solid #27272a;
                    }
                    .admin-table td {
                        padding: 8px 0;
                        border: none;
                    }
                    .actions-cell {
                        justify-content: flex-start;
                        margin-top: 12px;
                    }
                    .product-desc {
                        max-width: 100%;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `
            }} />

            {/* Header */}
            <div className="admin-header-flex">
                <div>
                    <h1 className="admin-title">Equipamentos</h1>
                    <p className="admin-subtitle">Gerencie o estoque do catálogo da loja.</p>
                </div>
                <Link href="/admin/equipments/new" className="admin-btn-primary">
                    <Plus size={20} />
                    Novo Equipamento
                </Link>
            </div>

            <div className="admin-list-container">
                {loading ? (
                    <div className="loader-container">
                        <Loader2 size={40} color="#3b82f6" className="animate-spin mb-4" />
                        <p style={{ color: '#94a3b8' }}>Carregando catálogo completo...</p>
                    </div>
                ) : equipments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Tent size={36} />
                        </div>
                        <h3 className="empty-title">Nenhum equipamento cadastrado</h3>
                        <p className="empty-desc">
                            Sua vitrine está vazia no momento. Adicione os itens de aluguel como barracas, lanternas ou kits completos
                            para que seus clientes possam visualizá-los.
                        </p>
                        <Link href="/admin/equipments/new" className="admin-btn-primary">
                            Começar a cadastrar
                        </Link>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Status</th>
                                <th>Preço (Dia)</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipments.map((eq) => (
                                <tr key={eq.id}>
                                    <td>
                                        <div className="product-cell">
                                            <Image
                                                src={eq.image_urls?.[0] || 'https://images.unsplash.com/photo-1504280390224-ddee6b219569?q=80&w=2000&auto=format&fit=crop'}
                                                alt={eq.name}
                                                width={64}
                                                height={64}
                                                className="product-img"
                                            />
                                            <div className="product-info">
                                                <div className="product-name">{eq.name}</div>
                                                <div className="product-desc">{eq.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${eq.is_active ? 'active' : 'inactive'}`}>
                                            {eq.is_active ? 'Ativo Vitrine' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td className="price-cell">
                                        R$ {eq.price_per_day?.toFixed(2)}
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <Link
                                                href={`/admin/equipments/${eq.id}/edit`}
                                                className="action-btn"
                                                title="Editar Informações e Fotos"
                                            >
                                                <Pencil size={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(eq.id, eq.name)}
                                                className="action-btn delete"
                                                title="Apagar"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ marginTop: '40px' }}>
                <Seeder />
            </div>
        </div>
    );
}
