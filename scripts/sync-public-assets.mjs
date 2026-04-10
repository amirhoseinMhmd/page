import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDir = resolve(projectRoot, 'public');

const assets = [
  ['CNAME', 'CNAME'],
  ['publication.bib', 'publication.bib'],
  ['images', 'images'],
  ['files', 'files'],
];

await mkdir(publicDir, { recursive: true });

for (const [source, target] of assets) {
  const sourcePath = resolve(projectRoot, source);
  const targetPath = resolve(publicDir, target);

  if (!existsSync(sourcePath)) {
    continue;
  }

  await rm(targetPath, { recursive: true, force: true });
  await cp(sourcePath, targetPath, { recursive: true });
}
