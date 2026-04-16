import { BASE_SAUCES, type Sauce, sauces } from './sauces';

/** Display order for recipe “file” tabs on the home page (10 family hubs). */
export const SAUCE_HUB_ORDER: string[] = [
  'Pan sauces',
  'Gravy',
  'Cream sauces',
  'Tomato sauces',
  'Vinaigrette',
  'Mayo / aioli',
  'Reductions',
  'Herb sauces',
  'Soy system',
  'Cheese sauces',
];

export type SauceHub = {
  hubKey: string;
  recipes: Sauce[];
};

const baseIndex = new Map(BASE_SAUCES.map((s, i) => [s.id, i]));

function sortRecipesInHub(list: Sauce[]): Sauce[] {
  return [...list].sort((a, b) => {
    const ia = baseIndex.has(a.id) ? (baseIndex.get(a.id) as number) : 1000;
    const ib = baseIndex.has(b.id) ? (baseIndex.get(b.id) as number) : 1000;
    if (ia !== ib) return ia - ib;
    return a.name.localeCompare(b.name);
  });
}

export function buildSauceHubs(all: Sauce[] = sauces): SauceHub[] {
  const map = new Map<string, Sauce[]>();
  for (const s of all) {
    const k = s.variantGroup ?? s.id;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(s);
  }
  for (const arr of map.values()) sortRecipesInHub(arr);
  const keys = [...map.keys()];
  const ordered = [
    ...SAUCE_HUB_ORDER.filter((k) => map.has(k)),
    ...keys.filter((k) => !SAUCE_HUB_ORDER.includes(k)).sort(),
  ];
  return ordered.map((hubKey) => ({ hubKey, recipes: map.get(hubKey)! }));
}

export function recipesInSameHub(sauceId: string, all: Sauce[] = sauces): Sauce[] {
  const s = all.find((x) => x.id === sauceId);
  if (!s) return [];
  const key = s.variantGroup ?? s.id;
  return sortRecipesInHub(all.filter((x) => (x.variantGroup ?? x.id) === key));
}

export function hubCardMeta(hub: SauceHub): { title: string; emoji: string; subtitle: string; countLabel: string } {
  const first = hub.recipes[0];
  const n = hub.recipes.length;
  return {
    title: hub.hubKey,
    emoji: first.emoji,
    subtitle:
      n > 1
        ? `${n} recipes — open to pick a build in the recipe tab.`
        : first.subtitle,
    countLabel: n > 1 ? `${n} recipes` : '1 recipe',
  };
}
