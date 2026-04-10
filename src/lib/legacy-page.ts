import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('../../', import.meta.url)));

interface LegacyPage {
  styles: string;
  body: string;
  scripts: string[];
}

interface LegacyArticle {
  styles: string;
  article: string;
}

function resolveFromRoot(relativePath: string) {
  return resolve(projectRoot, relativePath);
}

function extractMatch(source: string, pattern: RegExp, label: string) {
  const match = source.match(pattern);

  if (!match) {
    throw new Error(`Could not find ${label} in legacy file.`);
  }

  return match[1].trim();
}

function rewriteLegacyUrls(markup: string) {
  return markup
    .replace(/href="\.\.\/index\.html(#[^"]*)?"/g, (_match, hash = '') => `href="/${hash}"`)
    .replace(/href="index\.html(#[^"]*)?"/g, (_match, hash = '') => `href="/${hash}"`)
    .replace(/href="\.\.\/blog\.html"/g, 'href="/blog/"')
    .replace(/href="blog\.html"/g, 'href="/blog/"')
    .replace(/href="\.\.\/blog\/([^"]+)\.html"/g, 'href="/blog/$1/"')
    .replace(/href="blog\/([^"]+)\.html"/g, 'href="/blog/$1/"')
    .replace(/href="\.\.\/files\/([^"]+)"/g, 'href="/files/$1"')
    .replace(/href="files\/([^"]+)"/g, 'href="/files/$1"')
    .replace(/src="\.\.\/images\/([^"]+)"/g, 'src="/images/$1"')
    .replace(/src="images\/([^"]+)"/g, 'src="/images/$1"')
    .replace(/fetch\('publication\.bib'\)/g, "fetch('/publication.bib')")
    .replace(/fetch\("publication\.bib"\)/g, 'fetch("/publication.bib")')
    .replace(/\s*<a href="\/#news">News<\/a>\s*/g, '')
    .replace(/\s*<a href="#news">News<\/a>\s*/g, '');
}

export async function hasLegacyFile(relativePath: string) {
  return existsSync(resolveFromRoot(relativePath));
}

async function readLegacyFile(relativePath: string) {
  return readFile(resolveFromRoot(relativePath), 'utf8');
}

export async function loadLegacyPage(relativePath: string): Promise<LegacyPage> {
  const html = await readLegacyFile(relativePath);
  const styles = extractMatch(html, /<style>([\s\S]*?)<\/style>/i, 'styles');
  const bodyWithScripts = extractMatch(html, /<body[^>]*>([\s\S]*?)<\/body>/i, 'body');

  const scripts = [...bodyWithScripts.matchAll(/<script>([\s\S]*?)<\/script>/gi)].map((match) =>
    rewriteLegacyUrls(match[1].trim()),
  );

  const body = rewriteLegacyUrls(bodyWithScripts.replace(/<script>[\s\S]*?<\/script>/gi, '').trim());

  return { styles, body, scripts };
}

export async function loadLegacyArticle(relativePath: string, fallbackSuffix = ''): Promise<LegacyArticle> {
  const html = await readLegacyFile(relativePath);
  const styles = extractMatch(html, /<style>([\s\S]*?)<\/style>/i, 'styles');
  const articleStart = html.indexOf('<article>');

  if (articleStart === -1) {
    throw new Error(`Could not find an <article> block in ${relativePath}.`);
  }

  const articleOpenLength = '<article>'.length;
  const articleEnd = html.indexOf('</article>', articleStart);
  const articleSource = articleEnd === -1
    ? html.slice(articleStart + articleOpenLength)
    : html.slice(articleStart + articleOpenLength, articleEnd);

  const article = `${rewriteLegacyUrls(articleSource).trim()}${articleEnd === -1 ? fallbackSuffix : ''}`;

  return { styles, article };
}
