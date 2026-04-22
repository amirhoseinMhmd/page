export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  summary: string;
  dateLabel: string;
  publishedOn: string;
  updatedOn?: string;
  readingTimeLabel: string;
  tags: string[];
  href: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'hpc',
    title: 'Getting Started with HPC Clusters, Slurm & tmux',
    description:
      'A beginner-friendly, step-by-step guide to connecting to HPC clusters, navigating the terminal, editing files, managing code with Git, and submitting GPU jobs with Slurm.',
    summary:
      'A beginner-friendly, step-by-step guide to connecting to HPC clusters, navigating the terminal, editing files, managing code with Git, and submitting GPU jobs with Slurm. No prior experience required.',
    dateLabel: 'April 2026',
    publishedOn: '2026-04-01',
    updatedOn: '2026-04-22',
    readingTimeLabel: '25 min read',
    tags: ['Tutorial', 'HPC', 'Slurm', 'tmux'],
    href: '/blog/hpc/',
  },
];

export function byNewestFirst(a: BlogPostMeta, b: BlogPostMeta) {
  return new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime();
}

export function getBlogPosts() {
  return [...blogPosts].sort(byNewestFirst);
}
