import type { Sauce } from '../data/sauces';
import { structuralCopyForSauce } from '../data/sauceStructuralTargets';
import type { EngineeringStructure } from '../utils/sauceBalance';

export function SauceStructurePanel({
  sauce,
  structure,
}: {
  sauce: Sauce;
  structure: EngineeringStructure;
}) {
  const copy = structuralCopyForSauce(sauce);
  const row = (label: string, v: number) => (
    <div className="flex justify-between gap-2 text-xs border-b border-slate-200/80 py-1.5 last:border-0">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className="font-mono font-bold text-slate-900 tabular-nums">{v.toFixed(0)}%</span>
    </div>
  );

  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-3 shadow-sm">
      <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wide mb-1">Structure (engine)</h3>
      <p className="text-[11px] text-indigo-900/90 leading-snug mb-2">{copy.headline}</p>
      <div className="rounded-lg bg-white/90 border border-indigo-100 px-2 py-1 mb-2">
        {row('Liquid', structure.liquidPct)}
        {row('Fat', structure.fatPct)}
        {row('Acid', structure.acidPct)}
        {row('Sweet', structure.sweetPct)}
        {row('Body / solids', structure.bodyPct)}
        <div className="flex justify-between gap-2 text-xs pt-1.5 border-t border-slate-100">
          <span className="text-slate-600 font-medium">Fat ÷ (fat+liq+body)</span>
          <span className="font-mono font-bold text-indigo-900 tabular-nums">{(structure.fatRatio * 100).toFixed(0)}%</span>
        </div>
      </div>
      <ul className="text-[11px] text-indigo-950/95 space-y-1 list-disc pl-4 leading-snug mb-2">
        {copy.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      {copy.rules && copy.rules.length > 0 ? (
        <ul className="text-[10px] text-amber-950/95 space-y-0.5 border-t border-amber-200/60 pt-2 mt-1">
          {copy.rules.map((r) => (
            <li key={r}>→ {r}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-[10px] text-slate-500 mt-2 leading-snug">
        Percentages are a simplified read from your line items (not lab analysis). Use them with the flavor wheel and taste.
      </p>
    </section>
  );
}
