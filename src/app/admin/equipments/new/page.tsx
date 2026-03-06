'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Loader2, ArrowLeft, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !file) {
            alert('Por favor, preencha todos os campos obrigatórios e adicione uma imagem.');
            return;
        }

        setLoading(true);

        try {
            // 1. Upload File to Firebase Storage
            const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const storageRef = ref(storage, `equipments/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Erro no upload:", error);
                    alert("Falha ao enviar imagem.");
                    setLoading(false);
                },
                async () => {
                    // Upload complete, get URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 2. Save Document to Firestore
                    const docData = {
                        name,
                        description,
                        price_per_day: parseFloat(price),
                        image_urls: [downloadURL],
                        is_active: isActive,
                        category_id: 'geral', // MVP Default
                        created_at: serverTimestamp()
                    };

                    await addDoc(collection(db, 'equipments'), docData);

                    setSuccess(true);
                    setLoading(false);

                    setTimeout(() => {
                        router.push('/admin/equipments');
                        router.refresh();
                    }, 1500);
                }
            );

        } catch (error) {
            console.error("Erro geral no submit:", error);
            alert('Ocorreu um erro ao salvar o equipamento. Verifique sua conexão.');
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/equipments" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Cadastrar Equipamento</h1>
                    <p className="text-slate-400">Adicione um novo item ao catálogo da loja.</p>
                </div>
            </div>

            {success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Sucesso!</h3>
                    <p className="text-slate-300">Equipamento cadastrado com êxito. Redirecionando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Equipamento *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                placeholder="Ex: Barraca The North Face Alpine"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Valor da Diária (R$) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    placeholder="Ex: 45.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Disponibilidade na Vitrine</label>
                                <div className="flex items-center h-[50px] bg-slate-900 border border-slate-700 rounded-lg px-4 gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        disabled={loading}
                                        className="w-5 h-5 accent-orange-500 rounded bg-slate-800 border-slate-700"
                                    />
                                    <span className="text-white font-medium">Equipamento Ativo</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Descrição Completa</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={loading}
                                rows={4}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                                placeholder="Detalhes técnicos, capacidade, peso, itens inclusos..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Foto do Produto *</label>
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                    <ImageIcon className="w-10 h-10 text-slate-500 mb-3" />
                                    {file ? (
                                        <p className="text-orange-500 font-bold truncate max-w-[200px]">{file.name}</p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-white">Clique para fazer upload</span> ou arraste</p>
                                            <p className="text-xs text-slate-500">PNG, JPG, WEBP (Recomendado 1:1 Quadrado)</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} required />
                            </label>
                        </div>
                    </div>

                    {loading && uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-slate-900 rounded-full h-2.5 mb-4 border border-slate-700 overflow-hidden">
                            <div className="bg-orange-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Salvando & Fazendo Upload...</>
                            ) : (
                                'Publicar Equipamento'
                            )}
                        </button>
                    </div>

                </form>
            )}
        </div>
    );
}
