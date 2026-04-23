export const SITE = {
  url: 'https://amirhosein.nl',
  name: 'Amirhossein Mohammadi',
  title: 'Amirhossein Mohammadi',
  description:
    'Personal website and research blog of Amirhossein Mohammadi, Ph.D. candidate in Natural Language Processing at Utrecht University.',
  defaultImage: '/images/Profile.jpg',
  lastUpdated: '2026-04-23',
  language: 'en',
  author: {
    name: 'Amirhossein Mohammadi',
    email: 'a.mohammadi@uu.nl',
    jobTitle: 'Ph.D. Candidate in Natural Language Processing',
    affiliation: 'Utrecht University',
    sameAs: [
      'https://scholar.google.com/citations?user=-bRKO-4AAAAJ&hl=en',
      'https://github.com/amirhoseinMhmd',
      'https://www.linkedin.com/in/amirhoseinmhmd/',
    ],
  },
} as const;

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, `${SITE.url}/`).toString();
}

export function personId() {
  return `${SITE.url}/#person`;
}

export function websiteId() {
  return `${SITE.url}/#website`;
}
