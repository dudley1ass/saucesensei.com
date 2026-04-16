/** Engineering-style balance checks (approximate buckets from ingredient amounts). */

export type WheelTag = 'salt' | 'fat' | 'acid' | 'sweet' | 'neutral';

export type RecipeLineInput = {
  slotId: string;
  optionId: string;
  grams: number;
  wheelTag?: WheelTag;
};

export type BalanceSeverity = 'ok' | 'info' | 'warn' | 'error';

export type BalanceMessage = {
  severity: BalanceSeverity;
  text: string;
};

export type SauceBalanceResult = {
  totalGrams: number;
  /** Percentages 0–100 for display (approximate). */
  pct: Record<string, number>;
  messages: BalanceMessage[];
};

function pctOf(part: number, total: number): number {
  if (total <= 0) return 0;
  return (part / total) * 100;
}

function add(out: Record<string, number>, key: string, v: number) {
  out[key] = (out[key] ?? 0) + v;
}

/** Spread `grams` across named buckets (values should sum to `grams` when possible). */
function spread(
  grams: number,
  parts: Record<string, number>,
): Record<string, number> {
  const sum = Object.values(parts).reduce((a, b) => a + b, 0);
  if (sum <= 0 || grams <= 0) return {};
  const out: Record<string, number> = {};
  for (const [k, w] of Object.entries(parts)) {
    out[k] = (grams * w) / sum;
  }
  return out;
}

function accumulate(
  buckets: Record<string, number>,
  grams: number,
  parts: Record<string, number>,
) {
  const s = spread(grams, parts);
  for (const [k, v] of Object.entries(s)) add(buckets, k, v);
}

const PAN_IDS = new Set(['pan-sauce', 'pan-sauce-lemon', 'pan-sauce-mustard']);
const CREAM_IDS = new Set(['cream-sauce', 'cream-sauce-mushroom']);
const TOMATO_IDS = new Set(['tomato-sauce', 'tomato-sauce-sweet', 'tomato-sauce-spicy']);
const REDUCTION_IDS = new Set(['reduction', 'reduction-balsamic', 'reduction-stock']);
const HERB_IDS = new Set(['herb-sauce', 'herb-pesto']);
const SOY_IDS = new Set(['soy-umami', 'soy-teriyaki', 'soy-garlic']);
const CHEESE_IDS = new Set(['cheese-sauce', 'cheese-nacho', 'cheese-mornay']);

/** Milk-forward roux gravy — wheel needs lactose + milkfat, not “salt water.” */
const DAIRY_ROUX_IDS = new Set(['white-gravy']);

/** Pan, reduction slider, etc. */
export function isReductionSauceFamily(sauceId: string): boolean {
  return REDUCTION_IDS.has(sauceId);
}

