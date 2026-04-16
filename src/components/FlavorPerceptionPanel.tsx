import type { SauceWheelResult } from '../utils/sauceBalance';

export function FlavorPerceptionPanel({ wheel }: { wheel: SauceWheelResult }) {
  const textureLabel =
    wheel.texture === 'medium-thin'
      ? 'medium-thin'
      : wheel.texture === 'medium'
        ? 'medium'
        : wheel.texture;

  const rows: { label: string; value: number }[] = [
    { label: 'Salt', value: wheel.scores.salt },
    { label: 'Acid', value: wheel.scores.acid },
    { label: 'Fat', value: wheel.scores.fat },
    { label: 'Sweet', value: wheel.scores.sweet },
    { label: 'Umami', value: wheel.scores.umami },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/90 px-3 py-3 shadow-inner">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Perceived balance</p>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex justify-between items-baseline gap-2 py-1.5 border-b border-white/10 last:border-0"
        >
          <span className="text-slate-400 text-xs font-semibold">{r.label}</span>
          <span className="text-amber-100 font-mono text-sm font-bold tabular-nums">{r.value}</span>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
        <div className="flex justify-between gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Texture</span>
          <span className="text-slate-100 font-medium capitalize">{textureLabel}</span>
        </div>
        <div className="flex justify-between gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Intensity</span>
          <span className="text-slate-100 font-medium">
            {wheel.intensity >= 72 ? 'high' : wheel.intensity >= 44 ? 'medium' : 'low'}
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-amber-100/95 font-semibold leading-snug">{wheel.positionSummary}</p>
      <p className="mt-1 text-[11px] text-slate-400 leading-snug">
        <span className="text-slate-500 font-semibold">Why: </span>
        {wheel.why.slice(0, 3).join(' · ')}
      </p>
      <ul className="mt-2 space-y-1.5">
        {wheel.suggestions.map((s, i) => (
          <li key={i} className="text-[11px] text-sky-200/95 leading-snug pl-2 border-l-2 border-sky-500/60">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
