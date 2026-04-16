/**
 * Style target on the wheel from the product diagram (grid → UI maps in `SauceBalanceWheelVisual`).
 * `dx`: fat (+) … salt (−), about ±3 on the chart. `dy`: acid (+) … sweet (−), about ±4 on the chart.
 * `rx` / `ry`: ellipse aspect for the dashed band (relative only).
 */
export type SauceWheelTarget = {
  dx: number;
  dy: number;
  rx: number;
  ry: number;
};

export type Sauce = {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  /** Card grouping label (library + SenseiFood cross-links) */
  variantGroup?: string;
  /** Slug for SenseiFood article deep-link */
  senseiFoodSlug?: string;
  family:
    | 'pan'
    | 'roux'
    | 'cream'
    | 'tomato'
    | 'cold'
    | 'emulsion'
    | 'reduction'
    | 'herb'
    | 'umami'
    | 'cheese';
  useFor: string[];
  steps: string[];
  tip: string;
  filterTags: string[];
  /** Typical healthy band for this sauce on the flavor wheel (not the geometric center). */
  wheelTarget: SauceWheelTarget;
  recipe: RecipeItem[];
};

export type RecipeIngredientOption = {
  id: string;
  name: string;
  gramsPerCup: number;
};

export type RecipeItem = {
  slotId: string;
  label: string;
  amountGrams: number;
  options: RecipeIngredientOption[];
};

export const SAUCE_FAMILIES: Record<Sauce['family'], { label: string; emoji: string }> = {
  pan: { label: 'Pan & fond', emoji: '\u{1F373}' },
  roux: { label: 'Roux-based', emoji: '\u{1F9C2}' },
  cream: { label: 'Creamy', emoji: '\u{1F95B}' },
  tomato: { label: 'Tomato', emoji: '\u{1F345}' },
  cold: { label: 'Cold / raw', emoji: '\u{1F957}' },
  emulsion: { label: 'Emulsion', emoji: '\u{1F9C8}' },
  reduction: { label: 'Reduction', emoji: '\u{1F4A7}' },
  herb: { label: 'Herb / green', emoji: '\u{1F33F}' },
  umami: { label: 'Umami', emoji: '\u{1F35A}' },
  cheese: { label: 'Cheese', emoji: '\u{1F9C0}' },
};

