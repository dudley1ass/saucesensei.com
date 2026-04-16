import type { LibraryArticle } from './types';
import { SCIENCE_ARTICLES_A } from './batchA';
import { SCIENCE_ARTICLES_B } from './batchB';
import { buildRecipeGuideArticles } from '../recipeGuideArticles';

export type { LibraryArticle, ScienceArticle } from './types';

const scienceWithKind: LibraryArticle[] = [...SCIENCE_ARTICLES_A, ...SCIENCE_ARTICLES_B].map((a) => ({
  ...a,
  kind: 'science' as const,
  metaDescription: a.subtitle.length > 155 ? `${a.subtitle.slice(0, 152)}…` : a.subtitle,
}));

const recipeGuides = buildRecipeGuideArticles();

/** All long-form articles: sauce science + per-recipe guides (same URL scheme `/article/:slug`). */
export const LIBRARY_ARTICLES: LibraryArticle[] = [...scienceWithKind, ...recipeGuides];

/** Science-only list (same as before recipe guides were merged). */
export const SCIENCE_ARTICLES: LibraryArticle[] = scienceWithKind;

export function getLibraryArticle(slug: string): LibraryArticle | undefined {
  return LIBRARY_ARTICLES.find((a) => a.slug === slug);
}

export function getScienceArticle(slug: string): LibraryArticle | undefined {
  return getLibraryArticle(slug);
}
