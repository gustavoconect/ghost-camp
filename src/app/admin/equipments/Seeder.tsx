'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';

const products = [
    {
        name: "Barraca Arpenaz 3",
        description: "Barraca Quechua Arpenaz 3 pessoas com teto duplo para melhor circulação do ar. Impermeabilidade e resistência validadas em laboratório.",
        price: 30,
        img: "https://static.wixstatic.com/media/ea59aa_08cda3f325c2459492bbf201651e6275~mv2.png/v1/crop/x_4,y_75,w_993,h_720/fill/w_400,h_290,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/arpenaz-3-1.png",
        category: "barracas",
    },
    {
        name: "Barraca MH100 - 2 Pessoas",
        description: "Barraca Quechua MH100 para 2 pessoas. Design compacto e leve, ideal para trilhas. Teto duplo e proteção impermeável.",
        price: 28,
        img: "https://static.wixstatic.com/media/ea59aa_232d8650afa341f4bbf95a76ec23cd46~mv2.png/v1/crop/x_0,y_4,w_1000,h_821/fill/w_400,h_329,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2p.png",
        category: "barracas",
    },
    {
        name: "Barraca QuickHiker Ultralight 2",
        description: "Barraca ultraleve Quechua QuickHiker para 2 pessoas. Peso reduzido para longas trilhas. Montagem rápida e compacta.",
        price: 50,
        img: "https://static.wixstatic.com/media/ea59aa_838ac32f5485454da160aa776175d0df~mv2.png/v1/crop/x_0,y_205,w_1000,h_574/fill/w_400,h_249,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/quickhiker-ultralightii-1.png",
        category: "barracas",
    },
    {
        name: "Barraca MH100 - 3 Pessoas",
        description: "Barraca Quechua MH100 para 3 pessoas. Espaço confortável com teto duplo e resistência impermeável testada em laboratório.",
        price: 35,
        img: "https://static.wixstatic.com/media/ea59aa_772a82b6c7414f21a2b8477a649754f5~mv2.png/v1/fill/w_400,h_273,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/D_NQ_NP_2X_697641-MLB42289613201_062020-F.png",
        category: "barracas",
    },
    {
        name: "Barraca Arpenaz Family 4.1",
        description: "Barraca familiar Quechua Arpenaz 4.1 para até 4 pessoas com sala de estar. Ideal para acampamentos em família com máximo conforto.",
        price: 55,
        img: "https://static.wixstatic.com/media/ea59aa_ce8d20649bf24383a6925ba28b23ad35~mv2.png/v1/crop/x_0,y_12,w_1000,h_809/fill/w_400,h_323,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/arpenaz-family-41-1.png",
        category: "barracas",
    },
    {
        name: "Colchão Inflável Casal",
        description: "Colchão inflável de casal Jilong. Grande conforto para noites ao ar livre. Superfície aveludada.",
        price: 20,
        img: "https://static.wixstatic.com/media/ea59aa_90eb3ad14533431fb2a237a8cc7620d6~mv2.png/v1/crop/x_0,y_213,w_1000,h_548/fill/w_400,h_211,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/colch%C3%A3o-infl%C3%A1vel-casal-jilong-azul.png",
        category: "acessorios",
    },
    {
        name: "Colchão Inflável Solteiro",
        description: "Colchão inflável de solteiro, compacto e leve. Perfeito para camp solo ou mochilão. Fácil de transportar.",
        price: 15,
        img: "https://static.wixstatic.com/media/ea59aa_7b37e2a54cea4ebba2b4d76f439e12d7~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/120860831_1GG.png",
        category: "acessorios",
    },
    {
        name: "Colchonete de Espuma",
        description: "Colchonete de espuma para camping. Leve, dobrável e fácil de carregar. Boa opção econômica.",
        price: 12,
        img: "https://static.wixstatic.com/media/ea59aa_c9564cf311704cdfbc2a31f5d49ac5ef~mv2.jpg/v1/crop/x_121,y_68,w_365,h_291/fill/w_400,h_306,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%2520Image%25202021-02-12%2520at%252015_.jpg",
        category: "acessorios",
    },
    {
        name: "Bomba de Pé 5L",
        description: "Bomba de pé 5 litros para inflar colchões e barracas infláveis. Prática e manual.",
        price: 6,
        img: "https://static.wixstatic.com/media/ea59aa_e7f61d8081944f1ab497f96d0ecc9383~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/foot-pump-v2-no-size1.png",
        category: "acessorios",
    },
    {
        name: "Bomba Elétrica",
        description: "Bomba elétrica para inflar colchões de camping. Rápida e prática para postos com energia.",
        price: 10,
        img: "https://static.wixstatic.com/media/ea59aa_b2d20ecf19664993bc206da3ae8997d2~mv2.jpg/v1/crop/x_17,y_0,w_937,h_722/fill/w_400,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/180819727-2057088989_1024x1024_edited_jp.jpg",
        category: "acessorios",
    },
    {
        name: "Isolante Térmico Thor",
        description: "Isolante térmico dobrável 8mm Azteq Thor. Protege do frio e da umidade do solo.",
        price: 8,
        img: "https://static.wixstatic.com/media/ea59aa_6a852ed468714ad3bc3599fa899afaf8~mv2.jpg/v1/fill/w_400,h_355,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/isolante-termico-dobravel-8mm-thor-azteq.jpg",
        category: "acessorios",
    },
    {
        name: "Fogareiro Apolo Nautika",
        description: "Fogareiro compacto Apolo Nautika. Perfeito para cozinhar nas trilhas com regulagem de chama.",
        price: 15,
        img: "https://static.wixstatic.com/media/ea59aa_d753616b3938433d9bc256917dca0612~mv2.jpg/v1/fill/w_400,h_411,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fogareiro_apolo_nautika-01.jpg",
        category: "acessorios",
    },
    {
        name: "Saco de Dormir Viper",
        description: "Saco de dormir confortável para temperaturas de 12°C a 5°C. Ideal para camping.",
        price: 18,
        img: "https://static.wixstatic.com/media/ea59aa_9bac49582160454789cf80e5c3e35aae~mv2.jpg/v1/fill/w_400,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/535-3010-108_zoom1_edited.jpg",
        category: "sacos",
    },
    {
        name: "Saco de Dormir Forclaz 10°C",
        description: "Saco de dormir Quechua Forclaz para temperaturas de 10°C a 5°C. Compacto e leve.",
        price: 20,
        img: "https://static.wixstatic.com/media/ea59aa_e332d4b1e9e84129b7b05fd11ebf7d74~mv2.jpg/v1/crop/x_0,y_29,w_507,h_440/fill/w_400,h_347,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/saco-de-dormir-forclaz-10-quechua-D_NQ_N.jpg",
        category: "sacos",
    },
    {
        name: "Saco de Dormir Antartik",
        description: "Saco de dormir Nautika Antartik para temperaturas extremas de 3°C a -7°C.",
        price: 25,
        img: "https://static.wixstatic.com/media/ea59aa_a22d3ff12ce04de090658f440b7f870b~mv2.jpg/v1/fill/w_400,h_397,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/saco-de-dormir-antartik-nautika-preto-e-.jpg",
        category: "sacos",
    },
    {
        name: "Mochila Cargueira Forclaz 50L",
        description: "Mochila cargueira Quechua Forclaz 50 litros. Ergonômica com suporte lombar ajustável.",
        price: 35,
        img: "https://static.wixstatic.com/media/ea59aa_27f8c08dcd52483bb707fe53f66b0820~mv2.jpg/v1/fill/w_400,h_397,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45ff5618bb5ec9ef07641d47def3f039.jpg",
        category: "mochilas",
    },
    {
        name: "Cadeira de Camping Dobrável",
        description: "Cadeira de camping dobrável com apoio de braço. Confortável e portátil.",
        price: 10,
        img: "https://static.wixstatic.com/media/ea59aa_af681fddb3b0467c9a93013776ee73b0~mv2.webp/v1/fill/w_400,h_473,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/D_NQ_NP_2X_826153-MLB49014323429_022022-F.webp",
        category: "acessorios",
    },
];