/** Standard builds: cup = 240 ml where liquid; tbsp ≈ 14.2 g butter; 1 tbsp flour ≈ 7.8 g AP. */
export const BASE_SAUCES: Sauce[] = [
  {
    id: 'pan-sauce',
    emoji: '\u{1F373}',
    name: 'Pan Sauce',
    subtitle: 'Steak / chicken (wine + stock + butter finish)',
    family: 'pan',
    variantGroup: 'Pan sauces',
    useFor: ['steak', 'chicken', 'pork'],
    steps: [
      'Cook meat in the pan; remove meat and keep the fond.',
      'Add shallot (optional); sauté briefly.',
      'Deglaze with wine; simmer until reduced by about half.',
      'Add stock; simmer to reduce and deepen flavor.',
      'Off heat, whisk in cold butter (2–3 tbsp) to finish and emulsify. Season with salt and pepper.',
    ],
    tip: 'Salt and pepper at the end — taste after the butter goes in.',
    filterTags: ['meat', 'quick', 'weeknight'],
    wheelTarget: { dx: 0.5, dy: 0.5, rx: 0.1, ry: 0.095 },
    recipe: [
      {
        slotId: 'aromatic',
        label: 'Shallot (optional)',
        amountGrams: 25,
        options: [
          { id: 'shallot', name: 'Shallot (minced)', gramsPerCup: 160 },
          { id: 'garlic', name: 'Garlic (minced)', gramsPerCup: 136 },
        ],
      },
      {
        slotId: 'wine',
        label: 'Wine (½ cup deglaze)',
        amountGrams: 120,
        options: [
          { id: 'dry-white', name: 'Dry white wine', gramsPerCup: 240 },
          { id: 'dry-red', name: 'Dry red wine', gramsPerCup: 240 },
        ],
      },
      {
        slotId: 'stock',
        label: 'Stock (1 cup)',
        amountGrams: 240,
        options: [
          { id: 'chicken-stock', name: 'Chicken stock', gramsPerCup: 240 },
          { id: 'beef-stock', name: 'Beef stock', gramsPerCup: 240 },
          { id: 'veg-stock', name: 'Vegetable stock', gramsPerCup: 240 },
        ],
      },
      {
        slotId: 'finish',
        label: 'Butter finish (2–3 tbsp)',
        amountGrams: 36,
        options: [
          { id: 'cold-butter', name: 'Cold butter', gramsPerCup: 227 },
          { id: 'cream', name: 'Heavy cream (alternate finish)', gramsPerCup: 240 },
        ],
      },
    ],
  },
  {
    id: 'simple-gravy',
    emoji: '\u{1F9C2}',
    name: 'Brown Gravy',
    subtitle: 'Stock-based roux (drippings or butter + flour + stock)',
    family: 'roux',
    variantGroup: 'Gravy',
    senseiFoodSlug: 'brown-gravy-stock-based',
    useFor: ['pot pie', 'chicken', 'mashed potatoes'],
    steps: [
      'Melt butter, whisk in flour, and cook the roux 2–3 minutes until toasty.',
      'Slowly whisk in warm stock until smooth.',
      'Simmer until thick; season with salt and pepper.',
    ],
    tip: 'Equal parts butter and flour by volume is the classic roux move here.',
    filterTags: ['comfort', 'holiday', 'poultry'],
    wheelTarget: { dx: 1, dy: 0.5, rx: 0.1, ry: 0.09 },
    recipe: [
      { slotId: 'butter', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'drippings', name: 'Pan drippings', gramsPerCup: 240 }] },
      { slotId: 'flour', label: 'Flour (2 tbsp)', amountGrams: 16, options: [{ id: 'ap-flour', name: 'All-purpose flour', gramsPerCup: 120 }, { id: 'gf-flour', name: 'Gluten-free blend', gramsPerCup: 128 }] },
      { slotId: 'stock', label: 'Stock (2 cups)', amountGrams: 480, options: [{ id: 'chicken-stock', name: 'Chicken stock', gramsPerCup: 240 }, { id: 'veg-stock', name: 'Vegetable stock', gramsPerCup: 240 }] },
      {
        slotId: 'salt',
        label: 'Salt (½–1 tsp, to taste)',
        amountGrams: 3,
        options: [
          { id: 'kosher-salt', name: 'Kosher salt', gramsPerCup: 272 },
          { id: 'fine-sea-salt', name: 'Fine sea salt', gramsPerCup: 292 },
        ],
      },
    ],
  },
  {
    id: 'cream-sauce',
    emoji: '\u{1F95B}',
    name: 'Cream Sauce (Alfredo-style)',
    subtitle: 'Heavy cream + butter + garlic (+ optional parmesan)',
    family: 'cream',
    variantGroup: 'Cream sauces',
    useFor: ['chicken', 'pasta', 'casseroles'],
    steps: [
      'Melt butter; sauté garlic until fragrant (do not brown hard).',
      'Add heavy cream; simmer gently.',
      'Reduce slightly; optionally stir in parmesan off heat.',
    ],
    tip: 'Parmesan is optional but rounds the sauce beautifully.',
    filterTags: ['pasta', 'poultry', 'rich'],
    wheelTarget: { dx: 3, dy: 0.5, rx: 0.1, ry: 0.09 },
    recipe: [
      { slotId: 'fat', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }] },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Fresh garlic (minced)', gramsPerCup: 136 }, { id: 'garlic-paste', name: 'Garlic paste', gramsPerCup: 250 }] },
      { slotId: 'cream', label: 'Heavy cream (1 cup)', amountGrams: 240, options: [{ id: 'heavy-cream', name: 'Heavy cream', gramsPerCup: 240 }, { id: 'half-half', name: 'Half and half', gramsPerCup: 242 }] },
      {
        slotId: 'cheese',
        label: 'Parmesan (optional, about ¼ cup)',
        amountGrams: 25,
        options: [
          { id: 'parmesan', name: 'Parmesan (grated)', gramsPerCup: 100 },
          { id: 'pecorino', name: 'Pecorino (grated)', gramsPerCup: 110 },
        ],
      },
    ],
  },
  {
    id: 'tomato-sauce',
    emoji: '\u{1F345}',
    name: 'Tomato Sauce (Marinara-style)',
    subtitle: 'Crushed tomatoes + oil + garlic',
    family: 'tomato',
    variantGroup: 'Tomato sauces',
    useFor: ['pasta', 'chicken', 'baked dishes'],
    steps: [
      'Heat olive oil; sauté garlic until fragrant.',
      'Add crushed tomatoes; simmer 20–30 minutes.',
      'Season with salt; add a pinch of sugar if needed to balance acid.',
    ],
    tip: 'One standard 14–15 oz can of crushed tomatoes is a typical batch — scale up for big pots.',
    filterTags: ['pasta', 'batch', 'italian-ish'],
    wheelTarget: { dx: 0.5, dy: 2, rx: 0.1, ry: 0.1 },
    recipe: [
      { slotId: 'oil', label: 'Olive oil (2 tbsp)', amountGrams: 28, options: [{ id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }, { id: 'butter', name: 'Butter', gramsPerCup: 227 }] },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Fresh garlic (minced)', gramsPerCup: 136 }, { id: 'garlic-powder', name: 'Garlic powder', gramsPerCup: 96 }] },
      {
        slotId: 'tomatoes',
        label: 'Crushed tomatoes (1 can)',
        amountGrams: 400,
        options: [
          { id: 'crushed', name: 'Crushed tomatoes (14–15 oz can)', gramsPerCup: 245 },
          { id: 'whole', name: 'Whole peeled tomatoes (crush by hand)', gramsPerCup: 245 },
        ],
      },
      {
        slotId: 'sugar',
        label: 'Sugar (pinch, optional)',
        amountGrams: 4,
        options: [
          { id: 'white-sugar', name: 'Granulated sugar', gramsPerCup: 200 },
          { id: 'brown-sugar', name: 'Brown sugar', gramsPerCup: 200 },
        ],
      },
      {
        slotId: 'salt',
        label: 'Salt (½–1 tsp, to taste)',
        amountGrams: 4,
        options: [
          { id: 'kosher-salt', name: 'Kosher salt', gramsPerCup: 272 },
          { id: 'fine-sea-salt', name: 'Fine sea salt', gramsPerCup: 292 },
        ],
      },
    ],
  },
  {
    id: 'vinaigrette',
    emoji: '\u{1F957}',
    name: 'Vinaigrette',
    subtitle: 'Oil + vinegar + mustard + salt',
    family: 'cold',
    variantGroup: 'Vinaigrette',
    useFor: ['salads', 'roasted vegetables'],
    steps: [
      'Combine oil (3 tbsp), vinegar (1 tbsp), mustard (1 tsp), and salt.',
      'Shake in a jar or whisk until slightly creamy.',
    ],
    tip: 'Classic ratio here is 3 parts oil to 1 part vinegar by volume.',
    filterTags: ['healthy', 'no-cook', 'vegetables'],
    wheelTarget: { dx: 2, dy: 3, rx: 0.09, ry: 0.11 },
    recipe: [
      { slotId: 'oil', label: 'Oil (3 tbsp)', amountGrams: 42, options: [{ id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }, { id: 'avocado-oil', name: 'Avocado oil', gramsPerCup: 218 }] },
      { slotId: 'acid', label: 'Vinegar (1 tbsp)', amountGrams: 15, options: [{ id: 'red-wine-vinegar', name: 'Red wine vinegar', gramsPerCup: 240 }, { id: 'lemon-juice', name: 'Lemon juice', gramsPerCup: 244 }] },
      { slotId: 'mustard', label: 'Mustard (1 tsp)', amountGrams: 5, options: [{ id: 'dijon', name: 'Dijon mustard', gramsPerCup: 250 }, { id: 'whole-grain', name: 'Whole grain mustard', gramsPerCup: 250 }] },
      { slotId: 'salt', label: 'Salt', amountGrams: 3, options: [{ id: 'kosher', name: 'Kosher salt', gramsPerCup: 272 }, { id: 'fine-sea', name: 'Fine sea salt', gramsPerCup: 292 }] },
    ],
  },
  {
    id: 'mayo-aioli',
    emoji: '\u{1F9C8}',
    name: 'Mayo / Aioli',
    subtitle: 'Egg yolk + oil (from scratch)',
    family: 'emulsion',
    variantGroup: 'Mayo / aioli',
    useFor: ['fries', 'sandwiches', 'wraps'],
    steps: [
      'Whisk egg yolk with lemon juice (and a pinch of salt) until smooth.',
      'Very slowly drizzle in oil while whisking until thick and glossy.',
      'Stir in garlic if using.',
    ],
    tip: 'If it breaks, start a fresh yolk in a clean bowl and whisk the broken mix in slowly.',
    filterTags: ['snack', 'sandwich', 'fast'],
    wheelTarget: { dx: 3.5, dy: 0.5, rx: 0.08, ry: 0.07 },
    recipe: [
      {
        slotId: 'yolk',
        label: 'Egg yolk (1)',
        amountGrams: 17,
        options: [{ id: 'egg-yolk', name: 'Egg yolk', gramsPerCup: 272 }],
      },
      {
        slotId: 'oil',
        label: 'Oil (1 cup)',
        amountGrams: 216,
        options: [
          { id: 'neutral-oil', name: 'Neutral oil (canola / grapeseed)', gramsPerCup: 218 },
          { id: 'olive-oil', name: 'Olive oil (robust flavor)', gramsPerCup: 216 },
        ],
      },
      {
        slotId: 'acid',
        label: 'Lemon juice (1 tbsp)',
        amountGrams: 15,
        options: [
          { id: 'lemon-juice', name: 'Lemon juice', gramsPerCup: 244 },
          { id: 'lime-juice', name: 'Lime juice', gramsPerCup: 244 },
        ],
      },
      {
        slotId: 'garlic',
        label: 'Garlic (optional)',
        amountGrams: 0,
        options: [
          { id: 'no-garlic', name: 'No garlic', gramsPerCup: 136 },
          { id: 'fresh-garlic', name: 'Fresh garlic (grated)', gramsPerCup: 136 },
        ],
      },
    ],
  },
  {
    id: 'reduction',
    emoji: '\u{1F4A7}',
    name: 'Reduction Sauce',
    subtitle: 'Wine or stock, reduced hard',
    family: 'reduction',
    variantGroup: 'Reductions',
    useFor: ['steak', 'pork', 'plating sauces'],
    steps: [
      'Simmer wine or stock uncovered until reduced by about 50–70%.',
      'Optional: finish with a little cold butter for gloss.',
    ],
    tip: 'Taste as it tightens — salt and acid concentrate fast.',
    filterTags: ['elegant', 'meat', 'entertaining'],
    wheelTarget: { dx: 1, dy: 4, rx: 0.1, ry: 0.11 },
    recipe: [
      {
        slotId: 'liquid',
        label: 'Wine or stock (1 cup)',
        amountGrams: 240,
        options: [
          { id: 'beef-stock', name: 'Beef stock', gramsPerCup: 240 },
          { id: 'chicken-stock', name: 'Chicken stock', gramsPerCup: 240 },
          { id: 'red-wine', name: 'Red wine', gramsPerCup: 240 },
          { id: 'white-wine', name: 'White wine', gramsPerCup: 240 },
        ],
      },
      { slotId: 'finish', label: 'Butter (optional, ~1 tbsp)', amountGrams: 14, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'none', name: 'Skip butter', gramsPerCup: 240 }] },
    ],
  },
  {
    id: 'herb-sauce',
    emoji: '\u{1F33F}',
    name: 'Herb Sauce',
    subtitle: 'Chimichurri-style (parsley + oil + vinegar)',
    family: 'herb',
    variantGroup: 'Herb sauces',
    useFor: ['steak', 'chicken', 'vegetables'],
    steps: [
      'Chop or blend parsley with garlic.',
      'Whisk in oil and vinegar; season with salt.',
      'Let sit 10–15 minutes before serving so flavors meld.',
    ],
    tip: 'Salt and pepper to taste — this style loves a bold pinch of salt.',
    filterTags: ['fresh', 'grilling', 'bright'],
    wheelTarget: { dx: 2, dy: 1, rx: 0.1, ry: 0.095 },
    recipe: [
      {
        slotId: 'herbs',
        label: 'Parsley (1 cup packed)',
        amountGrams: 48,
        options: [
          { id: 'parsley', name: 'Flat-leaf parsley', gramsPerCup: 30 },
          { id: 'parsley-curly', name: 'Curly parsley', gramsPerCup: 28 },
        ],
      },
      { slotId: 'oil', label: 'Olive oil (½ cup)', amountGrams: 108, options: [{ id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }, { id: 'neutral-oil', name: 'Neutral oil', gramsPerCup: 218 }] },
      { slotId: 'acid', label: 'Vinegar (2 tbsp)', amountGrams: 30, options: [{ id: 'red-wine-vinegar', name: 'Red wine vinegar', gramsPerCup: 240 }, { id: 'lemon-juice', name: 'Lemon juice', gramsPerCup: 244 }] },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Fresh garlic', gramsPerCup: 136 }, { id: 'shallot', name: 'Shallot', gramsPerCup: 160 }] },
    ],
  },
  {
    id: 'soy-umami',
    emoji: '\u{1F35A}',
    name: 'Soy-Based Sauce',
    subtitle: 'Soy + water + sugar + garlic',
    family: 'umami',
    variantGroup: 'Soy system',
    useFor: ['chicken', 'rice dishes'],
    steps: [
      'Combine soy sauce, water, sugar, garlic, and vinegar.',
      'Simmer 5–10 minutes until slightly syrupy.',
      'Optional: thicken with a cornstarch slurry if you want it clingier.',
    ],
    tip: 'Taste toward the end — soy reduces salty fast.',
    filterTags: ['asian-ish', 'bowl', 'weeknight'],
    wheelTarget: { dx: -3, dy: 0, rx: 0.11, ry: 0.085 },
    recipe: [
      { slotId: 'soy', label: 'Soy sauce (½ cup)', amountGrams: 128, options: [{ id: 'soy', name: 'Soy sauce', gramsPerCup: 256 }, { id: 'tamari', name: 'Tamari', gramsPerCup: 256 }] },
      { slotId: 'water', label: 'Water (½ cup)', amountGrams: 118, options: [{ id: 'water', name: 'Water', gramsPerCup: 236 }, { id: 'stock', name: 'Chicken stock', gramsPerCup: 240 }] },
      {
        slotId: 'sweet',
        label: 'Sugar (2–3 tbsp)',
        amountGrams: 32,
        options: [
          { id: 'brown-sugar', name: 'Brown sugar', gramsPerCup: 200 },
          { id: 'white-sugar', name: 'Granulated sugar', gramsPerCup: 200 },
        ],
      },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Fresh garlic', gramsPerCup: 136 }, { id: 'garlic-paste', name: 'Garlic paste', gramsPerCup: 250 }] },
      {
        slotId: 'acid',
        label: 'Vinegar (1 tsp)',
        amountGrams: 5,
        options: [
          { id: 'rice-vinegar', name: 'Rice vinegar', gramsPerCup: 240 },
          { id: 'lemon', name: 'Lemon juice', gramsPerCup: 244 },
          { id: 'none', name: 'None', gramsPerCup: 240 },
        ],
      },
    ],
  },
  {
    id: 'cheese-sauce',
    emoji: '\u{1F9C0}',
    name: 'Cheese Sauce',
    subtitle: 'Roux + milk + shredded cheese',
    family: 'cheese',
    variantGroup: 'Cheese sauces',
    useFor: ['casseroles', 'vegetables', 'comfort food'],
    steps: [
      'Melt butter, whisk in flour, and cook the roux briefly.',
      'Add milk; whisk until smooth and simmer until thickened.',
      'Off heat, add shredded cheese in batches, stirring until smooth.',
    ],
    tip: 'Low heat after the roux — high heat makes cheese sauces grainy.',
    filterTags: ['comfort', 'casserole', 'kid-friendly'],
    wheelTarget: { dx: 3, dy: 0.5, rx: 0.095, ry: 0.085 },
    recipe: [
      { slotId: 'butter', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'drippings', name: 'Pan drippings', gramsPerCup: 240 }] },
      { slotId: 'thickener', label: 'Flour (2 tbsp)', amountGrams: 16, options: [{ id: 'flour', name: 'All-purpose flour', gramsPerCup: 120 }, { id: 'cornstarch', name: 'Cornstarch', gramsPerCup: 128 }] },
      { slotId: 'base', label: 'Milk (1 cup)', amountGrams: 245, options: [{ id: 'milk', name: 'Whole milk', gramsPerCup: 245 }, { id: 'cream', name: 'Heavy cream', gramsPerCup: 240 }] },
      {
        slotId: 'cheese',
        label: 'Shredded cheese (1 cup)',
        amountGrams: 113,
        options: [
          { id: 'cheddar', name: 'Cheddar (shredded)', gramsPerCup: 113 },
          { id: 'gruyere', name: 'Gruyere (shredded)', gramsPerCup: 108 },
        ],
      },
    ],
  },
];

