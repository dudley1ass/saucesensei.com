import {
  Flame,
  Thermometer,
  ListOrdered,
  Megaphone,
  Droplets,
  GitBranch,
  TrendingDown,
  Repeat1,
  Sparkles,
} from 'lucide-react';

const TIPS: { icon: typeof Flame; title: string; body: string; callout: string }[] = [
  {
    icon: Thermometer,
    title: 'Temperature (silent killer)',
    body: 'Low heat can leave emulsions flat; high heat breaks butter, cream, and cheese sauces. Heat is a variable your wheel does not draw.',
    callout: 'If it breaks → LOWER HEAT before fixing.',
  },
  {
    icon: ListOrdered,
    title: 'Order of operations',
    body: 'Same ingredients, different timing: acid early vs late, butter at boil vs off heat, starch before vs after acid.',
    callout: 'Finish with FAT and ACID at the end.',
  },
  {
    icon: Megaphone,
    title: 'Salt is an amplifier',
    body: 'Salt is not only “salty” — it changes how loud everything else reads, including umami and sweetness.',
    callout: 'Before fixing anything — check salt.',
  },
  {
    icon: Droplets,
    title: 'Hidden water',
    body: 'Chicken weeps, vegetables osmose, frozen food purges water — sauces go thin without you “adding water.”',
    callout: 'Unexpected thin? → Reduce first before adjusting.',
  },
  {
    icon: GitBranch,
    title: 'Emulsion vs non-emulsion',
    body: 'Pan, mayo, and many cheese sauces can break; soy glazes and pure reductions mostly concentrate instead.',
    callout: 'If oily → likely broken — warm liquid + whisk; then lower heat.',
  },
  {
    icon: TrendingDown,
    title: 'Reduction curve',
    body: 'Flavor does not improve linearly as liquid leaves; the last third concentrates salt and bitter notes fastest.',
    callout: 'Too strong? You may have reduced too far → add liquid.',
  },
  {
    icon: Repeat1,
    title: 'One change rule',
    body: 'Multivariate panic makes debugging impossible — you will not know which move helped.',
    callout: 'Make ONE adjustment → taste → repeat.',
  },
  {
    icon: Sparkles,
    title: 'Umami (5th dimension)',
    body: 'A sauce can look “balanced” on salt/acid/fat/sweet yet still feel empty without glutamate / nucleotide depth.',
    callout: 'Still missing something? → add UMAMI (paste, parmesan, mushroom, soy, etc.).',
  },
];

export function KitchenSciencePanel({ onOpenLibrary }: { onOpenLibrary: () => void }) {
  return (
    <section className="rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div>
          <h2 className="text-xs font-bold text-violet-950 uppercase tracking-wide flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600 shrink-0" aria-hidden />
            Kitchen science (SenseiFood + wheel)
          </h2>
          <p className="text-xs text-violet-900/90 mt-1 leading-relaxed">
            Quick rules that do not show as quadrants on the wheel — temperature, timing, emulsion physics, reduction curves,
            and umami depth.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenLibrary}
          className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border border-violet-400 text-violet-950 hover:bg-violet-100"
        >
          Open science library
        </button>
      </div>
      <ul className="space-y-3">
        {TIPS.map((t) => (
          <li
            key={t.title}
            className="rounded-lg border border-violet-100 bg-white/90 px-3 py-2.5 text-sm text-violet-950 leading-snug"
          >
            <div className="flex items-start gap-2">
              <t.icon className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-bold text-violet-950">{t.title}</p>
                <p className="text-violet-900/95 mt-0.5">{t.body}</p>
                <p className="mt-1.5 text-xs font-bold text-orange-900 bg-orange-50 border border-orange-200 rounded-md px-2 py-1 inline-block">
                  {t.callout}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
