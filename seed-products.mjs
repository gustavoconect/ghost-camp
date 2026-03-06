// seed-products.mjs — Importa produtos do queroacampar.com.br para o Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

// Load env
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Produtos mapeados manualmente do raw.json + queroacampar.com.br
// Excluídos: Mesa de Camp, Lonas, Cordão de luz, Mochila 60L
const products = [
    {
        name: "Barraca Arpenaz 3",
        description: "Barraca Quechua Arpenaz 3 pessoas com teto duplo para melhor circulação do ar. Impermeabilidade e resistência validadas em laboratório.",
        price_per_day: 30,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_08cda3f325c2459492bbf201651e6275~mv2.png/v1/crop/x_4,y_75,w_993,h_720/fill/w_400,h_290,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/arpenaz-3-1.png"],
        category_id: "barracas",
    },
    {
        name: "Barraca MH100 - 2 Pessoas",
        description: "Barraca Quechua MH100 para 2 pessoas. Design compacto e leve, ideal para trilhas. Teto duplo e proteção impermeável.",
        price_per_day: 28,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_232d8650afa341f4bbf95a76ec23cd46~mv2.png/v1/crop/x_0,y_4,w_1000,h_821/fill/w_400,h_329,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2p.png"],
        category_id: "barracas",
    },
    {
        name: "Barraca QuickHiker Ultralight 2",
        description: "Barraca ultraleve Quechua QuickHiker para 2 pessoas. Peso reduzido para longas trilhas. Montagem rápida e compacta.",
        price_per_day: 50,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_838ac32f5485454da160aa776175d0df~mv2.png/v1/crop/x_0,y_205,w_1000,h_574/fill/w_400,h_249,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/quickhiker-ultralightii-1.png"],
        category_id: "barracas",
    },
    {
        name: "Barraca MH100 - 3 Pessoas",
        description: "Barraca Quechua MH100 para 3 pessoas. Espaço confortável com teto duplo e resistência impermeável testada em laboratório.",
        price_per_day: 35,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_772a82b6c7414f21a2b8477a649754f5~mv2.png/v1/fill/w_400,h_273,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/D_NQ_NP_2X_697641-MLB42289613201_062020-F.png"],
        category_id: "barracas",
    },
    {
        name: "Barraca Arpenaz Family 4.1",
        description: "Barraca familiar Quechua Arpenaz 4.1 para até 4 pessoas com sala de estar. Ideal para acampamentos em família com máximo conforto.",
        price_per_day: 55,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_ce8d20649bf24383a6925ba28b23ad35~mv2.png/v1/crop/x_0,y_12,w_1000,h_809/fill/w_400,h_323,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/arpenaz-family-41-1.png"],
        category_id: "barracas",
    },
    {
        name: "Colchão Inflável Casal",
        description: "Colchão inflável de casal Jilong. Grande conforto para noites ao ar livre. Fácil inflagem com bomba (alugada separadamente).",
        price_per_day: 20,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_90eb3ad14533431fb2a237a8cc7620d6~mv2.png/v1/crop/x_0,y_213,w_1000,h_548/fill/w_400,h_211,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/colch%C3%A3o-infl%C3%A1vel-casal-jilong-azul.png"],
        category_id: "acessorios",
    },
    {
        name: "Colchão Inflável Solteiro",
        description: "Colchão inflável de solteiro, compacto e leve. Perfeito para camp solo ou mochilão. Fácil de transportar.",
        price_per_day: 15,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_7b37e2a54cea4ebba2b4d76f439e12d7~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/120860831_1GG.png"],
        category_id: "acessorios",
    },
    {
        name: "Colchonete de Espuma",
        description: "Colchonete de espuma para camping. Leve, dobrável e fácil de carregar. Boa opção econômica para base de solo.",
        price_per_day: 12,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_c9564cf311704cdfbc2a31f5d49ac5ef~mv2.jpg/v1/crop/x_121,y_68,w_365,h_291/fill/w_400,h_306,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%2520Image%25202021-02-12%2520at%252015_.jpg"],
        category_id: "acessorios",
    },
    {
        name: "Bomba de Pé 5L",
        description: "Bomba de pé 5 litros para inflar colchões e barracas infláveis. Prática e não requer energia elétrica.",
        price_per_day: 6,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_e7f61d8081944f1ab497f96d0ecc9383~mv2.png/v1/fill/w_400,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/foot-pump-v2-no-size1.png"],
        category_id: "acessorios",
    },
    {
        name: "Bomba Elétrica",
        description: "Bomba elétrica para inflar colchões de camping. Rápida e prática, ideal para quem tem ponto de energia no camping.",
        price_per_day: 10,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_b2d20ecf19664993bc206da3ae8997d2~mv2.jpg/v1/crop/x_17,y_0,w_937,h_722/fill/w_400,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/180819727-2057088989_1024x1024_edited_jp.jpg"],
        category_id: "acessorios",
    },
    {
        name: "Isolante Térmico Thor",
        description: "Isolante térmico dobrável 8mm Azteq Thor. Protege do frio e da umidade do solo. Leve e compacto para transporte.",
        price_per_day: 8,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_6a852ed468714ad3bc3599fa899afaf8~mv2.jpg/v1/fill/w_400,h_355,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/isolante-termico-dobravel-8mm-thor-azteq.jpg"],
        category_id: "acessorios",
    },
    {
        name: "Fogareiro Apolo Nautika",
        description: "Fogareiro compacto Apolo Nautika. Perfeito para cozinhar nas trilhas com regulagem de chama e fácil transporte.",
        price_per_day: 15,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_d753616b3938433d9bc256917dca0612~mv2.jpg/v1/fill/w_400,h_411,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/fogareiro_apolo_nautika-01.jpg"],
        category_id: "acessorios",
    },
    {
        name: "Saco de Dormir Viper 12°C a 5°C",
        description: "Saco de dormir confortável para temperaturas de 12°C a 5°C. Ideal para camping em climas amenos.",
        price_per_day: 18,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_9bac49582160454789cf80e5c3e35aae~mv2.jpg/v1/fill/w_400,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/535-3010-108_zoom1_edited.jpg"],
        category_id: "sacos",
    },
    {
        name: "Saco de Dormir Forclaz 10°C a 5°C",
        description: "Saco de dormir Quechua Forclaz para temperaturas de 10°C a 5°C. Compacto e leve, ótimo para mochilão.",
        price_per_day: 20,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_e332d4b1e9e84129b7b05fd11ebf7d74~mv2.jpg/v1/crop/x_0,y_29,w_507,h_440/fill/w_400,h_347,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/saco-de-dormir-forclaz-10-quechua-D_NQ_N.jpg"],
        category_id: "sacos",
    },
    {
        name: "Saco de Dormir Antartik 3°C a -7°C",
        description: "Saco de dormir Nautika Antartik para temperaturas extremas de 3°C a -7°C. Para montanhas e invernos rigorosos.",
        price_per_day: 25,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_a22d3ff12ce04de090658f440b7f870b~mv2.jpg/v1/fill/w_400,h_397,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/saco-de-dormir-antartik-nautika-preto-e-.jpg"],
        category_id: "sacos",
    },
    {
        name: "Mochila Cargueira Forclaz 50L",
        description: "Mochila cargueira Quechua Forclaz 50 litros. Ergonômica com suporte lombar ajustável, ideal para travessias de vários dias.",
        price_per_day: 35,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_27f8c08dcd52483bb707fe53f66b0820~mv2.jpg/v1/fill/w_400,h_397,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/45ff5618bb5ec9ef07641d47def3f039.jpg"],
        category_id: "mochilas",
    },
    {
        name: "Cadeira de Camping Dobrável",
        description: "Cadeira de camping dobrável com apoio de braço. Confortável e portátil para descansar no acampamento.",
        price_per_day: 10,
        image_urls: ["https://static.wixstatic.com/media/ea59aa_af681fddb3b0467c9a93013776ee73b0~mv2.webp/v1/fill/w_400,h_473,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/D_NQ_NP_2X_826153-MLB49014323429_022022-F.webp"],
        category_id: "acessorios",
    },
];

async function seed() {
    console.log(`\n🏕️  Ghost Camp — Importando ${products.length} produtos...\n`);

    // Limpar coleção existente
    const existing = await getDocs(collection(db, 'equipments'));
    if (existing.size > 0) {
        console.log(`🗑️  Removendo ${existing.size} produtos antigos...`);
        for (const d of existing.docs) {
            await deleteDoc(doc(db, 'equipments', d.id));
        }
    }

    // Inserir novos
    for (const product of products) {
        const docRef = await addDoc(collection(db, 'equipments'), {
            ...product,
            is_active: true,
            created_at: new Date().toISOString(),
        });
        console.log(`✅ ${product.name} → ${docRef.id}`);
    }

    console.log(`\n🎉 ${products.length} produtos importados com sucesso!\n`);
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
});
