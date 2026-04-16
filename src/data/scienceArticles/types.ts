export type ScienceArticle = {
  slug: string;
  title: string;
  subtitle: string;
  /** Path under `public/` for hero / inline figures */
  heroImage: string;
  /** SenseiFood route fragment: `slug` or `segment/slug` */
  senseiFoodSlug: string;
  /** Section blocks (each paragraph is rendered separately) */
  sections: { heading: string; paragraphs: string[] }[];
};
