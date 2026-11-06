import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const css = await readFile(new URL('assets/fonts.css', root), 'utf8');
for (const name of ['onda','forma','sera']) {
  const source = await readFile(new URL(`${name}.svg`, root), 'utf8');
  let embedded = '';
  for (const block of css.matchAll(/@font-face\s*\{[^}]+\}/g)) {
    const family = block[0].match(/font-family:\s*'([^']+)'/)[1];
    if (!source.includes(`font-family="${family}"`)) continue;
    const local = block[0].match(/url\(([^)]+)\)/)[1];
    const data = await readFile(new URL(`assets/${local}`, root));
    embedded += block[0].replace(local, `data:font/ttf;base64,${data.toString('base64')}`);
  }
  await writeFile(new URL(`assets/${name}.svg`, root), source.replace(/(<svg[^>]*>)/, `$1<style>${embedded}</style>`));
}
console.log('Original illustrations prepared with embedded local fonts.');