function lineToBuckets(sauceId: string, line: RecipeLineInput): Record<string, number> {
  const { slotId, optionId, grams } = line;
  const b: Record<string, number> = {};
  if (grams <= 0) return b;

  if (slotId.startsWith('custom-')) {
    const tag = line.wheelTag ?? 'neutral';
    if (tag === 'fat') accumulate(b, grams, { fat: 1 });
    else if (tag === 'acid') accumulate(b, grams, { acid: 1 });
    else if (tag === 'sweet') accumulate(b, grams, { sweet: 1 });
    else if (tag === 'salt') {
      if (sauceId === 'soy-umami') accumulate(b, grams, { soy: 1 });
      else accumulate(b, grams, { liquid: 0.82, acid: 0.18 });
    } else accumulate(b, grams, { liquid: 1 });
    return b;
  }

  if (PAN_IDS.has(sauceId)) {
    if (slotId === 'fat') accumulate(b, grams, { fat: 1 });
    else if (slotId === 'aromatic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'wine') accumulate(b, grams, { liquid: 0.88, acid: 0.12 });
    else if (slotId === 'citrus') accumulate(b, grams, { liquid: 0.12, acid: 0.88 });
    else if (slotId === 'stock') accumulate(b, grams, { liquid: 0.97, acid: 0.03 });
    else if (slotId === 'mustard') accumulate(b, grams, { emulsifier: 1, acid: 0.15 });
    else if (slotId === 'cream') accumulate(b, grams, { cream: 1 });
    else if (slotId === 'deglaze') {
      if (optionId === 'wine') accumulate(b, grams, { liquid: 0.88, acid: 0.12 });
      else accumulate(b, grams, { liquid: 0.97, acid: 0.03 });
    } else if (slotId === 'finish') {
      if (optionId === 'cold-butter') accumulate(b, grams, { fat: 1 });
      else accumulate(b, grams, { fat: 0.82, liquid: 0.18 });
    }
    return b;
  }

  if (sauceId === 'white-gravy') {
    if (slotId === 'butter') accumulate(b, grams, { rouxFat: 1 });
    else if (slotId === 'flour') accumulate(b, grams, { flour: 1 });
    else if (slotId === 'milk') {
      // Whole milk: ~87% water phase, ~5% lactose (sweet), ~4% milkfat (fat), ~4% protein/other as body-ish.
      accumulate(b, grams, { liquidDairy: 0.78, sweet: 0.12, fat: 0.06, solid: 0.04 });
    } else if (slotId === 'salt') accumulate(b, grams, { seasoningSalt: 1 });
    return b;
  }

  if (sauceId === 'simple-gravy') {
    if (slotId === 'butter') accumulate(b, grams, { rouxFat: 1 });
    else if (slotId === 'flour') accumulate(b, grams, { flour: 1 });
    else if (slotId === 'stock') accumulate(b, grams, { liquid: 1 });
    else if (slotId === 'salt') accumulate(b, grams, { seasoningSalt: 1 });
    else if (slotId === 'cream') {
      if (optionId === 'cream') accumulate(b, grams, { liquid: 0.55, fat: 0.45 });
      else accumulate(b, grams, { liquid: 0.92, fat: 0.08 });
    }
    return b;
  }

  if (CREAM_IDS.has(sauceId)) {
    if (slotId === 'fat') accumulate(b, grams, { extraFat: 1 });
    else if (slotId === 'garlic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'cream') accumulate(b, grams, { cream: 1 });
    else if (slotId === 'cheese') accumulate(b, grams, { cheese: 0.55, solid: 0.45 });
    else if (slotId === 'mushrooms') accumulate(b, grams, { solid: 0.55, tomato: 0.45 });
    return b;
  }

  if (TOMATO_IDS.has(sauceId)) {
    if (slotId === 'oil') accumulate(b, grams, { fat: 1 });
    else if (slotId === 'butter') accumulate(b, grams, { fat: 1 });
    else if (slotId === 'garlic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'tomatoes') accumulate(b, grams, { tomato: 1 });
    else if (slotId === 'sugar') accumulate(b, grams, { sweet: 1 });
    else if (slotId === 'salt') accumulate(b, grams, { seasoningSalt: 1 });
    else if (slotId === 'basil') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'chili') accumulate(b, grams, { solid: 0.7, acid: 0.3 });
    else if (slotId === 'vinegar') accumulate(b, grams, { acid: 0.95, liquid: 0.05 });
    return b;
  }

  if (sauceId === 'vinaigrette') {
    if (slotId === 'oil') accumulate(b, grams, { oil: 1 });
    else if (slotId === 'acid') accumulate(b, grams, { acid: 1 });
    else if (slotId === 'mustard') accumulate(b, grams, { emulsifier: 1, acid: 0.15 });
    else if (slotId === 'salt') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'sweet') accumulate(b, grams, { sweet: 0.55, liquid: 0.45 });
    return b;
  }

  if (sauceId === 'mayo-aioli') {
    if (slotId === 'yolk') accumulate(b, grams, { waterPhase: 0.55, solid: 0.25, emulsifier: 0.2 });
    else if (slotId === 'oil') accumulate(b, grams, { oilHeavy: 1 });
    else if (slotId === 'mayo') {
      if (optionId === 'mayo') accumulate(b, grams, { oilHeavy: 0.78, waterPhase: 0.22 });
      else accumulate(b, grams, { waterPhase: 0.78, fat: 0.12, solid: 0.1 });
    } else if (slotId === 'garlic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'acid') accumulate(b, grams, { acid: 0.9, waterPhase: 0.1 });
    else if (slotId === 'heat') accumulate(b, grams, { liquid: 0.85, solid: 0.15 });
    return b;
  }

  if (REDUCTION_IDS.has(sauceId)) {
    if (slotId === 'stock' || slotId === 'wine' || slotId === 'liquid')
      accumulate(b, grams, { reductionLiquid: 1 });
    else if (slotId === 'sweet') accumulate(b, grams, { sweet: 1 });
    else if (slotId === 'aromatic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'finish') {
      if (optionId === 'none') return b;
      accumulate(b, grams, { finishFat: 1 });
    }
    return b;
  }

  if (HERB_IDS.has(sauceId)) {
    if (slotId === 'herbs') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'oil') accumulate(b, grams, { oil: 1 });
    else if (slotId === 'acid') accumulate(b, grams, { acid: 1 });
    else if (slotId === 'garlic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'nuts') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'cheese') accumulate(b, grams, { cheese: 0.75, solid: 0.25 });
    return b;
  }

  if (SOY_IDS.has(sauceId)) {
    if (slotId === 'soy') accumulate(b, grams, { soy: 1 });
    else if (slotId === 'sweet') accumulate(b, grams, { sweet: 1 });
    else if (slotId === 'garlic') accumulate(b, grams, { solid: 1 });
    else if (slotId === 'water') {
      if (sauceId === 'soy-teriyaki' && optionId === 'mirin')
        accumulate(b, grams, { diluent: 0.55, sweet: 0.45 });
      else accumulate(b, grams, { diluent: 1 });
    } else if (slotId === 'oil') accumulate(b, grams, { fat: 1 });
    else if (slotId === 'acid') {
      if (optionId === 'none') return b;
      accumulate(b, grams, { acid: 1 });
    }
    return b;
  }

  if (CHEESE_IDS.has(sauceId)) {
    if (slotId === 'base') {
      if (optionId === 'cream') accumulate(b, grams, { liquidDairy: 0.55, fat: 0.45 });
      else accumulate(b, grams, { liquidDairy: 0.93, fat: 0.07 });
    } else if (slotId === 'butter') accumulate(b, grams, { fat: 1 });
    else if (slotId === 'thickener') accumulate(b, grams, { stabilizer: 1 });
    else if (slotId === 'cheese') accumulate(b, grams, { cheese: 1 });
    else if (slotId === 'mustard') accumulate(b, grams, { acid: 0.35, emulsifier: 0.65 });
    else if (slotId === 'spice') accumulate(b, grams, { solid: 1 });
    return b;
  }

  return b;
}

/** Merge all internal buckets for every recipe line (grams-weighted). */
export function aggregateLineBuckets(sauceId: string, lines: RecipeLineInput[]): Record<string, number> {
  const buckets: Record<string, number> = {};
  for (const line of lines) {
    const part = lineToBuckets(sauceId, line);
    for (const [k, v] of Object.entries(part)) add(buckets, k, v);
  }
  return buckets;
}

export type SauceWheelTexture = 'thin' | 'medium-thin' | 'medium' | 'thick';

export type SauceWheelResult = {
  quad: { salt: number; fat: number; acid: number; sweet: number };
  dx: number;
  dy: number;
  pctSalt: number;
  pctFat: number;
  pctAcid: number;
  pctSweet: number;
  /** 0–100 independent “taste pressure” scores (not additive). */
  scores: { salt: number; fat: number; acid: number; sweet: number; umami: number };
  /** 0–100 how loud / concentrated the build reads. */
  intensity: number;
  texture: SauceWheelTexture;
  positionSummary: string;
  why: string[];
  suggestions: string[];
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function scoreFromMass(u: number, anchor: number): number {
  if (u <= 0) return 0;
  return clamp(Math.round((100 * u) / (u + anchor)), 0, 100);
}

function liquidBulkFromBuckets(b: Record<string, number>): number {
  return (
    (b.liquid ?? 0) +
    (b.diluent ?? 0) +
    (b.reductionLiquid ?? 0) +
    (b.waterPhase ?? 0) * 0.92 +
    (b.liquidDairy ?? 0) * 0.85 +
    (b.cream ?? 0) * 0.5
  );
}

function starchBulkFromBuckets(b: Record<string, number>): number {
  return (b.flour ?? 0) + (b.stabilizer ?? 0) + (b.emulsifier ?? 0) * 0.35 + (b.cheese ?? 0) * 0.08;
}

function buildTexture(b: Record<string, number>, M: number): SauceWheelTexture {
  if (M <= 0) return 'medium-thin';
  const liq = liquidBulkFromBuckets(b);
  const starch = starchBulkFromBuckets(b);
  const liqR = liq / M;
  const stR = starch / M;
  if (stR > 0.09 || (stR > 0.055 && liqR < 0.5)) return 'thick';
  if (liqR > 0.78) return 'thin';
  if (liqR > 0.62) return 'medium-thin';
  return 'medium';
}

function rawFlavorMasses(sauceId: string, lines: RecipeLineInput[]): {
  salt: number;
  fat: number;
  acid: number;
  sweet: number;
  umami: number;
  M: number;
  buckets: Record<string, number>;
} {
  const buckets = aggregateLineBuckets(sauceId, lines);
  let fat = 0;
  let acid = 0;
  let sweet = 0;
  let salt = 0;
  let umami = 0;

  const dairySaltCoeff = DAIRY_ROUX_IDS.has(sauceId) ? 0.016 : 0.045;
  const seasoningSaltCoeff = DAIRY_ROUX_IDS.has(sauceId) ? 30 : 42;
  /** Stock-forward gravies: unsalted stock shouldn’t read as heavy salt on the wheel. */
  const liquidSaltCoeff = sauceId === 'simple-gravy' ? 0.048 : 0.07;

  for (const line of lines) {
    const bk = lineToBuckets(sauceId, line);
    fat +=
      (bk.fat ?? 0) +
      (bk.oil ?? 0) +
      (bk.oilHeavy ?? 0) * 0.85 +
      (bk.rouxFat ?? 0) +
      (bk.finishFat ?? 0) +
      (bk.extraFat ?? 0) +
      (bk.cream ?? 0) * 0.45 +
      (bk.cheese ?? 0) * 0.22;
    acid += (bk.acid ?? 0) + (bk.emulsifier ?? 0) * 0.12 + (bk.tomato ?? 0) * 0.06;
    sweet += bk.sweet ?? 0;
    salt +=
      (bk.soy ?? 0) * 2.8 +
      (bk.reductionLiquid ?? 0) * 0.09 +
      (bk.liquid ?? 0) * liquidSaltCoeff +
      (bk.liquidDairy ?? 0) * dairySaltCoeff +
      (bk.diluent ?? 0) * 0.035 +
      (bk.seasoningSalt ?? 0) * seasoningSaltCoeff;
    umami +=
      (bk.soy ?? 0) * 2.2 +
      (bk.cheese ?? 0) * 0.28 +
      (bk.tomato ?? 0) * 0.1 +
      (bk.reductionLiquid ?? 0) * 0.06 +
      (bk.solid ?? 0) * 0.02;
  }

  const M = Object.values(buckets).reduce((a, v) => a + v, 0);

  // High dairy dilutes perceived salinity vs raw NaCl grams (especially “salt to taste” on biscuits).
  if (DAIRY_ROUX_IDS.has(sauceId) && M > 0) {
    const dairyL = buckets.liquidDairy ?? 0;
    const df = dairyL / M;
    if (df > 0.45) {
      salt *= 1 / (1 + 0.62 * df);
    }
  }

  return { salt, fat, acid, sweet, umami, M, buckets };
}

function applyPerception(
  raw: { salt: number; fat: number; acid: number; sweet: number; umami: number; M: number; buckets: Record<string, number> },
  sauceId: string,
  opts?: { reductionRemainingPct?: number },
): {
  pSalt: number;
  pFat: number;
  pAcid: number;
  pSweet: number;
  pUmami: number;
  intensity: number;
  texture: SauceWheelTexture;
} {
  const { buckets, M } = raw;
  let { salt, fat, acid, sweet, umami } = raw;

  const rem = isReductionSauceFamily(sauceId) ? clamp(opts?.reductionRemainingPct ?? 100, 5, 100) : 100;
  const concentration = rem >= 96 ? 1 : Math.min(2.35, 100 / Math.max(rem, 14));

  const liquidB = liquidBulkFromBuckets(buckets);
  const dilutionRatio = M > 0 ? liquidB / M : 0.5;
  const dilutePercept = 1 / (1 + 0.62 * dilutionRatio);

  const flavorSum = salt + fat + acid + sweet + 1e-9;
  const fatFrac = fat / (flavorSum + umami * 0.15);
  const sweetFrac = sweet / (flavorSum + 1e-9);

  const fatSuppressSalt = 1 / (1 + 0.88 * fatFrac);
  const fatSuppressAcid = 1 / (1 + 0.72 * fatFrac);
  const sweetSuppressAcid = 1 / (1 + 0.95 * sweetFrac);

  let pSalt = salt * concentration * dilutePercept * fatSuppressSalt;
  let pAcid = acid * concentration * dilutePercept * fatSuppressAcid * sweetSuppressAcid;
  let pSweet = sweet * Math.pow(concentration, 0.55) * dilutePercept;
  let pFat = fat * (1 + 0.08 * (1 - dilutePercept));
  let pUmami = umami * concentration * dilutePercept * (1 / (1 + 0.42 * fatFrac));

  const roundness = clamp(0.28 * Math.min(1, fatFrac * 2.2), 0, 0.26);
  const diluteCenterPull = clamp(0.22 * Math.min(1, dilutionRatio * 1.15), 0, 0.22);
  const centerPull = clamp(roundness + diluteCenterPull, 0, 0.42);
  const scaleDown = 1 - centerPull;
  pSalt *= scaleDown;
  pAcid *= scaleDown;
  pSweet *= scaleDown;
  pFat *= scaleDown;
  pUmami *= scaleDown;

  const texture = buildTexture(buckets, M);
  if (texture === 'thick') {
    pAcid *= 0.92;
    pSalt *= 1.04;
  }

  const loud = concentration * (1.15 - 0.45 * dilutePercept);
  const intensity = clamp(Math.round(22 + 78 * clamp(loud / 2.2, 0, 1)), 0, 100);

  return { pSalt, pFat, pAcid, pSweet, pUmami, intensity, texture };
}

function deriveNarration(
  p: { pSalt: number; pFat: number; pAcid: number; pSweet: number; pUmami: number },
  scores: SauceWheelResult['scores'],
  concentration: number,
  rem: number,
  buckets: Record<string, number>,
): Pick<SauceWheelResult, 'positionSummary' | 'why' | 'suggestions'> {
  const sug: string[] = [];
  const ti = p.pSalt + p.pFat + p.pAcid + p.pSweet + 1e-9;
  const relAcid = p.pAcid / ti;
  const relFat = p.pFat / ti;

  if (scores.salt >= 62) sug.push('Drifting salty — add fat, stock, or water to dilute.');
  if (relAcid > 0.34 && relFat < 0.22) sug.push('Too sharp for current fat level — try butter, cream, or less acid.');
  if (concentration > 1.35 && scores.salt >= 48) sug.push('Reduction has concentrated salt / acid — taste often; add liquid if it tightens.');
  if (relFat > 0.42 && scores.acid < 38) sug.push('Fat-forward — a splash of acid can lift the finish.');
  if (scores.sweet >= 58 && relAcid < 0.18) sug.push('Sweet is carrying hard — balance with acid or salt.');
  if (scores.umami >= 60 && scores.salt >= 55) sug.push('Umami + salt stack — dilute or add fat to round the edge.');

  const parts: string[] = [];
  if (scores.acid >= 55 && scores.salt >= 52) parts.push('sharp and slightly salty');
  else if (scores.acid >= 55) parts.push('bright / acid-led');
  else if (scores.salt >= 58) parts.push('salty / savory-led');
  else if (scores.fat >= 58) parts.push('rich / fat-led');
  else if (scores.sweet >= 55) parts.push('sweet-leaning');
  else if (scores.umami >= 56 && scores.salt < 52) parts.push('deep / umami-led');
  else parts.push('fairly balanced');

  const positionSummary = `Current position: ${parts[0]}`;

  const why: string[] = [];
  if ((buckets.soy ?? 0) > 8) why.push('soy / tamari');
  if ((buckets.reductionLiquid ?? 0) > 40 && rem < 92) why.push('reduction');
  if ((buckets.acid ?? 0) > 12 || (buckets.emulsifier ?? 0) > 6) why.push('vinegar / citrus / mustard');
  if ((buckets.sweet ?? 0) > 15) why.push('sweet layer (sugar, honey, or milk lactose)');
  if ((buckets.finishFat ?? 0) + (buckets.fat ?? 0) + (buckets.oil ?? 0) > 35) why.push('butter / oil / cream');
  if ((buckets.diluent ?? 0) + (buckets.liquid ?? 0) > 120) why.push('stock / water dilution');
  if (why.length === 0) why.push('ingredient mix');

  if (sug.length === 0) sug.push('Tweak amounts — the wheel uses perceived balance, not raw grams.');

  return { positionSummary, why, suggestions: sug.slice(0, 4) };
}

export function evaluateSauceBalance(
  sauceId: string,
  lines: RecipeLineInput[],
  opts?: { reductionRemainingPct?: number },
): SauceBalanceResult {
  const buckets: Record<string, number> = {};
  for (const line of lines) {
    const part = lineToBuckets(sauceId, line);
    for (const [k, v] of Object.entries(part)) add(buckets, k, v);
  }

  const totalGrams = Object.values(buckets).reduce((a, b) => a + b, 0);
  const pct: Record<string, number> = {};
  for (const [k, v] of Object.entries(buckets)) {
    pct[k] = pctOf(v, totalGrams);
  }

  const messages: BalanceMessage[] = [];
  const push = (severity: BalanceSeverity, text: string) =>
    messages.push({ severity, text });

  const eng = computeEngineeringStructure(sauceId, lines, opts);
  pct.structLiquid = Math.round(eng.liquidPct * 10) / 10;
  pct.structFat = Math.round(eng.fatPct * 10) / 10;
  pct.structAcid = Math.round(eng.acidPct * 10) / 10;
  pct.structSweet = Math.round(eng.sweetPct * 10) / 10;
  pct.structBody = Math.round(eng.bodyPct * 10) / 10;
  pct.structFatRatio = Math.round(eng.fatRatio * 1000) / 10;

  if (PAN_IDS.has(sauceId)) {
    const fr = eng.fatRatio * 100;
    push(
      'info',
      'Pan sauce (emulsified reduction): targets are ~60–70% liquid, ~20–30% fat, ~5–10% acid, ~0–3% sweet (after typical deglaze/stock reduction, before mounting butter).',
    );
    if (fr < 15) {
      push(
        'error',
        `Fat ÷ (fat + liquid + body) is ~${fr.toFixed(0)}% — need ≥15% for a stable emulsified finish (below ~10% reads thin or broken). Add cold butter, reduce liquid further, or mount in two stages.`,
      );
    } else if (fr > 34) {
      push(
        'warn',
        `Fat ÷ (fat + liquid + body) is ~${fr.toFixed(0)}% — above ~30% the finish can read greasy or split more easily.`,
      );
    }
    if (eng.liquidPct < 56 || eng.liquidPct > 74) {
      push(
        eng.liquidPct < 56 ? 'error' : 'warn',
        `Engineering liquid is ~${eng.liquidPct.toFixed(0)}% (guide ~60–70%). ${
          eng.liquidPct < 56
            ? 'Too little free liquid makes mounting butter finicky.'
            : 'Very liquid-forward — reduce more before the butter finish, or use less deglaze/stock.'
        }`,
      );
    }
    if (eng.fatPct < 17 || eng.fatPct > 34) {
      push(
        eng.fatPct < 17 ? 'warn' : 'warn',
        `Fat is ~${eng.fatPct.toFixed(0)}% of modeled sauce mass (guide ~20–30%). ${
          eng.fatPct < 17 ? 'Lean builds need more finish fat or a tighter reduction.' : 'High fat% — watch for greasy mouthfeel.'
        }`,
      );
    }
    if (eng.acidPct > 12) {
      push(
        'warn',
        `Acid is ~${eng.acidPct.toFixed(0)}% (guide ~5–10%). Above ~12% it can taste sharp before fat rounds it.`,
      );
    }
    if (eng.sweetPct > 4) {
      push('info', `Sweet reads ~${eng.sweetPct.toFixed(0)}% (guide ~0–3% for classic savory pan sauce).`);
    }
    if (fr >= 15 && eng.liquidPct >= 56 && eng.liquidPct <= 74 && eng.fatPct >= 17 && eng.fatPct <= 34 && eng.acidPct <= 12) {
      push(
        'ok',
        `Structure looks workable: liquid ~${eng.liquidPct.toFixed(0)}%, fat ~${eng.fatPct.toFixed(0)}%, fat/(fat+liq+body) ~${fr.toFixed(0)}% (≥15%).`,
      );
    }
  }

  if (sauceId === 'white-gravy') {
    const butterG = lines.find((l) => l.slotId === 'butter')?.grams ?? 0;
    const flourG = lines.find((l) => l.slotId === 'flour')?.grams ?? 0;
    const milkG = lines.find((l) => l.slotId === 'milk')?.grams ?? 0;
    const flour = buckets.flour ?? 0;
    const t = milkG + (buckets.rouxFat ?? 0) + flour + (buckets.fat ?? 0);
    const milkPct = pctOf(milkG, t);
    const flourPct = pctOf(flour, t);
    push('info', 'White gravy: roux + milk — dairy scorches faster than stock; keep a gentle bubble.');
    if (butterG > 0 && flourG > 0) {
      const ratio = butterG / flourG;
      if (ratio < 0.75 || ratio > 1.34) {
        push(
          'error',
          `Roux fat:flour is about ${ratio.toFixed(2)}:1 by weight (target ~1:1). Fix the roux before scaling.`,
        );
      }
    }
    if (flourPct > 10) {
      push('warn', `Flour is ~${flourPct.toFixed(0)}% of the build — watch for pasty mouthfeel.`);
    }
    if (milkPct < 68) {
      push('warn', `Milk is ~${milkPct.toFixed(0)}% of the build (guide ~70–80% liquid for white gravy).`);
    }
    push(
      'info',
      'White gravy engineering targets: milk ~70–80%, fat ~10–15%, starch ~5–8%, sweet from milk ~2–5%.',
    );
    if (eng.liquidPct < 68 || eng.liquidPct > 84) {
      push(
        'warn',
        `Modeled liquid is ~${eng.liquidPct.toFixed(0)}% (guide ~70–80%). Adjust milk vs roux or simmer to thicken.`,
      );
    }
    if (eng.fatPct < 8 || eng.fatPct > 17) {
      push(
        'warn',
        `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~10–15%). Roux fat + dairy fat should land in that band.`,
      );
    }
    if (eng.bodyPct < 4 || eng.bodyPct > 10) {
      push(
        'warn',
        `Starch / body reads ~${eng.bodyPct.toFixed(0)}% (guide ~5–8%). Too little stays thin; too much goes pasty.`,
      );
    }
    if (eng.sweetPct < 1.5 || eng.sweetPct > 7) {
      push(
        'info',
        `Sweet (mostly lactose) reads ~${eng.sweetPct.toFixed(0)}% (guide ~2–5%).`,
      );
    }
    if (
      eng.liquidPct >= 68 &&
      eng.liquidPct <= 84 &&
      eng.fatPct >= 8 &&
      eng.fatPct <= 17 &&
      eng.bodyPct >= 4 &&
      eng.bodyPct <= 10
    ) {
      push('ok', `Gravy structure looks on-target: liquid ~${eng.liquidPct.toFixed(0)}%, fat ~${eng.fatPct.toFixed(0)}%, body ~${eng.bodyPct.toFixed(0)}%.`);
    }
  }

  if (sauceId === 'simple-gravy') {
    const butterG = lines.find((l) => l.slotId === 'butter')?.grams ?? 0;
    const flourG = lines.find((l) => l.slotId === 'flour')?.grams ?? 0;
    const liquid = buckets.liquid ?? 0;
    const flour = buckets.flour ?? 0;
    const t = liquid + (buckets.rouxFat ?? 0) + flour + (buckets.fat ?? 0);
    const liqPct = pctOf(liquid, t);
    const flourPct = pctOf(flour, t);

    push('info', 'Gravy (roux): key move is ~1:1 fat:flour in the roux, then dilute ~10–12× with stock.');
    if (butterG > 0 && flourG > 0) {
      const ratio = butterG / flourG;
      if (ratio < 0.75 || ratio > 1.34) {
        push(
          'error',
          `Roux fat:flour is about ${ratio.toFixed(2)}:1 by weight (target ~1:1). Off-balance roux reads greasy or pasty before you even add stock — fix the roux before scaling servings.`,
        );
      }
    }
    if (flourPct > 10) {
      push(
        'error',
        `Flour is ~${flourPct.toFixed(0)}% of the whole sauce (guide ~5–8%). Above ~10% you risk gluey / pasty body.`,
      );
    }
    if (liqPct > 85) {
      push(
        'warn',
        `Stock is ~${liqPct.toFixed(0)}% of the build (guide ~75–85%). Much above ~85% tends to taste thin and watery.`,
      );
    }
    if ((buckets.rouxFat ?? 0) / (t || 1) < 0.03 && butterG < flourG * 0.5) {
      push(
        'warn',
        'Fat looks quite low relative to flour/stock — the sauce can read flat or dull without enough fat in the roux.',
      );
    }
    push(
      'info',
      'Brown gravy engineering targets: liquid ~75–85%, roux fat ~8–12%, starch body ~5–8%, acid ~0–3%.',
    );
    if (eng.liquidPct < 73 || eng.liquidPct > 88) {
      push(
        'warn',
        `Modeled liquid is ~${eng.liquidPct.toFixed(0)}% (guide ~75–85%). Simmer to concentrate or add stock to adjust.`,
      );
    }
    if (eng.fatPct < 6.5 || eng.fatPct > 14) {
      push(
        'warn',
        `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~8–12%). Roux butter/drippings carry most of this.`,
      );
    }
    if (eng.bodyPct < 4 || eng.bodyPct > 10) {
      push(
        'warn',
        `Starch / body reads ~${eng.bodyPct.toFixed(0)}% (guide ~5–8%).`,
      );
    }
    if (eng.liquidPct >= 73 && eng.liquidPct <= 88 && eng.fatPct >= 6.5 && eng.fatPct <= 14 && eng.bodyPct >= 4 && eng.bodyPct <= 10) {
      push('ok', `Gravy structure looks on-target: liquid ~${eng.liquidPct.toFixed(0)}%, fat ~${eng.fatPct.toFixed(0)}%, body ~${eng.bodyPct.toFixed(0)}%.`);
    }
  }

  if (CREAM_IDS.has(sauceId)) {
    push(
      'info',
      'Cream sauce: engineering targets ~65–75% dairy liquid, ~20–30% fat, ~0–5% acid, ~2–5% sweet — gentle heat matters as much as ratios.',
    );
    if (eng.liquidPct < 58 || eng.liquidPct > 80) {
      push(
        'warn',
        `Modeled liquid phase is ~${eng.liquidPct.toFixed(0)}% (guide ~65–75%).`,
      );
    }
    if (eng.fatPct < 16 || eng.fatPct > 34) {
      push(
        'warn',
        `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~20–30% including butter and cream lipids).`,
      );
    }
    if (eng.acidPct > 6) {
      push('info', `Acid reads ~${eng.acidPct.toFixed(0)}% (guide ~0–5% unless you add wine/lemon).`);
    }
    if (eng.sweetPct > 7) {
      push('info', `Sweet reads ~${eng.sweetPct.toFixed(0)}% (guide ~2–5% from dairy / cheese).`);
    }
    if (eng.liquidPct >= 58 && eng.liquidPct <= 80 && eng.fatPct >= 16 && eng.fatPct <= 34) {
      push('ok', `Cream sauce structure looks workable: liquid ~${eng.liquidPct.toFixed(0)}%, fat ~${eng.fatPct.toFixed(0)}%.`);
    }
  }

  if (TOMATO_IDS.has(sauceId)) {
    const tom = buckets.tomato ?? 0;
    const fat = buckets.fat ?? 0;
    const t = tom + fat + (buckets.solid ?? 0);
    const tomPct = pctOf(tom, t);
    const fatPct = pctOf(fat, t);
    push(
      'info',
      'Tomato sauce: butter or oil is often the “mouthfeel balancer” — fat too low can feel thin even when flavor is fine.',
    );
    if (fatPct < 8) {
      push('warn', `Fat is ~${fatPct.toFixed(0)}% (guide ~10–15%). Fat too low can feel thin in the mouth.`);
    }
    if (fatPct > 20) {
      push(
        'warn',
        `Fat is ~${fatPct.toFixed(0)}%. Very high fat can separate or feel oily compared to a classic red sauce.`,
      );
    }
    if (tomPct < 60) {
      push(
        'warn',
        `Tomato solids are ~${tomPct.toFixed(0)}% (guide ~70–80%). Lower tomato % can read more like “soup” than sauce unless you reduce hard.`,
      );
    }
    push(
      'info',
      'Tomato sauce engineering: tomato + acid phase ~65–75%, fat ~10–20%, sweet ~3–8% (fat + sweet buffer acid).',
    );
    if (eng.fatPct < 8 || eng.fatPct > 24) {
      push(
        'warn',
        `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~10–20%).`,
      );
    }
    if (eng.sweetPct < 2 || eng.sweetPct > 10) {
      push(
        'info',
        `Sweet reads ~${eng.sweetPct.toFixed(0)}% (guide ~3–8% when you need to balance sharp tomato).`,
      );
    }
    if (tomPct >= 60 && eng.fatPct >= 8 && eng.fatPct <= 24) {
      push('ok', `Tomato build looks structurally reasonable: tomato-forward ~${tomPct.toFixed(0)}%, fat ~${eng.fatPct.toFixed(0)}%.`);
    }
  }

  if (sauceId === 'vinaigrette') {
    const oil = buckets.oil ?? 0;
    const acid = buckets.acid ?? 0;
    const em = buckets.emulsifier ?? 0;
    const oilAcid = oil + acid;
    const oilOfEmulsion = pctOf(oil, oilAcid);
    const acidOfEmulsion = pctOf(acid, oilAcid);
    pct.oilInEmulsion = oilOfEmulsion;
    pct.acidInEmulsion = acidOfEmulsion;

    push(
      'info',
      'Classic vinaigrette emulsion: ~3:1 oil to acid (75% / 25% of the oil+acid mix), plus mustard as emulsifier.',
    );
    if (oilOfEmulsion < 65) {
      push(
        'warn',
        `Oil is only ~${oilOfEmulsion.toFixed(0)}% of the oil+acid mix (guide ~70–80%). Below ~65% it tends to taste sharp/harsh.`,
      );
    }
    if (acidOfEmulsion < 15) {
      push(
        'warn',
        `Acid is only ~${acidOfEmulsion.toFixed(0)}% of the oil+acid mix (guide ~20–30%). Too little acid can taste flat.`,
      );
    }
    const emPct = pctOf(em, totalGrams);
    if (totalGrams > 40 && emPct < 0.6) {
      push(
        'warn',
        'Mustard (emulsifier) is very low — the dressing will separate faster without enough emulsifier or aggressive whisking.',
      );
    }
    push('info', 'Vinaigrette engineering: oil ~70–80% and acid ~20–30% of the oil+acid phase (classic ~3:1).');
    if (eng.fatPct < 62 || eng.fatPct > 82) {
      push('info', `Modeled fat (oil-forward) is ~${eng.fatPct.toFixed(0)}% of total mass — compare to your oil slider.`);
    }
    if (oilOfEmulsion >= 68 && acidOfEmulsion >= 18) {
      push('ok', 'Oil : acid split looks close to a classic vinaigrette window.');
    }
  }

  if (sauceId === 'mayo-aioli') {
    const oilH = buckets.oilHeavy ?? 0;
    const water = buckets.waterPhase ?? 0;
    const t = oilH + water + (buckets.fat ?? 0) + (buckets.solid ?? 0) + (buckets.acid ?? 0);
    const oilLike = oilH + (buckets.fat ?? 0) * 0.55;
    const waterLike = water + (buckets.fat ?? 0) * 0.45;
    const oilPct = pctOf(oilLike, t);
    const waterPct = pctOf(waterLike, t);
    pct.oilLikeMayo = oilPct;
    pct.waterPhaseMayo = waterPct;
    push(
      'info',
      'Mayo / aioli: high-fat stabilized emulsion — add oil slowly; dumping oil too fast is a common break point.',
    );
    if (oilPct < 70) {
      push(
        'warn',
        `Oil-like phase looks ~${oilPct.toFixed(0)}% (guide ~75–85%). Too little oil vs water phase can struggle to emulsify.`,
      );
    }
    if (waterPct < 12) {
      push(
        'warn',
        `Water phase looks tight (~${waterPct.toFixed(0)}%). Too little water phase can make emulsification finicky.`,
      );
    }
    if (eng.fatPct < 72 || eng.fatPct > 88) {
      push(
        'warn',
        `Oil / fat phase is ~${eng.fatPct.toFixed(0)}% of modeled mass (guide ~75–85% for mayo-style emulsions).`,
      );
    }
    if (eng.acidPct > 6) {
      push('warn', `Acid is ~${eng.acidPct.toFixed(0)}% (guide ~2–5% for stable mayo).`);
    }
    if (eng.fatPct >= 72 && eng.fatPct <= 88 && oilPct >= 70) {
      push('ok', `Mayo / aioli structure looks workable: fat ~${eng.fatPct.toFixed(0)}%, oil-like phase ~${oilPct.toFixed(0)}%.`);
    }
  }

  if (REDUCTION_IDS.has(sauceId)) {
    const liq = buckets.reductionLiquid ?? 0;
    const finish = buckets.finishFat ?? 0;
    const solid = buckets.solid ?? 0;
    const rem = Math.min(100, Math.max(5, opts?.reductionRemainingPct ?? 100));
    const effectiveLiq = liq * (rem / 100);
    const tEff = effectiveLiq + finish + solid;
    const finishPctEff = pctOf(finish, tEff);
    pct.finishFatReduction = finishPctEff;
    pct.reductionRemaining = rem;
    pct.effectiveLiquidPct = pctOf(effectiveLiq, tEff);

    push(
      'info',
      'Reduction: this is a concentration curve — you are mostly evaporating water until viscosity does the work.',
    );
    if (finishPctEff > 14) {
      push(
        'warn',
        `Finish fat is ~${finishPctEff.toFixed(0)}% of the reduced mix (guide optional finish ~5–15%). Too much butter can feel greasy vs a clean glaze.`,
      );
    }
    if (rem < 35) {
      push(
        'warn',
        'Strong reduction (low % remaining): over-reduction can concentrate salt/bitterness — taste often and add liquid if it tightens too fast.',
      );
    }
    if (rem > 70 && pctOf(effectiveLiq, tEff) > 0.88) {
      push(
        'warn',
        'Still very liquid-forward after your reduction slider — under-reduction stays thin and will not coat like a plating sauce.',
      );
    }
    if (rem >= 30 && rem <= 55 && finishPctEff <= 14 && pctOf(effectiveLiq, tEff) <= 0.82) {
      push('ok', 'Reduction curve looks in a plating-friendly zone for many glazes.');
    }
  }

  if (HERB_IDS.has(sauceId)) {
    const oil = buckets.oil ?? 0;
    const acid = buckets.acid ?? 0;
    const solid = buckets.solid ?? 0;
    const t = oil + acid + solid;
    const oilPct = pctOf(oil, t);
    const acidPct = pctOf(acid, t);
    const solidPct = pctOf(solid, t);
    pct.oilHerb = oilPct;
    pct.acidHerb = acidPct;
    pct.solidHerb = solidPct;
    push('info', 'Herb sauce: oil + solids + acid — too dry reads pasty; too much oil reads greasy.');
    if (oilPct > 68) {
      push('warn', `Oil is ~${oilPct.toFixed(0)}% (guide ~50–65%). Oil too high can feel greasy vs bright/herby.`);
    }
    if (acidPct < 4) {
      push(
        'warn',
        `Acid is only ~${acidPct.toFixed(0)}% (guide ~5–10%). Acid too low can taste flat next to the oil.`,
      );
    }
    if (solidPct > 40) {
      push(
        'warn',
        `Solids are ~${solidPct.toFixed(0)}% (guide ~20–30% for many chimichurri/pesto builds). Very high solids can read pasty or “dry.”`,
      );
    }
    push(
      'info',
      'Herb sauce engineering: fat ~50–65%, acid ~5–15%, solids/herbs ~15–25%, sweet ~0–5%.',
    );
    if (eng.fatPct < 42 || eng.fatPct > 70) {
      push('warn', `Modeled fat / oil is ~${eng.fatPct.toFixed(0)}% (guide ~50–65%).`);
    }
    if (eng.acidPct < 3.5 || eng.acidPct > 18) {
      push('warn', `Modeled acid is ~${eng.acidPct.toFixed(0)}% (guide ~5–15%).`);
    }
    if (oilPct >= 48 && oilPct <= 68 && eng.fatPct >= 42 && eng.fatPct <= 70) {
      push('ok', `Herb oil structure looks workable: oil fraction ~${oilPct.toFixed(0)}%, modeled fat ~${eng.fatPct.toFixed(0)}%.`);
    }
  }

  if (SOY_IDS.has(sauceId)) {
    const soy = buckets.soy ?? 0;
    const sweet = buckets.sweet ?? 0;
    const diluent = buckets.diluent ?? 0;
    const acid = buckets.acid ?? 0;
    const t = soy + sweet + diluent + acid + (buckets.solid ?? 0);
    const soyPct = pctOf(soy, t);
    const sweetPct = pctOf(sweet, t);
    const waterPct = pctOf(diluent, t);
    const acidPct = pctOf(acid, t);
    pct.soy = soyPct;
    pct.sweet = sweetPct;
    pct.diluent = waterPct;
    pct.acidUmami = acidPct;

    push(
      'info',
      'Soy glaze: salt–sweet–acid triangle — soy brings salt/umami, sugar brings body/caramel, acid keeps it from tasting one-dimensional.',
    );
    if (soyPct > 30) {
      push(
        'error',
        `Soy is ~${soyPct.toFixed(0)}% of the build (guide ~15–25%). Above ~30% tends toward harsh, metallic, overly salty “muddy” notes.`,
      );
    }
    if (sweetPct > 25) {
      push(
        'warn',
        `Sugar/honey is ~${sweetPct.toFixed(0)}% (guide ~10–20%). Above ~25% it can go syrupy, sticky, and burn faster in the pan.`,
      );
    }
    if (waterPct > 60) {
      push(
        'warn',
        `Diluent (water/stock) is ~${waterPct.toFixed(0)}% (guide ~40–55% for a glaze that still clings). Too much water stays thin unless you reduce or add a slurry.`,
      );
    }
    if (acidPct < 2) {
      push(
        'warn',
        'Almost no acid in the build — expect a flatter “salty-sweet” profile. A splash of vinegar or citrus usually fixes it.',
      );
    }
    push(
      'info',
      'Soy glaze engineering: diluent ~40–55%, soy (salt load) ~15–25%, sweet ~10–20%, fat ~5–10%, acid ~3–8%.',
    );
    if (eng.liquidPct < 35 || eng.liquidPct > 58) {
      push('warn', `Modeled liquid phase is ~${eng.liquidPct.toFixed(0)}% (guide ~40–55%).`);
    }
    if (eng.fatPct < 3.5 || eng.fatPct > 12) {
      push('info', `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~5–10%).`);
    }
    if (eng.acidPct < 2.5 || eng.acidPct > 10) {
      push('info', `Modeled acid is ~${eng.acidPct.toFixed(0)}% (guide ~3–8%).`);
    }
  }

  if (CHEESE_IDS.has(sauceId)) {
    const liq = buckets.liquidDairy ?? 0;
    const cheese = buckets.cheese ?? 0;
    const t = liq + cheese + (buckets.stabilizer ?? 0) + (buckets.fat ?? 0) + (buckets.acid ?? 0);
    const cheesePct = pctOf(cheese, t);
    const liqPct = pctOf(liq, t);
    const acidPct = pctOf(buckets.acid ?? 0, t);
    pct.cheese = cheesePct;
    pct.liquidDairy = liqPct;

    push(
      'info',
      'Cheese sauce: heat-sensitive emulsion — too much heat breaks it into oily + grainy; add warm milk and whisk gently if it splits.',
    );
    if (cheesePct > 45) {
      push(
        'error',
        `Cheese is ~${cheesePct.toFixed(0)}% of the build (guide ~25–40%). Above ~45% it often becomes clumpy/stringy and will not flow.`,
      );
    }
    if (liqPct < 40) {
      push(
        'warn',
        `Liquid dairy is only ~${liqPct.toFixed(0)}% (guide ~50–65% if starting from cream/milk). Too little liquid tends toward paste or a solid mass.`,
      );
    }
    if (acidPct > 4) {
      push(
        'warn',
        'Acid (mustard) is on the high side — too much acid in a hot cheese system can curdle or grain. Keep acid low and add at the end.',
      );
    }
    push(
      'info',
      'Cheese sauce engineering: liquid ~50–65%, fat ~15–25%, cheese solids ~20–35%, acid ~0–3%.',
    );
    if (eng.liquidPct < 45 || eng.liquidPct > 70) {
      push('warn', `Modeled liquid is ~${eng.liquidPct.toFixed(0)}% (guide ~50–65%).`);
    }
    if (eng.fatPct < 12 || eng.fatPct > 30) {
      push('info', `Modeled fat is ~${eng.fatPct.toFixed(0)}% (guide ~15–25% including butter and cheese lipids).`);
    }
    if (eng.bodyPct < 15 || eng.bodyPct > 42) {
      push('info', `Solids / body read ~${eng.bodyPct.toFixed(0)}% (cheese + starch often ~20–35% combined).`);
    }
    if (eng.liquidPct >= 45 && eng.liquidPct <= 70 && cheesePct >= 22 && cheesePct <= 42) {
      push('ok', `Cheese sauce structure looks workable: liquid ~${eng.liquidPct.toFixed(0)}%, cheese ~${cheesePct.toFixed(0)}%.`);
    }
  }

  if (messages.length === 0) {
    push('info', 'Adjust amounts above to see sauce-specific guardrails for this build.');
  }

  messages.sort((a, b) => {
    const order: Record<BalanceSeverity, number> = {
      error: 0,
      warn: 1,
      info: 2,
      ok: 3,
    };
    return order[a.severity] - order[b.severity];
  });

  return { totalGrams, pct, messages };
}

/**
 * Flavor-quadrant dot from a perception layer (not raw gram totals).
 * +x → fat, −x → salt; +y → acid, −y → sweet.
 */
export function computeSauceWheelPosition(
  sauceId: string,
  lines: RecipeLineInput[],
  opts?: { reductionRemainingPct?: number },
): SauceWheelResult {
  const raw = rawFlavorMasses(sauceId, lines);
  const { salt, fat, acid, sweet, buckets } = raw;

  const perceived = applyPerception(raw, sauceId, opts);
  const { pSalt, pFat, pAcid, pSweet, pUmami, intensity, texture } = perceived;

  const rem = isReductionSauceFamily(sauceId) ? clamp(opts?.reductionRemainingPct ?? 100, 5, 100) : 100;
  const concentration = rem >= 96 ? 1 : Math.min(2.35, 100 / Math.max(rem, 14));

  const sumP = pSalt + pFat + pAcid + pSweet + 1e-9;
  const pctSalt = (pSalt / sumP) * 100;
  const pctFat = (pFat / sumP) * 100;
  const pctAcid = (pAcid / sumP) * 100;
  const pctSweet = (pSweet / sumP) * 100;

  const ideal = 0.25;
  const sn = pSalt / sumP;
  const fn = pFat / sumP;
  const an = pAcid / sumP;
  const sw = pSweet / sumP;
  let dx = (fn - ideal) - (sn - ideal);
  let dy = (an - ideal) - (sw - ideal);

  const scores = {
    salt: scoreFromMass(pSalt, 42),
    fat: scoreFromMass(pFat, 48),
    acid: scoreFromMass(pAcid, 36),
    sweet: scoreFromMass(pSweet, 28),
    umami: scoreFromMass(pUmami, 34),
  };

  const { positionSummary, why, suggestions } = deriveNarration(
    { pSalt, pFat, pAcid, pSweet, pUmami },
    scores,
    concentration,
    rem,
    buckets,
  );

  return {
    quad: { salt, fat, acid, sweet },
    dx,
    dy,
    pctSalt,
    pctFat,
    pctAcid,
    pctSweet,
    scores,
    intensity,
    texture,
    positionSummary,
    why,
    suggestions,
  };
}

/** Approximate engineering pillars from internal buckets (final-ish mass; reduction scales liquid). */
export type EngineeringStructure = {
  liquidPct: number;
  fatPct: number;
  acidPct: number;
  sweetPct: number;
  bodyPct: number;
  /** Fat / (fat + liquid + body) — used for pan-style “fat / total” checks. */
  fatRatio: number;
};

export function computeEngineeringStructure(
  sauceId: string,
  lines: RecipeLineInput[],
  opts?: { reductionRemainingPct?: number },
): EngineeringStructure {
  const buckets: Record<string, number> = {};
  for (const line of lines) {
    const part = lineToBuckets(sauceId, line);
    for (const [k, v] of Object.entries(part)) add(buckets, k, v);
  }
  const rem = isReductionSauceFamily(sauceId) ? clamp(opts?.reductionRemainingPct ?? 100, 5, 100) : 100;
  const liqRaw = liquidBulkFromBuckets(buckets);
  let liq = isReductionSauceFamily(sauceId) ? liqRaw * (rem / 100) : liqRaw;
  /** Pan sauces list deglaze + stock before mounting butter; typical pass reduces free liquid ~45–55% vs raw slot grams. */
  if (PAN_IDS.has(sauceId)) {
    liq *= 0.52;
  }
  const fatM =
    (buckets.fat ?? 0) +
    (buckets.oil ?? 0) +
    (buckets.oilHeavy ?? 0) * 0.85 +
    (buckets.rouxFat ?? 0) +
    (buckets.finishFat ?? 0) +
    (buckets.extraFat ?? 0) +
    (buckets.cream ?? 0) * 0.48 +
    (buckets.liquidDairy ?? 0) * 0.034;
  const acidM = (buckets.acid ?? 0) + (buckets.emulsifier ?? 0) * 0.12 + (buckets.tomato ?? 0) * 0.1;
  const sweetM = buckets.sweet ?? 0;
  const bodyM =
    starchBulkFromBuckets(buckets) +
    (buckets.solid ?? 0) * 0.12 +
    (buckets.cheese ?? 0) * 0.22 +
    (buckets.tomato ?? 0) * 0.35;
  const denom = liq + fatM + acidM + sweetM + bodyM + 1e-9;
  const fatDenom = liq + fatM + bodyM + 1e-9;
  return {
    liquidPct: (liq / denom) * 100,
    fatPct: (fatM / denom) * 100,
    acidPct: (acidM / denom) * 100,
    sweetPct: (sweetM / denom) * 100,
    bodyPct: (bodyM / denom) * 100,
    fatRatio: fatM / fatDenom,
  };
}
