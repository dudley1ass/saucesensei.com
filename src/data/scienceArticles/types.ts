export type LibraryArticle = {
  slug: string;
  title: string;
  subtitle: string;
  /** Path under `public/` for hero / inline figures */
  heroImage: string;
  /** SenseiFood route fragment: `slug` or `segment/slug` */
  senseiFoodSlug: string;
  /** Section blocks (each paragraph is rendered separately) */
  sections: { heading: string; paragraphs: string[] }[];
  /** Omitted in legacy batch files — treated as science when missing. */
  kind?: 'science' | 'recipe';
  /** Recipe guides: interactive builder id for `/sauce/:id`. */
  relatedSauceId?: string;
  /** `<meta name="description">` / OG; falls back to subtitle. */
  metaDescription?: string;
};

/** @deprecated Prefer LibraryArticle */
export type ScienceArticle = LibraryArticle;
