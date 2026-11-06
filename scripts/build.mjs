import { mkdir, copyFile, cp } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
await mkdir(dist, { recursive: true });
for (const name of ['index.html','onda.html','iz-korzinki.html','chefgourmet.html','linkedin-cover.html','styles.css','case.css','app.js']) await copyFile(new URL(name, root), new URL(name, dist));
await cp(new URL('assets/', root), new URL('assets/', dist), { recursive:true });
console.log('Production files written to dist/');
