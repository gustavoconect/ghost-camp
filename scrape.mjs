import * as cheerio from 'cheerio';

async function run() {
    const res = await fetch('https://www.queroacampar.com.br/alugue');
    const html = await res.text();
    const $ = cheerio.load(html);

    const products = [];

    // Pela estrutura comum de e-commerces (Wix, Nuvemshop) precisamos descobrir a classe dos produtos.
    // Vou imprimir os h2 ou h3 para ver o que tem.
    const texts = [];
    $('h1, h2, h3, h4, .product-name, .product-title').each((i, el) => {
        texts.push($(el).text().trim());
    });

    console.log(texts.filter(t => t.length > 0));
}

run();
