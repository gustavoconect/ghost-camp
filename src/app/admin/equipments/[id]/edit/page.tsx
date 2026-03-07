'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowLeft, CheckCircle, Link as LinkIcon, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const equipmentId = resolvedParams.id;

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [imageUrls, setImageUrls] = useState<string[]>(['']);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const docRef = doc(db, 'equipments', equipmentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || '');
                    setDescription(data.description || '');
                    setPrice(data.price_per_day?.toString() || '');
                    setIsActive(data.is_active !== false); // default to true if undefined

                    if (data.image_urls && Array.isArray(data.image_urls) && data.image_urls.length > 0) {
                        setImageUrls(data.image_urls);
                    } else {
                        setImageUrls(['']); // Ensure at least one empty field if no URLs exist
                    }
                } else {
                    toast.error('Equipamento não encontrado.');
                    router.push('/admin/equipments');
                }
            } catch (error) {
                console.error("Erro ao buscar equipamento:", error);
                toast.error('Erro ao buscar dados do equipamento.');
            } finally {
                setLoadingData(false);
            }
        };

        if (equipmentId) {
            fetchEquipment();
        }
    }, [equipmentId, router]);

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
            setImageUrls(['']); // Keep at least one empty field
            return;
        }
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clean empty URLs
        const validUrls = imageUrls.filter(url => url.trim() !== '');

        if (!name.trim()) {
            toast.error('O nome do equipamento é obrigatório.');
            return;
        }

        const parsedPrice = parseFloat(price.replace(',', '.'));
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error('Informe um valor de diária válido.');
            return;
        }

        if (validUrls.length === 0) {
            toast.error('Por favor, adicione pelo menos uma URL de imagem.');
            return;
        }

        setSaving(true);

        try {
            const docRef = doc(db, 'equipments', equipmentId);

            const docData = {
                name: name.trim(),
                description: description.trim(),
                price_per_day: parsedPrice,
                image_urls: validUrls,
                is_active: isActive,
                updated_at: serverTimestamp()
            };

            await updateDoc(docRef, docData);

            setSuccess(true);
            setSaving(false);
            toast.success('Equipamento atualizado com sucesso!');

            setTimeout(() => {
                router.push('/admin/equipments');
                router.refresh();
            }, 1000);

        } catch (error) {
            console.error("Erro geral no submit:", error);
            toast.error('Ocorreu um erro ao salvar o equipamento. Verifique sua conexão.');
            setSaving(false);
        }
    };

    if (loadingData) {
        return (
            <div className="admin-page flex items-center justify-center min-h-[60vh]">
                <Loader2 size={48} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '24px' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginBottom: '12px' }}>Sucesso!</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Equipamento atualizado com êxito. Redirecionando...</p>
            </div>
        );
    }

    return (
        <div className="admin-page admin-form-page">
            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-page {
                    animation: fadeIn 0.3s ease-out;
                }
                .admin-form-page {
                    max-width: 900px;
                }
                .admin-header-flex {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 48px;
                }
                .back-btn {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background-color: #09090b;
                    border: 1px solid #27272a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .back-btn:hover {
                    background-color: #18181b;
                    color: #fff;
                    border-color: #3f3f46;
                }
                .admin-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    margin: 0;
                    color: #fff;
                    letter-spacing: -0.02em;
                }
                
                .admin-panel {
                    background-color: #09090b;
                    border: 1px solid #27272a;
                    border-radius: 16px;
                    padding: 40px;
                }
                .form-group {
                    margin-bottom: 24px;
                }
                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: bold;
                    color: #cbd5e1;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-control {
                    width: 100%;
                    background-color: #18181b;
                    border: 1px solid #27272a;
                    border-radius: 12px;
                    padding: 16px;
                    color: #fff;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                .form-control:focus {
                    outline: none;
                    border-color: #3b82f6;
                }
                textarea.form-control {
                    min-height: 120px;
                    resize: vertical;
                }
                
                .form-row {
                    display: flex;
                    gap: 24px;
                }
                .form-col {
                    flex: 1;
                }

                .price-wrapper {
                    position: relative;
                }
                .price-symbol {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    font-weight: bold;
                }
                .price-wrapper input {
                    padding-left: 48px;
                }

                .toggle-wrapper {
                    display: flex;
                    align-items: center;
                    height: 54px;
                    background-color: #18181b;
                    border: 1px solid #27272a;
                    border-radius: 12px;
                    padding: 0 16px;
                    gap: 12px;
                    cursor: pointer;
                }
                .toggle-checkbox {
                    width: 20px;
                    height: 20px;
                    accent-color: #3b82f6;
                    cursor: pointer;
                }
                .toggle-text {
                    color: #fff;
                    font-weight: 500;
                }

                .url-inputs-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .url-input-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .url-input-wrapper {
                    flex: 1;
                    position: relative;
                }
                .url-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #71717a;
                }
                .url-input-wrapper input {
                    padding-left: 48px;
                }
                .remove-url-btn {
                    background-color: #27272a;
                    border: none;
                    width: 54px;
                    height: 54px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ef4444;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .remove-url-btn:hover {
                    background-color: #3f3f46;
                }
                .add-url-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #3b82f6;
                    background: none;
                    border: none;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 8px 0;
                    margin-top: 8px;
                    width: max-content;
                }
                .add-url-btn:hover {
                    text-decoration: underline;
                }

                .submit-btn {
                    width: 100%;
                    background-color: #2563eb;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 18px 24px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    margin-top: 40px;
                }
                .submit-btn:hover:not(:disabled) {
                    background-color: #3b82f6;
                }
                .submit-btn:disabled {
                    background-color: #3f3f46;
                    color: #a1a1aa;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .form-row {
                        flex-direction: column;
                        gap: 0;
                    }
                    .admin-panel {
                        padding: 24px;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `
            }} />

            <div className="admin-header-flex">
                <Link href="/admin/equipments" className="back-btn" title="Voltar">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="admin-title">Editar Equipamento</h1>
            </div>

            <div className="admin-panel">
                <form onSubmit={handleSubmit}>

                    {/* Nome */}
                    <div className="form-group">
                        <label className="form-label">Nome do Equipamento *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={saving}
                            className="form-control"
                            placeholder="Ex: Barraca The North Face Alpine"
                            required
                        />
                    </div>

                    {/* Preço e Status */}
                    <div className="form-row">
                        <div className="form-col">
                            <div className="form-group">
                                <label className="form-label">Valor da Diária (R$) *</label>
                                <div className="price-wrapper">
                                    <span className="price-symbol">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        disabled={saving}
                                        className="form-control"
                                        placeholder="45.00"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-col">
                            <div className="form-group">
                                <label className="form-label">Disponibilidade na Vitrine</label>
                                <label className="toggle-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        disabled={saving}
                                        className="toggle-checkbox"
                                    />
                                    <span className="toggle-text">Equipamento Ativo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="form-group">
                        <label className="form-label">Descrição Completa</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={saving}
                            className="form-control"
                            placeholder="Detalhes técnicos, capacidade, peso, itens inclusos..."
                        />
                    </div>

                    {/* Image URLs Input */}
                    <div className="form-group">
                        <label className="form-label">Fotos do Produto (Links) *</label>
                        <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '16px' }}>
                            Cole links diretos para as imagens do equipamento (ex. Imgur, Google Drive, outro site).
                        </p>

                        <div className="url-inputs-container">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="url-input-row">
                                    <div className="url-input-wrapper">
                                        <LinkIcon size={20} className="url-icon" />
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => handleUrlChange(index, e.target.value)}
                                            disabled={saving}
                                            className="form-control"
                                            placeholder="https://exemplo.com/imagem.png"
                                            required={index === 0} // Only first is strictly required by HTML spec if others are empty
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeUrlField(index)}
                                        className="remove-url-btn"
                                        disabled={saving}
                                        title="Remover Link"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addUrlField}
                                className="add-url-btn"
                                disabled={saving}
                            >
                                <Plus size={18} /> Adicionar outro link
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="submit-btn"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Salvando alterações...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