export const VARIANT_SAUCES: Sauce[] = [
  {
    id: 'white-gravy',
    emoji: '\u{1F9C2}',
    name: 'White Gravy',
    subtitle: 'Southern cream gravy (roux + milk)',
    family: 'roux',
    variantGroup: 'Gravy',
    senseiFoodSlug: 'white-gravy-southern',
    useFor: ['biscuits', 'fried chicken', 'mashed potatoes'],
    steps: [
      'Melt butter or sausage fat; whisk in flour and cook the roux until it smells toasty (not raw).',
      'Add milk in increments, whisking smooth each time.',
      'Simmer gently until thick; season aggressively with black pepper and salt to taste.',
    ],
    tip: 'Milk proteins scorch easily — keep the finish at a gentle bubble, not a rolling boil.',
    filterTags: ['comfort', 'southern', 'breakfast'],
    wheelTarget: { dx: 0.55, dy: -0.38, rx: 0.11, ry: 0.1 },
    recipe: [
      { slotId: 'butter', label: 'Butter or sausage fat (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'drippings', name: 'Sausage drippings', gramsPerCup: 240 }] },
      { slotId: 'flour', label: 'Flour (2 tbsp)', amountGrams: 16, options: [{ id: 'ap-flour', name: 'All-purpose flour', gramsPerCup: 120 }, { id: 'gf-flour', name: 'Gluten-free blend', gramsPerCup: 128 }] },
      { slotId: 'milk', label: 'Milk (2 cups)', amountGrams: 490, options: [{ id: 'whole', name: 'Whole milk', gramsPerCup: 245 }, { id: 'two-percent', name: '2% milk', gramsPerCup: 244 }] },
      {
        slotId: 'salt',
        label: 'Salt + black pepper',
        amountGrams: 3,
        options: [
          { id: 'kosher-salt', name: 'Kosher salt', gramsPerCup: 272 },
          { id: 'fine-sea-salt', name: 'Fine sea salt', gramsPerCup: 292 },
        ],
      },
    ],
  },
  {
    id: 'pan-sauce-lemon',
    emoji: '\u{1F373}',
    name: 'Lemon Pan Sauce',
    subtitle: 'Stock + lemon + butter finish',
    family: 'pan',
    variantGroup: 'Pan sauces',
    senseiFoodSlug: 'lemon-pan-sauce',
    useFor: ['chicken', 'fish', 'pork'],
    steps: [
      'Sauté aromatics; build fond.',
      'Deglaze with stock; reduce slightly.',
      'Finish with lemon juice off heat, then mount cold butter and swirl.',
    ],
    tip: 'Acid at the end preserves brightness; boiling lemon hard can turn metallic.',
    filterTags: ['citrus', 'weeknight'],
    wheelTarget: { dx: 0.5, dy: 1.2, rx: 0.1, ry: 0.1 },
    recipe: [
      { slotId: 'aromatic', label: 'Shallot (optional)', amountGrams: 20, options: [{ id: 'shallot', name: 'Shallot (minced)', gramsPerCup: 160 }, { id: 'garlic', name: 'Garlic (minced)', gramsPerCup: 136 }] },
      { slotId: 'stock', label: 'Stock (1 cup)', amountGrams: 240, options: [{ id: 'chicken-stock', name: 'Chicken stock', gramsPerCup: 240 }, { id: 'veg-stock', name: 'Vegetable stock', gramsPerCup: 240 }] },
      { slotId: 'citrus', label: 'Lemon juice (3 tbsp)', amountGrams: 45, options: [{ id: 'lemon', name: 'Lemon juice', gramsPerCup: 244 }, { id: 'lime', name: 'Lime juice', gramsPerCup: 244 }] },
      { slotId: 'finish', label: 'Cold butter finish', amountGrams: 36, options: [{ id: 'cold-butter', name: 'Cold butter', gramsPerCup: 227 }, { id: 'cream', name: 'Heavy cream', gramsPerCup: 240 }] },
    ],
  },
  {
    id: 'pan-sauce-mustard',
    emoji: '\u{1F373}',
    name: 'Mustard Pan Sauce',
    subtitle: 'Stock + Dijon + cream + butter',
    family: 'pan',
    variantGroup: 'Pan sauces',
    senseiFoodSlug: 'mustard-pan-sauce',
    useFor: ['pork', 'chicken', 'steak'],
    steps: [
      'Sauté aromatics; add Dijon and cook 30 seconds.',
      'Add stock; reduce until lightly syrupy.',
      'Stir in cream; simmer gently; finish with butter off heat.',
    ],
    tip: 'Mustard is an emulsifier — it helps tie fat and water phases.',
    filterTags: ['mustard', 'creamy'],
    wheelTarget: { dx: 1.2, dy: 0.7, rx: 0.1, ry: 0.095 },
    recipe: [
      { slotId: 'aromatic', label: 'Shallot', amountGrams: 25, options: [{ id: 'shallot', name: 'Shallot (minced)', gramsPerCup: 160 }, { id: 'garlic', name: 'Garlic (minced)', gramsPerCup: 136 }] },
      { slotId: 'mustard', label: 'Dijon (1 tbsp)', amountGrams: 15, options: [{ id: 'dijon', name: 'Dijon mustard', gramsPerCup: 250 }, { id: 'whole-grain', name: 'Whole grain mustard', gramsPerCup: 250 }] },
      { slotId: 'stock', label: 'Stock (1 cup)', amountGrams: 240, options: [{ id: 'chicken-stock', name: 'Chicken stock', gramsPerCup: 240 }, { id: 'beef-stock', name: 'Beef stock', gramsPerCup: 240 }] },
      { slotId: 'cream', label: 'Heavy cream (½ cup)', amountGrams: 120, options: [{ id: 'heavy-cream', name: 'Heavy cream', gramsPerCup: 240 }, { id: 'half-half', name: 'Half and half', gramsPerCup: 242 }] },
      { slotId: 'finish', label: 'Butter finish (2 tbsp)', amountGrams: 28, options: [{ id: 'cold-butter', name: 'Cold butter', gramsPerCup: 227 }, { id: 'cream', name: 'More cream instead', gramsPerCup: 240 }] },
    ],
  },
  {
    id: 'cream-sauce-mushroom',
    emoji: '\u{1F95B}',
    name: 'Mushroom Cream Sauce',
    subtitle: 'Cream + butter + mushrooms',
    family: 'cream',
    variantGroup: 'Cream sauces',
    senseiFoodSlug: 'mushroom-cream-sauce',
    useFor: ['chicken', 'pasta', 'pork'],
    steps: ['Sauté mushrooms in butter until they give up water and re-brown.', 'Add cream; simmer gently.', 'Season; finish with parmesan if desired.'],
    tip: 'Brown mushrooms properly — gray soup mushrooms make gray sauce.',
    filterTags: ['mushroom', 'umami'],
    wheelTarget: { dx: 3, dy: 0.7, rx: 0.1, ry: 0.09 },
    recipe: [
      { slotId: 'fat', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }] },
      { slotId: 'mushrooms', label: 'Sliced mushrooms (8 oz)', amountGrams: 225, options: [{ id: 'cremini', name: 'Cremini', gramsPerCup: 78 }, { id: 'white', name: 'White button', gramsPerCup: 70 }] },
      { slotId: 'cream', label: 'Heavy cream (1 cup)', amountGrams: 240, options: [{ id: 'heavy-cream', name: 'Heavy cream', gramsPerCup: 240 }, { id: 'half-half', name: 'Half and half', gramsPerCup: 242 }] },
      { slotId: 'garlic', label: 'Garlic (1 clove)', amountGrams: 4, options: [{ id: 'fresh-garlic', name: 'Garlic (minced)', gramsPerCup: 136 }, { id: 'garlic-paste', name: 'Garlic paste', gramsPerCup: 250 }] },
    ],
  },
  {
    id: 'tomato-sauce-sweet',
    emoji: '\u{1F345}',
    name: 'Sweet Tomato Sauce',
    subtitle: 'Tomato + butter + extra sugar balance',
    family: 'tomato',
    variantGroup: 'Tomato sauces',
    senseiFoodSlug: 'sweet-tomato-sauce',
    useFor: ['pasta', 'kids', 'baked dishes'],
    steps: ['Sauté garlic in butter.', 'Add tomatoes; simmer.', 'Stir in sugar to taste; season with salt.'],
    tip: 'Sugar fights harsh acid without hiding tomato — add in pinches.',
    filterTags: ['sweet', 'comfort'],
    wheelTarget: { dx: 0.8, dy: 1.2, rx: 0.1, ry: 0.1 },
    recipe: [
      { slotId: 'oil', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }] },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Garlic (minced)', gramsPerCup: 136 }, { id: 'garlic-powder', name: 'Garlic powder', gramsPerCup: 96 }] },
      { slotId: 'tomatoes', label: 'Crushed tomatoes (1 can)', amountGrams: 400, options: [{ id: 'crushed', name: 'Crushed tomatoes', gramsPerCup: 245 }, { id: 'whole', name: 'Whole peeled tomatoes', gramsPerCup: 245 }] },
      { slotId: 'sugar', label: 'Sugar (2 tbsp)', amountGrams: 24, options: [{ id: 'white-sugar', name: 'Granulated sugar', gramsPerCup: 200 }, { id: 'brown-sugar', name: 'Brown sugar', gramsPerCup: 200 }] },
      { slotId: 'salt', label: 'Salt', amountGrams: 4, options: [{ id: 'kosher-salt', name: 'Kosher salt', gramsPerCup: 272 }, { id: 'fine-sea-salt', name: 'Fine sea salt', gramsPerCup: 292 }] },
    ],
  },
  {
    id: 'tomato-sauce-spicy',
    emoji: '\u{1F345}',
    name: 'Spicy Tomato Sauce',
    subtitle: 'Tomato + chili + vinegar',
    family: 'tomato',
    variantGroup: 'Tomato sauces',
    senseiFoodSlug: 'spicy-tomato-sauce',
    useFor: ['pasta', 'spicy', 'adults'],
    steps: ['Bloom chili in oil.', 'Add tomatoes; simmer.', 'Finish with vinegar; salt to taste.'],
    tip: 'Vinegar at the end keeps volatile acids bright.',
    filterTags: ['spicy', 'acid'],
    wheelTarget: { dx: 0.6, dy: 2.5, rx: 0.11, ry: 0.1 },
    recipe: [
      { slotId: 'oil', label: 'Olive oil (2 tbsp)', amountGrams: 28, options: [{ id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }, { id: 'butter', name: 'Butter', gramsPerCup: 227 }] },
      { slotId: 'chili', label: 'Red pepper flakes / fresh chili', amountGrams: 6, options: [{ id: 'flakes', name: 'Red pepper flakes', gramsPerCup: 112 }, { id: 'jalapeno', name: 'Jalapeño (minced)', gramsPerCup: 100 }] },
      { slotId: 'tomatoes', label: 'Crushed tomatoes (1 can)', amountGrams: 400, options: [{ id: 'crushed', name: 'Crushed tomatoes', gramsPerCup: 245 }, { id: 'whole', name: 'Whole peeled tomatoes', gramsPerCup: 245 }] },
      { slotId: 'vinegar', label: 'Red wine vinegar (1 tbsp)', amountGrams: 15, options: [{ id: 'rwv', name: 'Red wine vinegar', gramsPerCup: 240 }, { id: 'sherry', name: 'Sherry vinegar', gramsPerCup: 240 }] },
      { slotId: 'salt', label: 'Salt', amountGrams: 4, options: [{ id: 'kosher-salt', name: 'Kosher salt', gramsPerCup: 272 }, { id: 'fine-sea-salt', name: 'Fine sea salt', gramsPerCup: 292 }] },
    ],
  },
  {
    id: 'reduction-balsamic',
    emoji: '\u{1F4A7}',
    name: 'Balsamic Glaze',
    subtitle: 'Vinegar-forward reduction',
    family: 'reduction',
    variantGroup: 'Reductions',
    senseiFoodSlug: 'balsamic-glaze',
    useFor: ['drizzle', 'vegetables', 'cheese'],
    steps: ['Simmer balsamic with a touch of sweetener until syrupy.', 'Watch heat — sugars scorch.'],
    tip: 'Use a wide pan for faster evaporation with less hot spots.',
    filterTags: ['acid', 'drizzle'],
    wheelTarget: { dx: 0.2, dy: 3.5, rx: 0.1, ry: 0.11 },
    recipe: [
      { slotId: 'liquid', label: 'Balsamic vinegar (1 cup)', amountGrams: 250, options: [{ id: 'balsamic', name: 'Balsamic vinegar', gramsPerCup: 250 }, { id: 'cheap-balsamic', name: 'Economy balsamic', gramsPerCup: 250 }] },
      { slotId: 'sweet', label: 'Brown sugar (2 tbsp)', amountGrams: 24, options: [{ id: 'brown-sugar', name: 'Brown sugar', gramsPerCup: 200 }, { id: 'white-sugar', name: 'Sugar', gramsPerCup: 200 }] },
    ],
  },
  {
    id: 'reduction-stock',
    emoji: '\u{1F4A7}',
    name: 'Stock Reduction (Demi-style)',
    subtitle: 'Long-simmered stock until glossy',
    family: 'reduction',
    variantGroup: 'Reductions',
    senseiFoodSlug: 'stock-reduction-demi',
    useFor: ['steak', 'roasts', 'plating'],
    steps: ['Start with roasted bones stock if possible.', 'Simmer uncovered until glossy and spoon-coating.'],
    tip: 'Skim scum early; salt late — concentration magnifies salt.',
    filterTags: ['beef', 'chef'],
    wheelTarget: { dx: 1.2, dy: 2.5, rx: 0.1, ry: 0.1 },
    recipe: [
      { slotId: 'stock', label: 'Beef stock (4 cups start)', amountGrams: 960, options: [{ id: 'beef-stock', name: 'Beef stock', gramsPerCup: 240 }, { id: 'veal-stock', name: 'Veal stock', gramsPerCup: 240 }] },
      { slotId: 'finish', label: 'Butter finish (optional)', amountGrams: 14, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'none', name: 'Skip butter', gramsPerCup: 240 }] },
    ],
  },
  {
    id: 'soy-teriyaki',
    emoji: '\u{1F35A}',
    name: 'Teriyaki Glaze',
    subtitle: 'Soy + sugar + mirin',
    family: 'umami',
    variantGroup: 'Soy system',
    senseiFoodSlug: 'teriyaki-glaze',
    useFor: ['salmon', 'chicken', 'rice bowls'],
    steps: ['Combine soy, sugar, mirin; simmer until glossy.', 'Cool slightly before brushing — sugar burns fast.'],
    tip: 'Mirin brings sweetness + aroma; balance with a splash of vinegar if too cloying.',
    filterTags: ['glaze', 'sweet'],
    wheelTarget: { dx: -2, dy: 0.3, rx: 0.11, ry: 0.09 },
    recipe: [
      { slotId: 'soy', label: 'Soy sauce (⅓ cup)', amountGrams: 85, options: [{ id: 'soy', name: 'Soy sauce', gramsPerCup: 256 }, { id: 'tamari', name: 'Tamari', gramsPerCup: 256 }] },
      { slotId: 'sweet', label: 'Sugar (3 tbsp)', amountGrams: 36, options: [{ id: 'white-sugar', name: 'Sugar', gramsPerCup: 200 }, { id: 'brown-sugar', name: 'Brown sugar', gramsPerCup: 200 }] },
      { slotId: 'water', label: 'Mirin (3 tbsp)', amountGrams: 45, options: [{ id: 'mirin', name: 'Mirin', gramsPerCup: 240 }, { id: 'water', name: 'Water (sub)', gramsPerCup: 236 }] },
      { slotId: 'acid', label: 'Rice vinegar (optional splash)', amountGrams: 5, options: [{ id: 'none', name: 'None', gramsPerCup: 240 }, { id: 'rice-vinegar', name: 'Rice vinegar', gramsPerCup: 240 }] },
    ],
  },
  {
    id: 'soy-garlic',
    emoji: '\u{1F35A}',
    name: 'Garlic Soy Sauce',
    subtitle: 'Soy + garlic + oil',
    family: 'umami',
    variantGroup: 'Soy system',
    senseiFoodSlug: 'garlic-soy-sauce',
    useFor: ['dumplings', 'greens', 'rice'],
    steps: ['Warm oil gently; fry garlic until fragrant (not brown).', 'Add soy and a splash of water; simmer 1 minute.'],
    tip: 'Oil carries garlic aromatics — strain if you want a clear sauce.',
    filterTags: ['garlic', 'quick'],
    wheelTarget: { dx: -2.5, dy: 0.2, rx: 0.11, ry: 0.085 },
    recipe: [
      { slotId: 'soy', label: 'Soy sauce (½ cup)', amountGrams: 128, options: [{ id: 'soy', name: 'Soy sauce', gramsPerCup: 256 }, { id: 'tamari', name: 'Tamari', gramsPerCup: 256 }] },
      { slotId: 'water', label: 'Water (¼ cup)', amountGrams: 60, options: [{ id: 'water', name: 'Water', gramsPerCup: 236 }, { id: 'stock', name: 'Stock', gramsPerCup: 240 }] },
      { slotId: 'garlic', label: 'Garlic (4 cloves)', amountGrams: 16, options: [{ id: 'fresh-garlic', name: 'Garlic (minced)', gramsPerCup: 136 }, { id: 'garlic-paste', name: 'Garlic paste', gramsPerCup: 250 }] },
      { slotId: 'oil', label: 'Neutral oil (1 tbsp)', amountGrams: 14, options: [{ id: 'neutral-oil', name: 'Neutral oil', gramsPerCup: 218 }, { id: 'sesame', name: 'Toasted sesame oil', gramsPerCup: 216 }] },
    ],
  },
  {
    id: 'cheese-nacho',
    emoji: '\u{1F9C0}',
    name: 'Nacho Cheese Sauce',
    subtitle: 'Cheddar + milk + spices',
    family: 'cheese',
    variantGroup: 'Cheese sauces',
    senseiFoodSlug: 'nacho-cheese-sauce',
    useFor: ['chips', 'game day', 'burgers'],
    steps: ['Make thin roux; add warm milk.', 'Melt cheddar off heat; whisk in spices.'],
    tip: 'American-style melt often uses sodium citrate in industry; at home keep heat low.',
    filterTags: ['party', 'spicy'],
    wheelTarget: { dx: 3.1, dy: 0.4, rx: 0.1, ry: 0.085 },
    recipe: [
      { slotId: 'butter', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'drippings', name: 'Pan drippings', gramsPerCup: 240 }] },
      { slotId: 'thickener', label: 'Flour (1.5 tbsp)', amountGrams: 12, options: [{ id: 'flour', name: 'AP flour', gramsPerCup: 120 }, { id: 'cornstarch', name: 'Cornstarch', gramsPerCup: 128 }] },
      { slotId: 'base', label: 'Whole milk (1 cup)', amountGrams: 245, options: [{ id: 'milk', name: 'Whole milk', gramsPerCup: 245 }, { id: 'cream', name: 'Heavy cream', gramsPerCup: 240 }] },
      { slotId: 'cheese', label: 'Cheddar (1½ cups shredded)', amountGrams: 170, options: [{ id: 'cheddar', name: 'Cheddar', gramsPerCup: 113 }, { id: 'colby', name: 'Colby', gramsPerCup: 113 }] },
      { slotId: 'spice', label: 'Paprika + cayenne (pinch)', amountGrams: 2, options: [{ id: 'paprika', name: 'Paprika', gramsPerCup: 110 }, { id: 'cayenne', name: 'Cayenne', gramsPerCup: 100 }] },
    ],
  },
  {
    id: 'cheese-mornay',
    emoji: '\u{1F9C0}',
    name: 'Mornay Sauce',
    subtitle: 'Béchamel + Gruyère + mustard',
    family: 'cheese',
    variantGroup: 'Cheese sauces',
    senseiFoodSlug: 'mornay-sauce',
    useFor: ['fish', 'vegetables', 'eggs'],
    steps: ['Roux + milk béchamel.', 'Whisk in mustard; off heat add cheese.'],
    tip: 'Mustard is traditional — tiny acid helps emulsion without reading “mustardy.”',
    filterTags: ['french', 'classic'],
    wheelTarget: { dx: 3, dy: 0.6, rx: 0.095, ry: 0.085 },
    recipe: [
      { slotId: 'butter', label: 'Butter (2 tbsp)', amountGrams: 28, options: [{ id: 'butter', name: 'Butter', gramsPerCup: 227 }, { id: 'drippings', name: 'Pan drippings', gramsPerCup: 240 }] },
      { slotId: 'thickener', label: 'Flour (2 tbsp)', amountGrams: 16, options: [{ id: 'flour', name: 'AP flour', gramsPerCup: 120 }, { id: 'cornstarch', name: 'Cornstarch', gramsPerCup: 128 }] },
      { slotId: 'base', label: 'Milk (1 cup)', amountGrams: 245, options: [{ id: 'milk', name: 'Whole milk', gramsPerCup: 245 }, { id: 'cream', name: 'Heavy cream', gramsPerCup: 240 }] },
      { slotId: 'mustard', label: 'Dijon (1 tsp)', amountGrams: 5, options: [{ id: 'dijon', name: 'Dijon', gramsPerCup: 250 }, { id: 'whole-grain', name: 'Whole grain', gramsPerCup: 250 }] },
      { slotId: 'cheese', label: 'Gruyère (1 cup shredded)', amountGrams: 108, options: [{ id: 'gruyere', name: 'Gruyère', gramsPerCup: 108 }, { id: 'cheddar', name: 'Cheddar', gramsPerCup: 113 }] },
    ],
  },
  {
    id: 'herb-pesto',
    emoji: '\u{1F33F}',
    name: 'Basil Pesto',
    subtitle: 'Oil + basil + nuts + cheese',
    family: 'herb',
    variantGroup: 'Herb sauces',
    senseiFoodSlug: 'basil-pesto',
    useFor: ['pasta', 'sandwiches', 'chicken'],
    steps: ['Pound or pulse basil with garlic and salt.', 'Add nuts; stream in oil; fold in cheese off heat.'],
    tip: 'Cheese last keeps color brighter.',
    filterTags: ['italian', 'no-cook-ish'],
    wheelTarget: { dx: 2.5, dy: 0.8, rx: 0.1, ry: 0.095 },
    recipe: [
      { slotId: 'herbs', label: 'Basil (2 cups packed)', amountGrams: 60, options: [{ id: 'basil', name: 'Basil leaves', gramsPerCup: 20 }, { id: 'parsley', name: 'Parsley blend', gramsPerCup: 30 }] },
      { slotId: 'oil', label: 'Olive oil (½ cup)', amountGrams: 108, options: [{ id: 'olive-oil', name: 'Olive oil', gramsPerCup: 216 }, { id: 'neutral-oil', name: 'Neutral oil', gramsPerCup: 218 }] },
      { slotId: 'garlic', label: 'Garlic (2 cloves)', amountGrams: 8, options: [{ id: 'fresh-garlic', name: 'Garlic', gramsPerCup: 136 }, { id: 'garlic-paste', name: 'Garlic paste', gramsPerCup: 250 }] },
      { slotId: 'acid', label: 'Lemon juice (1 tsp)', amountGrams: 5, options: [{ id: 'lemon-juice', name: 'Lemon juice', gramsPerCup: 244 }, { id: 'none', name: 'Skip', gramsPerCup: 244 }] },
      { slotId: 'cheese', label: 'Parmesan (½ cup)', amountGrams: 50, options: [{ id: 'parmesan', name: 'Parmesan', gramsPerCup: 100 }, { id: 'pecorino', name: 'Pecorino', gramsPerCup: 110 }] },
      { slotId: 'nuts', label: 'Pine nuts (¼ cup)', amountGrams: 34, options: [{ id: 'pine', name: 'Pine nuts', gramsPerCup: 135 }, { id: 'walnut', name: 'Walnuts', gramsPerCup: 120 }] },
    ],
  },
];

export const sauces: Sauce[] = [...BASE_SAUCES, ...VARIANT_SAUCES];