export function Seeder() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSeed = async () => {
        if (!window.confirm(`Isso irá apagar os equipamentos atuais e importar ${products.length} itens do Quero Acampar. Deseja continuar?`)) return;

        setLoading(true);
        setStatus('loading');
        let count = 0;
        try {
            // 1. Limpar atuais
            const existing = await getDocs(collection(db, 'equipments'));
            for (const d of existing.docs) {
                await deleteDoc(doc(db, 'equipments', d.id));
            }

            for (const prod of products) {
                // Fetch and upload image safer
                let finalImageUrl = prod.img;
                try {
                    const res = await fetch(prod.img);
                    const blob = await res.blob();
                    const fileName = `equipments/seed-${Date.now()}-${count}.png`;
                    const storageRef = ref(storage, fileName);
                    await uploadBytes(storageRef, blob);
                    finalImageUrl = await getDownloadURL(storageRef);
                } catch (imgError) {
                    console.warn(`Erro no upload da imagem para ${prod.name}, usando URL original`, imgError);
                }

                // Save to Firestore
                await addDoc(collection(db, 'equipments'), {
                    name: prod.name,
                    description: prod.description,
                    price_per_day: prod.price,
                    image_urls: [finalImageUrl],
                    category_id: prod.category,
                    is_active: true,
                    created_at: new Date().toISOString()
                });

                count++;
                setProgress(Math.round((count / products.length) * 100));
            }
            setStatus('success');
            setTimeout(() => window.location.reload(), 2000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 p-8 glass-card border border-orange-500/20 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <RefreshCcw className={`w-12 h-12 ${loading ? 'animate-spin' : ''}`} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">Sincronização Mágica</h3>
            <p className="text-slate-400 mb-8 max-w-lg">
                Seu catálogo está vazio ou desatualizado? Clique abaixo para importar os equipamentos oficiais do fornecedor parceiro (Quero Acampar) com fotos e descrições otimizadas.
            </p>

            {status === 'loading' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-orange-400 font-bold animate-pulse">Importando produtos...</span>
                        <span className="text-white font-mono">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 border border-white/5">
                        <div
                            className="bg-orange-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <div className="flex items-center gap-3 text-green-400 font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                    Catálogo populado com sucesso! Atualizando página...
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-3 text-red-400 font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <AlertCircle className="w-6 h-6" />
                    Erro na importação. Verifique sua conexão e tente novamente.
                </div>
            )}

            {(status === 'idle' || status === 'error') && (
                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-orange-900/20 disabled:opacity-50 flex items-center gap-3"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Importar Catálogo Completo
                </button>
            )}
        </div>
    );
}
