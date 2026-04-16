import type { Sauce } from './sauces';
import { sauces } from './sauces';
import type { LibraryArticle } from './scienceArticles/types';

function wheelNotesForFamily(family: Sauce['family']): string {
  switch (family) {
    case 'pan':
      return 'Pan sauces usually read fat-forward after you mount butter; the wheel helps you see whether acid or salt needs a final nudge before service.';
    case 'roux':
      return 'Roux-thickened sauces balance stock dilution against fat from the roux finish; the wheel highlights salt versus fat dominance so you can correct without guessing.';
    case 'cream':
      return 'Cream sauces concentrate gently; the wheel shows how dairy fat, optional cheese solids, and aromatics stack against acid and salt.';
    case 'tomato':
      return 'Tomato brings natural acid and sweetness; the wheel separates perceived acid from sugar so you can tune with salt, fat, or a pinch of sweet without muddying the picture.';
    case 'cold':
      return 'Cold emulsions (vinaigrettes, dressings) are oil-led; the wheel still maps acid versus perceived sweet from honey, citrus, or dairy.';
    case 'emulsion':
      return 'Mayonnaise-style emulsions are fat-heavy by design; the wheel tracks acid and salt relative to that fat so fixes stay proportional.';
    case 'reduction':
      return 'Reductions climb in salt and acid as water leaves; use the reduction control in the app together with the wheel to avoid overshooting in the last minutes.';
    case 'herb':
      return 'Herb sauces add oil, nuts, and cheese; the wheel keeps fat, salt, and acid pulls visible even when color and aroma steal attention.';
    case 'umami':
      return 'Soy-forward builds stack umami and salt together; the wheel helps you separate “salty” from “deep” when you adjust.';
    case 'cheese':
      return 'Cheese sauces combine dairy fat, starch, and cheese solids; the wheel shows when acid or salt is dominating the finish.';
    default:
      return 'Use the live wheel while you adjust grams — it reflects perceived balance, not raw weights alone.';
  }
}

function buildSections(s: Sauce): { heading: string; paragraphs: string[] }[] {
  const stepsJoined = s.steps.join(' ');
  const uses = s.useFor.length ? s.useFor.map((u) => u.trim()).join(', ') : 'a wide range of dishes';

  const p1 = [
    `${s.name} (${s.subtitle}) is a practical build in the Sauce Sensei library. It belongs to the ${s.variantGroup ?? 'sauce'} family on the hub, and it is written for cooks who want a repeatable method—not a vague “until thickened” story. `,
    `This guide pairs with the interactive recipe: you can change grams, watch the flavor wheel, and read engineering-style guardrails that flag risky ratios before you commit them to the pan. `,
    `Typical service contexts include ${uses}. Keep your tasting spoon nearby; the model is approximate, but it tracks how dilution, fat, and acid tend to read once everything is combined.`,
  ].join('');

  const p2 = [
    `Execution follows the card’s step list: ${stepsJoined} `,
    `Your own stove and pan will change timing, but the order of operations matters as much as the shopping list—especially for emulsified finishes, dairy, and long reductions where the last few minutes move fastest. `,
    `Chef’s note from the recipe: ${s.tip}`,
  ].join('');

  const p3 = [
    `In Sauce Sensei, open this build and treat the wheel as a compass, not a scoreboard. ${wheelNotesForFamily(s.family)} `,
    `Tags on the card (${s.filterTags.join(', ')}) hint at where the sauce shines; align those use cases with salt and acid at the end, because early seasoning can lie once liquids reduce or butter emulsifies.`,
  ].join('');

  const p4 = [
    `When you are ready to publish or teach this sauce, SenseiFood hosts the long-form companion URL that matches this slug. Sauce Sensei stays the interactive lab; SenseiFood is the readable article for sharing, printing, and SEO. `,
    `Bookmark both: the in-app URL under /article/${s.senseiFoodSlug} for your own kitchen, and the SenseiFood link for anyone who prefers a static page or wants to index the content independently.`,
  ].join('');

  const p5 = [
    `Debugging checklist: make one change at a time, taste, then look at the wheel. If the dot sits far from the style target band, decide whether you are solving a ratio problem (salt/acid/fat/sweet) or a process problem (heat, reduction, emulsion break). `,
    `If something tastes great but looks “wrong” on the wheel, trust your palate first—then adjust the model inputs (grams, tags, reduction slider) so the dashboard matches the pan.`,
  ].join('');

  const p6 = [
    `Scaling and substitutions change more than totals—they change how quickly salt and acid concentrate. Doubling a pan sauce for a crowd often means doubling fond and evaporation surface area in ways a linear gram scale does not capture, so re-taste after scaling and expect to adjust acid or finish fat at the end. `,
    `If you swap stock types (vegetable vs beef), change wine styles, or move from butter to cream for the finish, re-open the interactive recipe and update grams so the wheel reflects what is actually in the pot. That keeps your mental model aligned with the sauce you are serving, not the sauce you memorized from last week.`,
  ].join('');

  return [
    {
      heading: `What ${s.name} is for`,
      paragraphs: [p1],
    },
    {
      heading: 'Technique and mise',
      paragraphs: [p2],
    },
    {
      heading: 'How Sauce Sensei reads this build',
      paragraphs: [p3, p5],
    },
    {
      heading: 'Scaling, substitutions, and honest inputs',
      paragraphs: [p6],
    },
    {
      heading: 'SenseiFood, sharing, and indexing',
      paragraphs: [p4],
    },
  ];
}

function metaDescription(s: Sauce): string {
  const base = `${s.name}: ${s.subtitle}. Interactive recipe and balance notes in Sauce Sensei; long-form companion on SenseiFood.`;
  return base.length > 165 ? `${base.slice(0, 160)}…` : base;
}

function buildRecipeGuide(s: Sauce & { senseiFoodSlug: string }): LibraryArticle {
  return {
    slug: s.senseiFoodSlug,
    title: `${s.name}: interactive recipe guide`,
    subtitle: `${s.subtitle} — balance, technique, and how to use the Sauce Sensei wheel for this build.`,
    heroImage: '/sauce-balance-wheel.png',
    senseiFoodSlug: s.senseiFoodSlug,
    kind: 'recipe',
    relatedSauceId: s.id,
    metaDescription: metaDescription(s),
    sections: buildSections(s),
  };
}

export function buildRecipeGuideArticles(): LibraryArticle[] {
  return sauces.filter((s): s is Sauce & { senseiFoodSlug: string } => Boolean(s.senseiFoodSlug)).map(buildRecipeGuide);
}
