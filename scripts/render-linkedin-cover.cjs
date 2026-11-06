const { createRequire } = require('node:module');
const path = require('node:path');
const runtimeRequire = createRequire(path.join(process.env.RUNTIME_MODULES, 'playwright', 'package.json'));
const { chromium } = runtimeRequire('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4173/linkedin-cover.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(__dirname, '../assets/manifik-linkedin-cover.png') });
  await browser.close();
  console.log('LinkedIn cover written to assets/manifik-linkedin-cover.png');
})().catch(error => { console.error(error); process.exit(1); });
