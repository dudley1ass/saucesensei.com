/** Kitchen-friendly cup display (no ugly decimals like 0.6 cup — use tbsp/tsp or fractions). */

const FRACS: { val: number; str: string }[] = [
  { val: 0, str: '' },
  { val: 1 / 8, str: '\u215B' },
  { val: 1 / 4, str: '\u00BC' },
  { val: 1 / 3, str: '\u2153' },
  { val: 3 / 8, str: '\u215C' },
  { val: 1 / 2, str: '\u00BD' },
  { val: 5 / 8, str: '\u215D' },
  { val: 2 / 3, str: '\u2154' },
  { val: 3 / 4, str: '\u00BE' },
  { val: 7 / 8, str: '\u215E' },
  { val: 1, str: '' },
];

function snapFrac(decimal: number): { whole: number; fracStr: string } {
  let best = FRACS[0];
  let bestDist = Math.abs(decimal - FRACS[0].val);
  for (const f of FRACS) {
    const d = Math.abs(decimal - f.val);
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  if (best.val === 1) return { whole: 1, fracStr: '' };
  return { whole: 0, fracStr: best.str };
}

function formatCupsInternal(cups: number): string {
  if (cups <= 0) return '0 tsp';

  if (cups >= 0.25) {
    const wholeCups = Math.floor(cups);
    const remainder = cups - wholeCups;
    const { whole: fracWhole, fracStr } = snapFrac(remainder);
    const totalWhole = wholeCups + fracWhole;

    const cupStr =
      totalWhole > 0
        ? `${totalWhole}${fracStr} cup${totalWhole > 1 ? 's' : ''}`
        : fracStr
          ? `${fracStr} cup`
          : '';

    if (!fracStr && remainder > 0.01) {
      const tbspRaw = remainder * 16;
      const wholeTbsp = Math.floor(tbspRaw);
      const tbspRem = tbspRaw - wholeTbsp;
      const { whole: tw, fracStr: tf } = snapFrac(tbspRem);
      const totalTbsp = wholeTbsp + tw;
      const tbspStr = totalTbsp > 0 ? `${totalTbsp}${tf} tbsp` : tf ? `${tf} tbsp` : '';
      if (cupStr && tbspStr) return `${cupStr} + ${tbspStr}`;
      return cupStr || tbspStr || '0 tsp';
    }

    if (!cupStr) {
      // fall through
    } else {
      return cupStr;
    }
  }

  const tbsp = cups * 16;
  if (tbsp >= 1) {
    const wholeTbsp = Math.floor(tbsp);
    const remainder = tbsp - wholeTbsp;
    const { whole: fw, fracStr } = snapFrac(remainder);
    const totalTbsp = wholeTbsp + fw;
    const tbspStr =
      totalTbsp > 0 ? `${totalTbsp}${fracStr} tbsp` : fracStr ? `${fracStr} tbsp` : '';

    if (!fracStr && remainder > 0.05) {
      const tspRaw = remainder * 3;
      const wholeTsp = Math.floor(tspRaw);
      const tspRem = tspRaw - wholeTsp;
      const { whole: tw, fracStr: tf } = snapFrac(tspRem);
      const totalTsp = wholeTsp + tw;
      const tspStr = totalTsp > 0 ? `${totalTsp}${tf} tsp` : tf ? `${tf} tsp` : '';
      if (tbspStr && tspStr) return `${tbspStr} + ${tspStr}`;
      return tbspStr || tspStr || '0 tsp';
    }
    return tbspStr || '0 tsp';
  }

  const tsp = cups * 48;
  const wholeTsp = Math.floor(tsp);
  const remainder = tsp - wholeTsp;
  const { whole: fw, fracStr } = snapFrac(remainder);
  const totalTsp = wholeTsp + fw;
  if (totalTsp > 0) return `${totalTsp}${fracStr} tsp`;
  if (fracStr) return `${fracStr} tsp`;
  return '\u00BC tsp';
}

/** Snap volumetric edits to the nearest 1/8 cup (kitchen-friendly). */
export function snapCupsToEighth(cups: number): number {
  if (cups <= 0) return 0;
  return Math.round(cups * 8) / 8;
}

/** Readable measure for display (cups with unicode fractions, or tbsp/tsp). */
export function formatKitchenCups(cups: number): string {
  return formatCupsInternal(cups);
}
