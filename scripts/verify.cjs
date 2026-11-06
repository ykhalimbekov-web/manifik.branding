const { createRequire } = require('node:module');
const fs = require('node:fs/promises');
const path = require('node:path');
const runtimeRequire = createRequire(path.join(process.env.RUNTIME_MODULES, 'playwright', 'package.json'));
const { chromium } = runtimeRequire('playwright');
(async () => {
  const browser = await chromium.launch({ headless:true, channel:'msedge' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const report = [];
  await fs.mkdir(path.join(__dirname,'../verification'), {recursive:true});
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width,height:900});
    await page.goto('http://localhost:4173');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.lama img').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top:0,behavior:'instant'}); });
    await page.waitForTimeout(1400);
    const metrics = await page.evaluate(() => ({
      overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth,
      brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
      fonts:document.fonts.check('500 16px Manrope') && document.fonts.check('500 16px "Space Grotesk"'),
    }));
    if (metrics.overflow || metrics.brokenImages.length || !metrics.fonts) throw Error(JSON.stringify({width,...metrics}));
    if (width===1440 || width===390) await page.screenshot({path:path.join(__dirname,`../verification/home-${width}.png`),fullPage:true});
    if (width <= 700) {
      await page.locator('.menu-trigger').click();
      if (!await page.locator('#menu').evaluate(n=>n.open)) throw Error('Menu did not open');
      await page.locator('#menu a[href="#work"]').click();
      if (await page.locator('#menu').evaluate(n=>n.open)) throw Error('Menu did not close');
      await page.waitForTimeout(700);
      if (Math.abs(await page.locator('#work').evaluate(n=>n.getBoundingClientRect().top)) > 30) throw Error('Anchor destination incorrect');
    }
    await page.locator('.contact [data-open-brief]').click();
    await page.locator('#name').fill('Тест');
    await page.locator('#contact-info').fill('test@example.com');
    await page.locator('#project').fill('Проверка макета');
    if (!await page.locator('.submit-button').isDisabled()) throw Error('Unconfigured form must not submit');
    if (width===390) await page.screenshot({path:path.join(__dirname,'../verification/brief-390.png')});
    await page.keyboard.press('Escape');
    if (await page.locator('#brief').evaluate(n=>n.open)) throw Error('Escape did not close dialog');
    if (!await page.locator('.contact [data-open-brief]').evaluate(n=>n===document.activeElement)) throw Error('Focus not restored');
    report.push({width,...metrics,menu:width<=700?'passed':'desktop',brief:'passed'});
  }
  for (const route of ['onda','iz-korzinki']) for (const width of [1440, 390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(`http://localhost:4173/${route}.html`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img[loading="lazy"]').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
    await page.locator('.case-closing').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    const metrics = await page.evaluate(() => ({
      overflow:document.documentElement.scrollWidth > document.documentElement.clientWidth,
      brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
      containsCyrillic:/[А-Яа-яЁё]/.test(document.documentElement.outerHTML),
    }));
    if (metrics.overflow || metrics.brokenImages.length || metrics.containsCyrillic) throw Error(JSON.stringify({route,width,...metrics}));
    if (route === 'onda' && (width===1440 || width===390)) await page.screenshot({path:path.join(__dirname,`../verification/${route}-${width}.png`),fullPage:true});
    report.push({route,width,...metrics});
  }
  await page.goto('http://localhost:4173');
  const homeLanguage = await page.evaluate(() => ({
    lang:document.documentElement.lang,
    containsCyrillic:/[А-Яа-яЁё]/.test(document.documentElement.outerHTML),
    chipCount:document.querySelectorAll('.capability-chip').length,
    chipAnimation:getComputedStyle(document.querySelector('.capability-chip')).animationName,
    hasHeroMark:Boolean(document.querySelector('.hero-mark')),
  }));
  if (homeLanguage.lang !== 'en' || homeLanguage.containsCyrillic || homeLanguage.chipCount !== 7 || homeLanguage.chipAnimation === 'none' || homeLanguage.hasHeroMark) throw Error(JSON.stringify(homeLanguage));
  await page.locator('#service-naming summary').click();
  await page.waitForTimeout(450);
  if (!await page.locator('#service-naming').evaluate(node => node.open)) throw Error('Naming service did not open');
  await page.locator('#service-packaging summary').click();
  await page.waitForTimeout(450);
  const serviceState = await page.evaluate(() => ({naming:document.querySelector('#service-naming').open,packaging:document.querySelector('#service-packaging').open}));
  if (serviceState.naming || !serviceState.packaging) throw Error(JSON.stringify(serviceState));
  await page.emulateMedia({reducedMotion:'reduce'});
  if (await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)!=='auto') throw Error('Reduced motion failed');
  if(errors.length) throw Error(errors.join('\n'));
  await fs.writeFile(path.join(__dirname,'../verification/report.json'), JSON.stringify({viewports:report,errors,reducedMotion:'passed',homeLanguage:'passed'},null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
