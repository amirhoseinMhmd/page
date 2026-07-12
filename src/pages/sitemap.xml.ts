import { blogPosts } from '../data/blog';
import { SITE, absoluteUrl } from '../data/site';

interface SitemapEntry {
  path: string;
  lastmod: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const blogLastUpdated = blogPosts
  .map((post) => post.updatedOn ?? post.publishedOn)
  .sort()
  .at(-1) ?? SITE.lastUpdated;

const sitemapEntries: SitemapEntry[] = [
  {
    path: '/',
    lastmod: SITE.lastUpdated,
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    path: '/blog/',
    lastmod: blogLastUpdated,
    changefreq: 'weekly',
    priority: '0.8',
  },
  ...blogPosts.map((post) => ({
    path: post.href,
    lastmod: post.updatedOn ?? post.publishedOn,
    changefreq: 'monthly' as const,
    priority: '0.7',
  })),
];

export function GET() {
  const urls = sitemapEntries
    .map((entry) => {
      return [
        '  <url>',
        `    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
        `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
