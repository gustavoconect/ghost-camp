'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const products = [
    { name: 'Barraca Arpenaz 3', price: 30, description: 'Barraca resistente para 3 pessoas. Teto duplo e fácil montagem.', img: 'https://static.wixstatic.com/media/ea59aa_08cda3f325c2459492bbf201651e6275~mv2.png' },
    { name: 'Barraca MH100 - 2P', price: 28, description: 'Ideal para casal. Impermeável e compacta.', img: 'https://static.wixstatic.com/media/ea59aa_232d8650afa341f4bbf95a76ec23cd46~mv2.png' },
    { name: 'Barraca QuickHiker Ultralight 2', price: 50, description: 'Extremamente leve e preparada para trekkings técnicos. Para 2 pessoas.', img: 'https://static.wixstatic.com/media/ea59aa_838ac32f5485454da160aa776175d0df~mv2.png' },
    { name: 'Barraca Arpenaz Family 4.1', price: 55, description: 'Barraca gigante com amplo avanço para 4 pessoas.', img: 'https://static.wixstatic.com/media/ea59aa_ce8d20649bf24383a6925ba28b23ad35~mv2.png' },
    { name: 'Colchão Inflável Casal', price: 20, description: 'Conforto garantido. Superfície aveludada.', img: 'https://static.wixstatic.com/media/ea59aa_90eb3ad14533431fb2a237a8cc7620d6~mv2.png' },
    { name: 'Colchão Inflável Solteiro', price: 15, description: 'Colchão de solteiro resistente para barracas menores.', img: 'https://static.wixstatic.com/media/ea59aa_1b440cff93b74792b4fe4f31190508b2~mv2.jpeg' },
    { name: 'Bomba de pé 5L', price: 6, description: 'Bomba manual para encher os colchões facilmente.', img: 'https://static.wixstatic.com/media/ea59aa_e7f61d8081944f1ab497f96d0ecc9383~mv2.png' },
    { name: 'Isolante Térmico Thor', price: 5, description: 'Isolante para proteger contra a temperatura e umidade do solo.', img: 'https://static.wixstatic.com/media/ea59aa_6a852ed468714ad3bc3599fa899afaf8~mv2.jpg' },
    { name: 'Fogareiro Apolo', price: 15, description: 'Fogareiro prático para cozinhar na trilha. Utiliza cartucho de gás.', img: 'https://static.wixstatic.com/media/ea59aa_d753616b3938433d9bc256917dca0612~mv2.jpg' },
    { name: 'Saco de Dormir Forclaz 10ºC a 5ºC', price: 25, description: 'Temperatura de conforto de 10 graus. Ideal para meia estação.', img: 'https://static.wixstatic.com/media/ea59aa_e332d4b1e9e84129b7b05fd11ebf7d74~mv2.jpg' },
    { name: 'Saco de Dormir Antartik 3ºC a -7ºC', price: 25, description: 'Para frio extremo. Conforto em 3 graus.', img: 'https://static.wixstatic.com/media/ea59aa_a22d3ff12ce04de090658f440b7f870b~mv2.jpg' }
];

export function Seeder() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSeed = async () => {
        setLoading(true);
        let count = 0;
        try {
            for (const prod of products) {
                // 1. Fetch image image as Blob
                const res = await fetch(prod.img);
                const blob = await res.blob();

                // 2. Upload to Firebase Storage
                const fileExt = prod.img.split('.').pop()?.split('~')[0] || 'jpg';
                const fileName = `equipments/seed-${Date.now()}-${count}.${fileExt}`;
                const storageRef = ref(storage, fileName);

                await uploadBytes(storageRef, blob);
                const imageUrl = await getDownloadURL(storageRef);

                // 3. Save to Firestore
                await addDoc(collection(db, 'equipments'), {
                    name: prod.name,
                    description: prod.description,
                    price_per_day: prod.price,
                    image_urls: [imageUrl],
                    is_active: true,
                    created_at: new Date().toISOString()
                });

                count++;
                setProgress(Math.round((count / products.length) * 100));
            }
            alert('Produtos semeados com sucesso!');
        } catch (e) {
            console.error(e);
            alert('Erro ao semear os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">Popular Banco de Dados Automaticamente</h3>
            <p className="text-slate-400 mb-4">
                Clique no botão abaixo para importar os {products.length} móveis da Quero Acampar e jogar no Firebase (ele baixa as fotos e dá o upload automaticamente).
            </p>

            {loading ? (
                <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-white text-sm font-bold">{progress}%</span>
                </div>
            ) : (
                <button
                    onClick={handleSeed}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold"
                >
                    Iniciar Importação Mágica 🚀
                </button>
            )}
        </div>
    );
}
