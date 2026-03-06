import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.queroacampar.com.br/alugue");

    // Scroll down a bit to trigger lazy loads
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results = [];

        const texts = Array.from(document.querySelectorAll('h1, h2, h3, h4, .text, .name, .title, p'))
            .map(e => e.innerText.trim())
            .filter(t => t.length > 3);

        const images = Array.from(document.querySelectorAll('img'))
            .map(i => i.src)
            .filter(s => s && s.includes('http'));

        return { texts: [...new Set(texts)], images: [...new Set(images)] };
    });

    fs.writeFileSync('raw.json', JSON.stringify(data, null, 2));
    await browser.close();
})();
