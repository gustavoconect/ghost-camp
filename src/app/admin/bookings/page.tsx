'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, MessageCircle, Clock, CheckCircle2, Trash2, User, Calendar, Tag } from 'lucide-react';
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
            toast.error("Falha ao atualizar status");
        }
    };

    const deleteBooking = async (id: string) => {
        if (!confirm("Excluir esta reserva permanentemente?")) return;
        try {
            await deleteDoc(doc(db, 'bookings', id));
            toast.success("Reserva removida");
        } catch (error) {
            toast.error("Erro ao excluir");
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pedidos de Reserva</h1>
                    <p className="text-slate-400 text-sm">Gerencie as solicitações de aluguel recebidas pelo site.</p>
                </div>
                <div className="glass px-4 py-2 rounded-xl text-slate-300 text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-500" />
                    {bookings.length} solicitações
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-3xl">
                    <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Nenhum pedido ainda</h3>
                    <p className="text-slate-500">As reservas feitas pelos clientes aparecerão aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Cliente */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white truncate">{booking.customer_name}</h4>
                                        <p className="text-slate-500 text-xs">{new Date(booking.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 ml-[52px]">
                                    {booking.items.map((item, i) => (
                                        <p key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            {item.quantity}x {item.name}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Resumo Financeiro */}
                            <div className="lg:w-48 px-6 lg:border-x border-white/5 space-y-1">
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {booking.rental_days} diárias
                                </p>
                                <p className="text-lg font-black text-orange-500">R$ {booking.total_value.toFixed(2)}</p>
                            </div>

                            {/* Status e Ações */}
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={booking.status}
                                    onChange={(e) => updateStatus(booking.id, e.target.value as any)}
                                    className={`text-xs font-bold px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 cursor-pointer ${booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                            booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-500' :
                                                booking.status === 'delivered' ? 'bg-purple-500/10 text-purple-500' :
                                                    'bg-emerald-500/10 text-emerald-500'
                                        }`}
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="confirmed">Confirmado</option>
                                    <option value="delivered">Entregue</option>
                                    <option value="returned">Devolvido</option>
                                </select>

                                <a
                                    href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                    title="Chamar no WhatsApp"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </a>

                                <button
                                    onClick={() => deleteBooking(booking.id)}
                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
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
