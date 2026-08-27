'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, MessageCircle, Clock, Trash2, User, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
    id: string;
    customer_name: string;
    customer_phone: string;
    items: { name: string; quantity: number; price: number }[];
    rental_days: number;
    total_value: number;
    status: 'pending' | 'confirmed' | 'delivered' | 'returned';
    created_at: string;
}

export default function BookingsAdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: Booking[] = [];
            snapshot.forEach(doc => {
                fetched.push({ id: doc.id, ...doc.data() } as Booking);
            });
            setBookings(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao escutar reservas:", error);
            toast.error("Erro ao carregar reservas");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, newStatus: Booking['status']) => {
        try {
            await updateDoc(doc(db, 'bookings', id), { status: newStatus });
            toast.success("Status atualizado!");
        } catch (error) {
            console.error("Erro status", error);
            toast.error("Falha ao atualizar status");
        }
    };

    const deleteBooking = async (id: string) => {
        if (!confirm("Excluir esta reserva permanentemente?")) return;
        try {
            await deleteDoc(doc(db, 'bookings', id));
            toast.success("Reserva removida");
        } catch (error) {
            console.error("Erro delete", error);
            toast.error("Erro ao excluir");
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Pedidos de Reserva</h1>
                    <p className="text-slate-400 text-sm">Gerencie as solicitações de aluguel recebidas pelo site.</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-slate-300 text-sm flex items-center gap-2 w-fit">
                    <Tag className="w-4 h-4 text-blue-500" />
                    {bookings.length} solicitações
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 p-12 text-center rounded-3xl max-w-xl mx-auto">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-slate-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Nenhum pedido ainda</h2>
                    <p className="text-slate-400 text-sm">As reservas feitas pelos clientes aparecerão aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-2xl hover:border-zinc-700 transition-all flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Cliente */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base truncate">{booking.customer_name}</h3>
                                        <p className="text-slate-400 text-xs">{new Date(booking.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 ml-0 sm:ml-[52px]">
                                    {booking.items.map((item, i) => (
                                        <p key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {item.quantity}x {item.name}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Resumo Financeiro */}
                            <div className="lg:w-48 px-0 sm:px-6 lg:border-x border-zinc-800 space-y-1">
                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {booking.rental_days} diárias
                                </p>
                                <p className="text-xl font-black text-blue-500">R$ {booking.total_value.toFixed(2)}</p>
                            </div>

                            {/* Status e Ações */}
                            <div className="flex flex-wrap items-center gap-3">
                                <label htmlFor={`status-select-${booking.id}`} className="sr-only">Status do pedido</label>
                                <select
                                    id={`status-select-${booking.id}`}
                                    value={booking.status}
                                    onChange={(e) => updateStatus(booking.id, e.target.value as any)}
                                    className={`text-xs font-bold px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer min-h-[44px] ${booking.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                        booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            booking.status === 'delivered' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}
                                >
                                    <option value="pending" className="bg-zinc-900 text-white">Pendente</option>
                                    <option value="confirmed" className="bg-zinc-900 text-white">Confirmado</option>
                                    <option value="delivered" className="bg-zinc-900 text-white">Entregue</option>
                                    <option value="returned" className="bg-zinc-900 text-white">Devolvido</option>
                                </select>

                                <a
                                    href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-emerald-500/20"
                                    title="Chamar no WhatsApp"
                                    aria-label={`Chamar ${booking.customer_name} no WhatsApp`}
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </a>

                                <button
                                    onClick={() => deleteBooking(booking.id)}
                                    className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-red-500/20"
                                    title="Excluir reserva"
                                    aria-label={`Excluir reserva de ${booking.customer_name}`}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
