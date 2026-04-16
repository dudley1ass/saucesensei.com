import type { Sauce } from './sauces';

/** Human-readable structural targets (final sauce; after reduction where relevant). */
export type SauceStructuralCopy = {
  headline: string;
  bullets: string[];
  /** Optional numeric guardrails shown next to live % */
  rules?: string[];
};

const BY_FAMILY: Record<Sauce['family'], SauceStructuralCopy> = {
  pan: {
    headline: 'Pan sauce (emulsified reduction)',
    bullets: [
      'Liquid ~60–70% · Fat ~20–30% · Acid ~5–10% · Sweet ~0–3%',
      'Body: reduction + emulsion (butter finish).',
      'Structural: fat ÷ (fat + liquid + body) ≥ ~15% minimum — below ~10% fat tends thin / broken; above ~30% can read greasy.',
    ],
    rules: ['Target fat share of (fat+liquid+body): ≥ 15%', 'Keep fat roughly under ~35% of that same trio to avoid greasy emulsion'],
  },
  roux: {
    headline: 'Roux-based gravy',
    bullets: [
      'Brown: liquid ~75–85% · fat ~8–12% · flour (body) ~5–8% · acid ~0–3%',
      'White: milk ~70–80% · fat ~10–15% · flour ~5–8% · sweet ~2–5% (milk)',
      'Body comes from starch, not fat.',
    ],
  },
  cream: {
    headline: 'Cream sauce',
    bullets: [
      'Cream (liquid) ~65–75% · fat ~20–30% · acid ~0–5% · sweet ~2–5%',
      'Body: gentle reduction. Heat control often matters more than small ratio tweaks.',
    ],
  },
  tomato: {
    headline: 'Tomato sauce',
    bullets: [
      'Tomato (liquid + acid) ~65–75% · fat ~10–20% · acid ~5–10% · sweet ~3–8%',
      'Buffer acid with fat + a little sweet so it does not read sharp alone.',
    ],
  },
  cold: {
    headline: 'Vinaigrette',
    bullets: [
      'Fat (oil) ~70–80% · acid ~20–30% · sweet ~0–10%',
      'Classic ~3:1 oil : acid by volume; emulsion is temporary.',
    ],
  },
  emulsion: {
    headline: 'Mayo / aioli',
    bullets: [
      'Fat ~75–85% · water phase (egg / lemon) ~15–25% · acid ~2–5%',
      'Stable emulsion (unlike vinaigrette) — add oil slowly.',
    ],
  },
  reduction: {
    headline: 'Reduction',
    bullets: [
      'Start liquid 100%; typical finish volume ~30–50% of start (family-dependent).',
      'Optional fat finish ~5–15%; acid depends on base.',
      'Concentration curve matters as much as static ratio.',
    ],
  },
  herb: {
    headline: 'Herb sauce (oil-forward)',
    bullets: [
      'Fat ~50–65% · acid ~5–15% · water (veg) ~10–20% · solids (herbs) ~15–25% · sweet ~0–5%',
      'Oil vs acid balance defines the style.',
    ],
  },
  umami: {
    headline: 'Soy-based glaze',
    bullets: [
      'Liquid ~40–55% · soy (salt load) ~15–25% · sweet ~10–20% · fat ~5–10% · acid ~3–8%',
      'Salt–sweet–acid triangle drives balance.',
    ],
  },
  cheese: {
    headline: 'Cheese sauce',
    bullets: [
      'Liquid ~50–65% · fat ~15–25% · cheese (solids + fat) ~20–35% · acid ~0–3%',
      'Body: emulsion + optional starch. Temperature control > chasing ratios.',
    ],
  },
};

export function structuralCopyForSauce(sauce: Sauce): SauceStructuralCopy {
  return BY_FAMILY[sauce.family] ?? {
    headline: sauce.name,
    bullets: ['Adjust by taste; targets vary by batch and heat.'],
  };
}
