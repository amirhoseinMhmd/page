import { hasLegacyFile } from '../lib/legacy-page';

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  summary: string;
  dateLabel: string;
  publishedOn: string;
  tags: string[];
  sourcePath: string;
  listed?: boolean;
  fallbackSuffix?: string;
}

const blogPosts: BlogPostMeta[] = [
  {
    slug: 'hpc',
    title: 'Getting Started with HPC Clusters, Slurm & tmux',
    description:
      'A beginner-friendly, step-by-step guide to connecting to HPC clusters, navigating the terminal, editing files, managing code with Git, and submitting GPU jobs with Slurm.',
    summary:
      'A beginner-friendly, step-by-step guide to connecting to HPC clusters, navigating the terminal, editing files, managing code with Git, and submitting GPU jobs with Slurm. No prior experience required.',
    dateLabel: 'April 2026',
    publishedOn: '2026-04-01',
    tags: ['Tutorial', 'HPC', 'Slurm', 'tmux'],
    sourcePath: 'blog/hpc.html',
    fallbackSuffix: ' debugging companion.</p></div></div>',
  },
  {
    slug: 'mission-accomplished',
    title: "Mission Accomplished? Recovering Information from 'Impossible' Languages with LLMs",
    description:
      'A tutorial walkthrough of an ACL paper exploring whether GPT-2 can recover natural language from linguistically impossible, scrambled inputs.',
    summary:
      "We fine-tune GPT-2 — pre-trained on impossible languages — to translate linguistically degraded inputs back into natural language. Three perturbation types reveal how LLM architectural biases partially mirror human cognitive constraints on information locality.",
    dateLabel: 'April 2026',
    publishedOn: '2026-04-08',
    tags: ['LLMs', 'Impossible Languages', 'Information Locality', 'ACL submission'],
    sourcePath: 'blog/mission-accomplished.html',
    listed: false,
  },
];

function byNewestFirst(a: BlogPostMeta, b: BlogPostMeta) {
  return new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime();
}

export async function getAllBlogPosts() {
  const available = await Promise.all(
    blogPosts.map(async (post) => ((await hasLegacyFile(post.sourcePath)) ? post : null)),
  );

  return available.filter((post): post is BlogPostMeta => post !== null).sort(byNewestFirst);
}

export async function getListedBlogPosts() {
  return (await getAllBlogPosts()).filter((post) => post.listed !== false);
}
