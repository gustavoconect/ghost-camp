'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowLeft, CheckCircle, Link as LinkIcon, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [imageUrls, setImageUrls] = useState<string[]>(['']);

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addUrlField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeUrlField = (index: number) => {
        if (imageUrls.length === 1) {
            setImageUrls(['']);
            return;
        }
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validUrls = imageUrls.filter(url => url.trim() !== '');

        if (!name || !price || validUrls.length === 0) {
            toast.error('Preencha os campos obrigatórios e adicione pelo menos 1 URL de foto.');
            return;
        }

        setLoading(true);

        try {
            const docData = {
                name,
                description,
                price_per_day: parseFloat(price),
                image_urls: validUrls,
                is_active: isActive,
                category_id: 'geral',
                created_at: serverTimestamp()
            };

            await addDoc(collection(db, 'equipments'), docData);

            setSuccess(true);
            setLoading(false);
            toast.success('Equipamento criado com sucesso!');

            setTimeout(() => {
                router.push('/admin/equipments');
                router.refresh();
            }, 1000);

        } catch (error) {
            console.error("Erro geral no submit:", error);
            toast.error('Ocorreu um erro ao salvar o equipamento. Verifique sua conexão.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in">
                <CheckCircle size={64} className="text-emerald-500 mb-6" />
                <h1 className="text-3xl font-black text-white mb-3">Sucesso!</h1>
                <p className="text-slate-400 text-lg">Equipamento cadastrado com êxito. Redirecionando...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/equipments"
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-slate-400 hover:text-white hover:border-zinc-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Voltar para a lista de equipamentos"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Novo Equipamento</h1>
                    <p className="text-slate-400 text-sm">Adicione um novo produto à vitrine de aluguel.</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Nome do Produto */}
                    <div>
                        <label htmlFor="eq-name" className="block text-sm font-bold text-slate-300 mb-2">
                            Nome do Equipamento *
                        </label>
                        <input
                            id="eq-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            placeholder="Ex: Barraca Arpenaz 3 Pessoas Quechua"
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base"
                        />
                    </div>

                    {/* Preço e Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="eq-price" className="block text-sm font-bold text-slate-300 mb-2">
                                Valor da Diária (R$) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                                <input
                                    id="eq-price"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base"
                                    placeholder="45.00"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <span className="block text-sm font-bold text-slate-300 mb-2">Disponibilidade na Vitrine</span>
                            <label className="flex items-center gap-3 p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors min-h-[48px]">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    disabled={loading}
                                    className="w-5 h-5 rounded text-blue-600 focus:ring-0 focus:outline-none bg-zinc-950 border-zinc-700"
                                />
                                <span className="text-white text-sm font-semibold">Equipamento Ativo</span>
                            </label>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="eq-desc" className="block text-sm font-bold text-slate-300 mb-2">
                            Descrição Completa
                        </label>
                        <textarea
                            id="eq-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows={4}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-base leading-relaxed"
                            placeholder="Detalhes técnicos, capacidade, peso, itens inclusos..."
                        />
                    </div>

                    {/* Image URLs Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1">
                            Fotos do Produto (Links) *
                        </label>
                        <p className="text-slate-400 text-xs mb-4">
                            Cole links diretos para as imagens do equipamento (ex. Imgur, Google Drive, outro site).
                        </p>

                        <div className="space-y-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <label htmlFor={`eq-url-${index}`} className="sr-only">URL da imagem {index + 1}</label>
                                        <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                        <input
                                            id={`eq-url-${index}`}
                                            type="url"
                                            value={url}
                                            onChange={(e) => handleUrlChange(index, e.target.value)}
                                            disabled={loading}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                            placeholder="https://exemplo.com/imagem.png"
                                            required={index === 0}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeUrlField(index)}
                                        className="p-3 bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 text-slate-400 border border-zinc-800 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                                        disabled={loading}
                                        aria-label={`Remover link ${index + 1}`}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addUrlField}
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm pt-2 cursor-pointer min-h-[44px]"
                                disabled={loading}
                            >
                                <Plus size={16} /> Adicionar outro link
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer min-h-[52px] text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={22} className="animate-spin" />
                                    Registrando no catálogo...
                                </>
                            ) : (
                                'Publicar Equipamento'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
