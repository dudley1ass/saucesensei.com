import { sauces } from './sauces';
import type { WheelTag } from '../utils/sauceBalance';

export type PresetIngredient = {
  catalogKey: string;
  name: string;
  gramsPerCup: number;
  defaultWheelTag: WheelTag;
};

function guessWheelTag(name: string): WheelTag {
  const n = name.toLowerCase();
  if (
    /salt|soy|tamari|fish sauce|miso|broth|stock|drippings|worcestershire|bouillon/.test(n)
  ) {
    return 'salt';
  }
  if (/vinegar|lemon|lime|wine|mustard|citrus|acid/.test(n)) return 'acid';
  if (/honey|sugar|maple|molasses|sweet/.test(n)) return 'sweet';
  if (/butter|oil|cream|mayo|yogurt|cheese|dripping|fat/.test(n)) return 'fat';
  return 'neutral';
}

/** All ingredient options across the 10 sauces, deduped, for “Add ingredient”. */
export function getPresetIngredientCatalog(): PresetIngredient[] {
  const map = new Map<string, PresetIngredient>();
  for (const sauce of sauces) {
    for (const item of sauce.recipe) {
      for (const opt of item.options) {
        const catalogKey = `${opt.id}__${opt.gramsPerCup}`;
        if (map.has(catalogKey)) continue;
        map.set(catalogKey, {
          catalogKey,
          name: opt.name,
          gramsPerCup: opt.gramsPerCup,
          defaultWheelTag: guessWheelTag(opt.name),
        });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}
