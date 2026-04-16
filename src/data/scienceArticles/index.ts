import type { ScienceArticle } from './types';
import { SCIENCE_ARTICLES_A } from './batchA';
import { SCIENCE_ARTICLES_B } from './batchB';

export type { ScienceArticle };

export const SCIENCE_ARTICLES: ScienceArticle[] = [...SCIENCE_ARTICLES_A, ...SCIENCE_ARTICLES_B];

export function getScienceArticle(slug: string): ScienceArticle | undefined {
  return SCIENCE_ARTICLES.find((a) => a.slug === slug);
}
