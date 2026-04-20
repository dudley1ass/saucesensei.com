import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChefHat,
  Plus,
  Printer,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { getPresetIngredientCatalog } from './data/presetIngredients';
import { buildSauceHubs, hubCardMeta, recipesInSameHub, type SauceHub } from './data/sauceHubs';
import { RecipeItem, SAUCE_FAMILIES, Sauce, SauceWheelTarget, sauces } from './data/sauces';
import { formatKitchenCups, snapCupsToEighth } from './utils/kitchenVolume';
import {
  computeEngineeringStructure,
  computeSauceWheelPosition,
  evaluateSauceBalance,
  isReductionSauceFamily,
  type RecipeLineInput,
  type WheelTag,
} from './utils/sauceBalance';
import { FlavorPerceptionPanel } from './components/FlavorPerceptionPanel';
import { SauceBalanceWheelVisual } from './components/SauceBalanceWheelVisual';
import { SauceStructurePanel } from './components/SauceStructurePanel';
import { ArticleView } from './components/ArticleView';
import { KitchenSciencePanel } from './components/KitchenSciencePanel';
import { PageHelmet } from './components/PageHelmet';
import { RouteAnalytics } from './components/RouteAnalytics';
import { LIBRARY_ARTICLES, getLibraryArticle } from './data/scienceArticles';
import { initGoogleAnalytics } from './analytics';

initGoogleAnalytics();

const PRESET_INGREDIENT_CATALOG = getPresetIngredientCatalog();

const HEADER_GRADIENT = 'linear-gradient(135deg, #5c1f33, #8b2942, #c45c26)';
const PAGE_BG = 'linear-gradient(135deg, #fdf6e3 0%, #fceee0 45%, #f0e6f4 100%)';
const BTN_GRADIENT = 'linear-gradient(135deg, #5c1f33, #c45c26)';
const DETAIL_PANEL =
  'linear-gradient(145deg, rgba(255,251,245,0.97) 0%, rgba(255,255,255,0.95) 40%, rgba(240,249,255,0.92) 100%)';

type MeasurementMode = 'metric' | 'volumetric';

type EditableRecipeItem = {
  slotId: string;
  label: string;
  amountGrams: number;
  selectedOptionId: string;
  options: RecipeItem['options'];
};

type CustomLine = {
  id: string;
  label: string;
  baseGrams: number;
  gramsPerCup: number;
  wheelTag: WheelTag;
};

function buildEditableRecipe(sauce: Sauce): EditableRecipeItem[] {
  return sauce.recipe.map((item) => ({
    slotId: item.slotId,
    label: item.label,
    amountGrams: item.amountGrams,
    selectedOptionId: item.options[0].id,
    options: item.options,
  }));
}

/** Default build (first option per slot, book amounts) — same starting point as a freshly opened recipe. */
function defaultRecipeLinesForWheel(sauce: Sauce): RecipeLineInput[] {
  return sauce.recipe.map((item) => ({
    slotId: item.slotId,
    optionId: item.options[0].id,
    grams: item.amountGrams,
  }));
}

function titleCasePhrase(s: string): string {
  return s
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

function formatUseForList(parts: string[]): string {
  if (parts.length === 0) return '';
  const tc = parts.map(titleCasePhrase);
  if (tc.length === 1) return tc[0];
  if (tc.length === 2) return `${tc[0]} and ${tc[1]}`;
  return `${tc.slice(0, -1).join(', ')}, and ${tc[tc.length - 1]}`;
}

function cupsFromGrams(grams: number, gramsPerCup: number): number {
  if (gramsPerCup <= 0) return 0;
  return grams / gramsPerCup;
}

function gramsFromCups(cups: number, gramsPerCup: number): number {
  return cups * gramsPerCup;
}

function messagePanelClass(sev: 'ok' | 'info' | 'warn' | 'error'): string {
  switch (sev) {
    case 'error':
      return 'border-red-300 bg-red-50/95 text-red-950';
    case 'warn':
      return 'border-amber-300 bg-amber-50/95 text-amber-950';
    case 'info':
      return 'border-sky-300 bg-sky-50/95 text-sky-950';
    case 'ok':
      return 'border-emerald-300 bg-emerald-50/95 text-emerald-950';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-800';
  }
}

function AddIngredientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (line: Omit<CustomLine, 'id'>) => void;
}) {
  const [presetKey, setPresetKey] = useState('');
  const [label, setLabel] = useState('');
  const [grams, setGrams] = useState(15);
  const [gramsPerCup, setGramPerCup] = useState(240);
  const [wheelTag, setWheelTag] = useState<WheelTag>('neutral');

  const submit = () => {
    const trimmed = label.trim() || 'Custom ingredient';
    onAdd({
      label: trimmed,
      baseGrams: Math.max(0, grams),
      gramsPerCup: Math.max(1, gramsPerCup),
      wheelTag,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 app-print-hide">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-amber-200/80 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 className="text-lg font-bold text-indigo-950">Add to this sauce</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase">From pantry (all recipe ingredients)</span>
            <select
              value={presetKey}
              onChange={(e) => {
                const v = e.target.value;
                setPresetKey(v);
                if (!v) return;
                const p = PRESET_INGREDIENT_CATALOG.find((x) => x.catalogKey === v);
                if (p) {
                  setLabel(p.name);
                  setGramPerCup(p.gramsPerCup);
                  setWheelTag(p.defaultWheelTag);
                }
              }}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-white"
            >
              <option value="">Choose an ingredient?</option>
              {PRESET_INGREDIENT_CATALOG.map((p) => (
                <option key={p.catalogKey} value={p.catalogKey}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase">Name</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Adjust name if needed"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase">Amount (base recipe, g)</span>
            <input
              type="number"
              min={0}
              step={1}
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value) || 0)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase">Grams per US cup (for volume)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={gramsPerCup}
              onChange={(e) => setGramPerCup(Number(e.target.value) || 240)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase">Flavor pull (for wheel)</span>
            <select
              value={wheelTag}
              onChange={(e) => setWheelTag(e.target.value as WheelTag)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 bg-white"
            >
              <option value="neutral">Neutral / other (mostly body)</option>
              <option value="salt">Salt / umami</option>
              <option value="fat">Fat / richness</option>
              <option value="acid">Acid / brightness</option>
              <option value="sweet">Sweet</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="px-4 py-2 text-sm rounded-lg font-semibold text-white"
            style={{ background: BTN_GRADIENT }}
          >
            Add line
          </button>
        </div>
      </div>
    </div>
  );
}

function sauceMatchesLandingFilters(
  s: Sauce,
  qLower: string,
  family: Sauce['family'] | 'all',
): boolean {
  if (family !== 'all' && s.family !== family) return false;
  if (!qLower) return true;
  const blob = [
    s.name,
    s.subtitle,
    s.variantGroup ?? '',
    ...s.useFor,
    ...s.steps,
    ...s.recipe.flatMap((r) => r.options.map((opt) => opt.name)),
    s.tip,
    ...s.filterTags,
    SAUCE_FAMILIES[s.family].label,
  ]
    .join(' ')
    .toLowerCase();
  return blob.includes(qLower);
}

function SauceHubCard({ hub, onOpen }: { hub: SauceHub; onOpen: () => void }) {
  const meta = hubCardMeta(hub);
  const first = hub.recipes[0];
  const fam = SAUCE_FAMILIES[first.family];
  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-transparent hover:border-amber-700/30 hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full group">
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl" aria-hidden>
          {meta.emoji}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-50 text-violet-900 border border-violet-100">
            {meta.countLabel}
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-900">
            {fam.emoji} {fam.label}
          </span>
          <Sparkles className="w-4 h-4 text-amber-600/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-0.5">{meta.title}</h3>
      <p className="text-sm font-medium text-amber-900/90 mb-2 leading-snug">{meta.subtitle}</p>
      <p className="text-sm text-gray-600 mb-3 flex-grow">
        <span className="font-semibold text-indigo-950">Example use: </span>
        {formatUseForList(first.useFor)}.
      </p>

      <div className="border-t border-gray-100 pt-3 mb-4">
        <p className="text-xs text-gray-500 italic leading-relaxed">{first.tip}</p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all shadow-md hover:shadow-lg"
        style={{ background: BTN_GRADIENT }}
      >
        Open recipe file
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function SauceDetail({
  sauce,
  hubRecipes,
  onSelectHubRecipe,
  onBack,
  onPrint,
  onOpenScienceLibrary,
  recipeArticlePath,
}: {
  sauce: Sauce;
  /** Same variant-group builds; when more than one, header shows recipe tabs. */
  hubRecipes?: Sauce[];
  onSelectHubRecipe?: (id: string) => void;
  onBack: () => void;
  onPrint: () => void;
  onOpenScienceLibrary: () => void;
  /** In-app long-form guide (`/article/:slug`) when `senseiFoodSlug` is set. */
  recipeArticlePath?: string;
}) {
  const fam = SAUCE_FAMILIES[sauce.family];
  const [mode, setMode] = useState<MeasurementMode>('metric');
  const [recipe, setRecipe] = useState<EditableRecipeItem[]>(buildEditableRecipe(sauce));
  const [customLines, setCustomLines] = useState<CustomLine[]>([]);
  const [servings, setServings] = useState(1);
  const [reductionRemainingPct, setReductionRemainingPct] = useState(100);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setRecipe(buildEditableRecipe(sauce));
    setCustomLines([]);
    setServings(1);
    setMode('metric');
    setReductionRemainingPct(100);
    setShowAdd(false);
  }, [sauce]);

  const scale = servings;

  const displayGramsBase = useCallback((base: number) => base * scale, [scale]);

  const balanceLines: RecipeLineInput[] = useMemo(() => {
    const core: RecipeLineInput[] = recipe.map((item) => {
      const opt =
        item.options.find((o) => o.id === item.selectedOptionId) ?? item.options[0];
      return {
        slotId: item.slotId,
        optionId: opt.id,
        grams: displayGramsBase(item.amountGrams),
      };
    });
    const extra: RecipeLineInput[] = customLines.map((c) => ({
      slotId: c.id,
      optionId: 'custom',
      grams: displayGramsBase(c.baseGrams),
      wheelTag: c.wheelTag,
    }));
    return [...core, ...extra];
  }, [recipe, customLines, displayGramsBase]);

  const balance = useMemo(
    () =>
      evaluateSauceBalance(sauce.id, balanceLines, {
        reductionRemainingPct: isReductionSauceFamily(sauce.id)
          ? reductionRemainingPct
          : undefined,
      }),
    [sauce.id, balanceLines, reductionRemainingPct],
  );

  const structure = useMemo(
    () =>
      computeEngineeringStructure(sauce.id, balanceLines, {
        reductionRemainingPct: isReductionSauceFamily(sauce.id)
          ? reductionRemainingPct
          : undefined,
      }),
    [sauce.id, balanceLines, reductionRemainingPct],
  );

  const wheel = useMemo(
    () =>
      computeSauceWheelPosition(sauce.id, balanceLines, {
        reductionRemainingPct: isReductionSauceFamily(sauce.id)
          ? reductionRemainingPct
          : undefined,
      }),
    [sauce.id, balanceLines, reductionRemainingPct],
  );

  const defaultRecipeLines = useMemo(() => defaultRecipeLinesForWheel(sauce), [sauce]);

  const baseRecipeWheel = useMemo(
    () =>
      computeSauceWheelPosition(sauce.id, defaultRecipeLines, {
        reductionRemainingPct: isReductionSauceFamily(sauce.id) ? 100 : undefined,
      }),
    [sauce.id, defaultRecipeLines],
  );

  /** Teal style band follows the default recipe dot; `rx`/`ry` still come from sauce data. */
  const sauceStyleTarget: SauceWheelTarget = useMemo(
    () => ({ ...sauce.wheelTarget, dx: baseRecipeWheel.dx, dy: baseRecipeWheel.dy }),
    [sauce, baseRecipeWheel.dx, baseRecipeWheel.dy],
  );

  const prevWheelRef = useRef<{ dx: number; dy: number } | null>(null);
  const prevDx = prevWheelRef.current?.dx;
  const prevDy = prevWheelRef.current?.dy;
  useLayoutEffect(() => {
    prevWheelRef.current = { dx: wheel.dx, dy: wheel.dy };
  }, [wheel.dx, wheel.dy]);

  const totalScaledGrams = balanceLines.reduce((s, l) => s + l.grams, 0);

  const updateCoreAmount = (slotId: string, displayGrams: number) => {
    const base = displayGrams / scale;
    setRecipe((prev) =>
      prev.map((item) =>
        item.slotId === slotId ? { ...item, amountGrams: Math.max(0, base) } : item,
      ),
    );
  };

  const updateCustomAmount = (id: string, displayGrams: number) => {
    const base = displayGrams / scale;
    setCustomLines((prev) =>
      prev.map((c) => (c.id === id ? { ...c, baseGrams: Math.max(0, base) } : c)),
    );
  };

  const updateSelection = (slotId: string, nextOptionId: string) => {
    setRecipe((prev) =>
      prev.map((item) => {
        if (item.slotId !== slotId) return item;
        let grams = item.amountGrams;
        if (
          (sauce.id === 'soy-umami' || sauce.id === 'soy-teriyaki') &&
          slotId === 'acid' &&
          nextOptionId === 'none'
        )
          grams = 0;
        if (isReductionSauceFamily(sauce.id) && slotId === 'finish' && nextOptionId === 'none')
          grams = 0;
        if (sauce.id === 'mayo-aioli' && slotId === 'garlic' && nextOptionId === 'no-garlic') grams = 0;
        return { ...item, selectedOptionId: nextOptionId, amountGrams: grams };
      }),
    );
  };

  const renderIngredientRow = (
    key: string,
    label: string,
    sublabel: string,
    displayG: number,
    gramsPerCup: number,
    onAmountDisplayChange: (displayG: number) => void,
    middle: ReactNode,
    onRemove?: () => void,
  ) => {
    const cupsRaw = cupsFromGrams(displayG, gramsPerCup);
    const cupsSnapped = snapCupsToEighth(cupsRaw);
    const kitchen = formatKitchenCups(mode === 'volumetric' ? cupsSnapped : cupsRaw);

    return (
      <div
        key={key}
        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center rounded-xl border border-amber-200/60 bg-white/90 px-3 py-3 shadow-sm"
      >
        <div>
          <p className="text-sm font-bold text-indigo-950">{label}</p>
          <p className="text-xs text-gray-600">{sublabel}</p>
        </div>
        {middle}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <input
            type="number"
            value={
              mode === 'metric'
                ? Math.round(displayG)
                : cupsSnapped
            }
            step={mode === 'metric' ? 1 : 0.125}
            min={0}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isNaN(next)) return;
              if (mode === 'metric') {
                onAmountDisplayChange(next);
              } else {
                const snapped = snapCupsToEighth(next);
                onAmountDisplayChange(gramsFromCups(snapped, gramsPerCup));
              }
            }}
            className="w-28 text-right text-sm border border-amber-200 rounded-lg px-2 py-1.5 bg-white"
          />
          <span className="text-xs font-semibold text-amber-900/90 w-24">
            {mode === 'metric' ? 'g (scaled)' : 'cups (1/8 steps)'}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 shrink-0 rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs font-bold text-red-800 hover:bg-red-100"
              aria-label={`Delete ${label}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
        <p className="text-xs text-indigo-900/80 sm:col-span-3 font-medium">
          Kitchen measure: <span className="text-rose-800">{kitchen}</span>
          {' · '}
          <span className="text-gray-600">
            {Math.round(displayG)} g total for {servings}× batch
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen app-print-root" style={{ background: PAGE_BG }}>
      <header
        className="text-white shadow-lg app-print-hide"
        style={{ background: HEADER_GRADIENT }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onBack}
                className="text-white/85 hover:text-white transition-colors shrink-0"
                aria-label="Back to all sauces"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-3xl shrink-0" aria-hidden>
                {sauce.emoji}
              </span>
              <div className="min-w-0">
                <h1
                  className="text-xl sm:text-2xl font-bold truncate"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {sauce.name}
                </h1>
                <p className="text-amber-100/95 text-xs sm:text-sm truncate">
                  {fam.label} · {sauce.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {recipeArticlePath ? (
                <Link
                  to={recipeArticlePath}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-white/25"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Article
                </Link>
              ) : null}
              <button
                type="button"
                onClick={onPrint}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-white/25"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div
          className="print-clean-panel rounded-2xl shadow-xl border border-amber-200/50 p-4 sm:p-6 text-gray-900"
          style={{ background: DETAIL_PANEL }}
        >
          <div className="hidden print:block border-b-2 border-gray-800 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              {sauce.emoji} {sauce.name} · {sauce.subtitle}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Sauce Sensei · {fam.label}</p>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(288px,340px)_1fr] xl:grid-cols-[minmax(300px,360px)_1fr] gap-5 items-start">
            <aside className="space-y-3 lg:sticky lg:top-4 self-start app-print-hide">
              <SauceBalanceWheelVisual
                dx={wheel.dx}
                dy={wheel.dy}
                pctSalt={wheel.pctSalt}
                pctFat={wheel.pctFat}
                pctAcid={wheel.pctAcid}
                pctSweet={wheel.pctSweet}
                umamiScore={wheel.scores.umami}
                prevDx={prevDx}
                prevDy={prevDy}
                showReferenceImage={false}
                dense
                hideQuadrantStrip
                sauceTarget={sauceStyleTarget}
                texture={wheel.texture}
                title="Flavor wheel"
                caption="Teal dashed = default recipe on this page (starting point). Orange dot = your build. Center glow = umami; ring around dot = body/texture."
              />
              <FlavorPerceptionPanel wheel={wheel} />
              <SauceStructurePanel sauce={sauce} structure={structure} />
            </aside>

            <div className="space-y-6 min-w-0">
          <section className="rounded-xl border-l-4 border-l-rose-500 bg-white/80 px-4 py-3 shadow-sm">
            <h2 className="text-xs font-bold text-rose-900 uppercase tracking-wide mb-2">
              Use for
            </h2>
            <p className="text-gray-900 leading-relaxed font-medium">
              {formatUseForList(sauce.useFor)}.
            </p>
          </section>

          <section className="rounded-xl border-l-4 border-l-amber-500 bg-white/80 px-1 py-1 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2">
              <h2 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Simple recipe
              </h2>
              <div className="flex flex-wrap items-center gap-2 app-print-hide">
                <div className="flex items-center gap-1 bg-amber-100/80 rounded-lg px-2 py-1 border border-amber-300/50">
                  <span className="text-xs font-bold text-amber-950">Servings</span>
                  <input
                    type="number"
                    min={0.25}
                    max={48}
                    step={0.25}
                    value={servings}
                    onChange={(e) =>
                      setServings(Math.max(0.25, Math.min(48, Number(e.target.value) || 1)))
                    }
                    className="w-14 text-center text-xs font-bold border border-amber-200 rounded-md py-0.5 bg-white"
                  />
                  <span className="text-[10px] text-amber-900/80">× batch</span>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                  {(['metric', 'volumetric'] as MeasurementMode[]).map((nextMode) => (
                    <button
                      key={nextMode}
                      type="button"
                      onClick={() => setMode(nextMode)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
                        mode === nextMode ? 'text-white shadow' : 'text-slate-600'
                      }`}
                      style={mode === nextMode ? { background: BTN_GRADIENT } : undefined}
                    >
                      {nextMode === 'metric' ? 'Metric (g)' : 'Volumetric'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Add ingredient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecipe(buildEditableRecipe(sauce));
                    setCustomLines([]);
                    setServings(1);
                    setReductionRemainingPct(100);
                  }}
                  className="text-xs px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {hubRecipes && hubRecipes.length > 1 && onSelectHubRecipe ? (
              <div className="px-3 pb-3 app-print-hide border-b border-amber-100/90">
                <label
                  htmlFor="hub-recipe-select"
                  className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5"
                >
                  Recipe build
                </label>
                <select
                  id="hub-recipe-select"
                  value={sauce.id}
                  onChange={(e) => onSelectHubRecipe(e.target.value)}
                  className="w-full max-w-md rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm font-semibold text-indigo-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                >
                  {hubRecipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.emoji} {r.name} — {r.subtitle}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-amber-900/75">
                  {hubRecipes.length} builds in this family — teal band centers on each build&apos;s default recipe.
                </p>
              </div>
            ) : null}

            {isReductionSauceFamily(sauce.id) && (
              <div className="mx-3 mb-3 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-3 app-print-hide">
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Reduction curve (planning only)
                </label>
                <p className="text-xs text-amber-900/90 mb-2">
                  Slide to the volume you expect left after simmering (100% = not reduced yet).
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={reductionRemainingPct}
                    onChange={(e) => setReductionRemainingPct(Number(e.target.value))}
                    className="flex-1 accent-amber-800"
                  />
                  <span className="text-xs font-mono text-amber-950 w-12 text-right">
                    {reductionRemainingPct}%
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 px-2 pb-3">
              {recipe.map((item) => {
                const selected =
                  item.options.find((opt) => opt.id === item.selectedOptionId) ?? item.options[0];
                const displayG = displayGramsBase(item.amountGrams);
                return renderIngredientRow(
                  item.slotId,
                  item.label,
                  'Preset slot — swap ingredient below',
                  displayG,
                  selected.gramsPerCup,
                  (d) => updateCoreAmount(item.slotId, d),
                  <select
                    value={selected.id}
                    onChange={(e) => updateSelection(item.slotId, e.target.value)}
                    className="text-sm border border-amber-200 rounded-lg px-2 py-2 bg-white text-indigo-950 font-medium"
                  >
                    {item.options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>,
                );
              })}

              {customLines.map((c) => {
                const displayG = displayGramsBase(c.baseGrams);
                return renderIngredientRow(
                  c.id,
                  c.label,
                  `Custom — wheel: ${c.wheelTag}`,
                  displayG,
                  c.gramsPerCup,
                  (d) => updateCustomAmount(c.id, d),
                  <div className="text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-2">
                    {c.wheelTag === 'neutral' ? 'Neutral / body' : `Counts toward ${c.wheelTag}`}
                  </div>,
                  () => setCustomLines((prev) => prev.filter((x) => x.id !== c.id)),
                );
              })}
            </div>
            <p className="text-sm font-bold text-indigo-950 px-3 pb-3">
              Total (scaled): {Math.round(totalScaledGrams)} g
            </p>
          </section>

          <section className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 space-y-3 shadow-sm">
            <h2 className="text-xs font-bold text-sky-950 uppercase tracking-wide">
              Balance guard
            </h2>
            <p className="text-xs text-sky-950/90 leading-relaxed">
              Ratios are approximate — fond, evaporation, and fine salt are only partly modeled — but they track
              the failure modes you listed, especially fat, acid, dilution, and roux balance. The wheel
              uses a hand-tuned perceived layer (fat rounds harshness, liquid dilutes, reduction concentrates).
            </p>
            <ul className="space-y-2">
              {balance.messages.map((m, i) => (
                <li
                  key={i}
                  className={`text-sm rounded-lg border px-3 py-2 leading-snug ${messagePanelClass(m.severity)}`}
                >
                  {m.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-sm text-indigo-950 shadow-sm">
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">
              Unifying rules (engineering lens)
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>
                <span className="font-bold">Emulsion stability:</span> fat must be supported by a water
                phase plus an emulsifier, agitation, or enough viscosity from reduction.
              </li>
              <li>
                <span className="font-bold">Flavor balance:</span> acid often lands around ~5–25%
                depending on the family; fat rounds acid; salt amplifies everything.
              </li>
              <li>
                <span className="font-bold">Practical targets:</span> pan sauce ~65% liquid / ~30%
                butter finish; gravy ~80% liquid / ~10% roux; soy glaze is a salt–sweet–acid triangle.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border-l-4 border-l-indigo-600 bg-white/85 px-4 py-3 shadow-sm">
            <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-3">
              How it works
            </h2>
            <ol className="list-decimal pl-5 space-y-3 text-gray-900 leading-relaxed">
              {sauce.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 px-4 py-3 shadow-sm">
            <p className="text-sm text-amber-950">
              <span className="font-bold">Tip: </span>
              {sauce.tip}
            </p>
          </section>

          <section className="app-print-hide">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {sauce.filterTags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-900 font-semibold border border-violet-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="app-print-hide">
            <KitchenSciencePanel onOpenLibrary={onOpenScienceLibrary} />
          </section>
            </div>
          </div>
        </div>
      </main>

      {showAdd && (
        <AddIngredientModal
          onClose={() => setShowAdd(false)}
          onAdd={(line) => {
            setCustomLines((prev) => [
              ...prev,
              { ...line, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
            ]);
          }}
        />
      )}
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [family, setFamily] = useState<Sauce['family'] | 'all'>('all');

  const allHubs = useMemo(() => buildSauceHubs(sauces), []);

  const filteredHubs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allHubs
      .map((hub) => ({
        ...hub,
        recipes: hub.recipes.filter((s) => sauceMatchesLandingFilters(s, q, family)),
      }))
      .filter((hub) => hub.recipes.length > 0);
  }, [allHubs, search, family]);

  return (
    <div className="min-h-screen print:hidden app-print-root" style={{ background: PAGE_BG }}>
      <PageHelmet
        title="Sauce Sensei — Interactive sauce recipes & balance"
        description="The ten sauces you actually need — pan sauce, gravy, cream, tomato, and more. Live flavor wheel, guardrails, and long-form articles — each with its own URL."
        path="/"
      />
      <header className="text-white shadow-lg" style={{ background: HEADER_GRADIENT }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                {'\u{1F958}'}
              </span>
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Sauce Sensei
                </h1>
                <p className="text-amber-100/95 text-sm max-w-xl">
                  Everything sauce — interactive builds, balance guardrails, science articles, and per-recipe guides (each
                  with its own link for sharing and indexing).
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 shrink-0" />
                <span className="leading-snug">Cook meat, build flavor, finish strong.</span>
              </div>
              <Link
                to="/articles"
                className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-bold px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30"
              >
                <BookOpen className="w-4 h-4" />
                Article library
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center mb-10 print:hidden px-4">
          <img
            src="/sauce-balance-wheel.png"
            alt="Sauce balance wheel: acid at top, sweet at bottom, fat at right, salt at left"
            className="w-[min(420px,94vw)] sm:w-[min(480px,92vw)] max-w-[520px] h-auto rounded-xl shadow-lg border border-amber-200/70 bg-white"
            onError={(e) => {
              const el = e.currentTarget;
              if (!el.dataset.fallback) {
                el.dataset.fallback = '1';
                el.src = '/sauce-balance-wheel.svg';
              }
            }}
          />
          <p className="mt-3 text-center text-sm text-gray-600 max-w-lg leading-relaxed">
            How the balance model is laid out. Open any sauce card for the live wheel that tracks your recipe.
          </p>
          <p className="mt-2 text-center text-sm text-violet-900/90">
            <Link to="/articles" className="font-semibold text-violet-800 underline decoration-violet-300">
              Browse all articles
            </Link>{' '}
            — sauce science long-reads and recipe guides with SenseiFood companions.
          </p>
        </div>

        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Sauce families
          </h2>
          <p className="text-sm text-gray-600">
            Each card is a sauce family (pan, gravy, cream, tomato, vinaigrette, mayo, reduction, herb, soy, cheese).
            Open a hub to work a recipe; when a hub lists several builds, use the recipe tabs in the header to switch.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2 shadow-sm max-w-xl mx-auto">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sauces, uses, tags..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
              aria-label="Search sauces"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setFamily('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                family === 'all'
                  ? 'text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-800/30'
              }`}
              style={family === 'all' ? { background: BTN_GRADIENT } : undefined}
            >
              All
            </button>
            {(Object.keys(SAUCE_FAMILIES) as Sauce['family'][]).map((f) => {
              const cfg = SAUCE_FAMILIES[f];
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFamily(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    family === f
                      ? 'text-white shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-800/30'
                  }`}
                  style={family === f ? { background: BTN_GRADIENT } : undefined}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredHubs.length === 0 ? (
          <p className="text-center text-gray-500 py-16 text-sm">
            No sauce families match that search. Try a shorter term or reset filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHubs.map((hub) => (
              <SauceHubCard
                key={hub.hubKey}
                hub={hub}
                onOpen={() => navigate(`/sauce/${hub.recipes[0].id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 pb-8 px-4">
        Sauce Sensei — a practical sauce playbook. Built in the spirit of CakeSensei.
      </footer>
    </div>
  );
}

function ArticlesLibraryPage() {
  const navigate = useNavigate();
  const scienceArticles = useMemo(
    () => LIBRARY_ARTICLES.filter((a) => (a.kind ?? 'science') === 'science'),
    [],
  );
  const recipeGuides = useMemo(() => LIBRARY_ARTICLES.filter((a) => a.kind === 'recipe'), []);

  return (
    <div className="min-h-screen print:hidden app-print-root" style={{ background: PAGE_BG }}>
      <PageHelmet
        title="Articles · Sauce Sensei"
        description="Sauce science long-reads and per-recipe guides — each with its own URL for sharing, indexing, and GA4."
        path="/articles"
      />
      <header className="text-white shadow-lg" style={{ background: HEADER_GRADIENT }}>
        <div className="container mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span className="text-white/40">|</span>
            <h1 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              Article library
            </h1>
          </div>
          <p className="text-xs text-amber-100/95 max-w-md">
            Science deep-dives and recipe guides — same layout, SenseiFood funnel on every page.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
        <section className="rounded-2xl border border-violet-200 bg-white/95 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-violet-950 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Sauce science
          </h2>
          <p className="text-sm text-violet-900/90 mb-4 max-w-2xl">
            Long-form articles (600+ words each) on temperature, emulsions, reduction, and more — paired with SenseiFood
            URLs.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {scienceArticles.map((a) => (
              <li key={a.slug}>
                <button
                  type="button"
                  onClick={() => navigate(`/article/${a.slug}`)}
                  className="w-full text-left rounded-xl border border-violet-100 bg-violet-50/60 hover:bg-violet-100/80 px-4 py-3 transition-colors"
                >
                  <p className="text-sm font-bold text-violet-950">{a.title}</p>
                  <p className="text-xs text-violet-900/85 mt-1 leading-snug">{a.subtitle}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-white/95 p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-rose-950 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Recipe guides
          </h2>
          <p className="text-sm text-rose-900/90 mb-4 max-w-2xl">
            One guide per SenseiFood-linked variant — same article layout, funnel to the interactive builder and to
            SenseiFood for indexing.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {recipeGuides.map((a) => (
              <li key={a.slug}>
                <button
                  type="button"
                  onClick={() => navigate(`/article/${a.slug}`)}
                  className="w-full text-left rounded-xl border border-rose-100 bg-rose-50/60 hover:bg-rose-100/80 px-4 py-3 transition-colors"
                >
                  <p className="text-sm font-bold text-rose-950">{a.title}</p>
                  <p className="text-xs text-rose-900/85 mt-1 leading-snug">{a.subtitle}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 pb-8 px-4">
        Sauce Sensei — a practical sauce playbook. Built in the spirit of CakeSensei.
      </footer>
    </div>
  );
}

function ArticleRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = slug ? getLibraryArticle(slug) : undefined;
  if (!article) return <Navigate to="/articles" replace />;
  return <ArticleView article={article} onBack={() => navigate('/articles')} />;
}

function SauceDetailRoute() {
  const { sauceId } = useParams();
  const navigate = useNavigate();
  const active = useMemo(
    () => (sauceId ? (sauces.find((s) => s.id === sauceId) ?? null) : null),
    [sauceId],
  );
  if (!active) return <Navigate to="/" replace />;
  const hubRecipeListForDetail = useMemo(() => recipesInSameHub(active.id), [active.id]);

  return (
    <>
      <PageHelmet
        title={`${active.name} · Sauce Sensei`}
        description={active.subtitle}
        path={`/sauce/${active.id}`}
      />
      <SauceDetail
        sauce={active}
        hubRecipes={hubRecipeListForDetail.length > 1 ? hubRecipeListForDetail : undefined}
        onSelectHubRecipe={hubRecipeListForDetail.length > 1 ? (id) => navigate(`/sauce/${id}`) : undefined}
        onBack={() => navigate('/')}
        onPrint={() => window.print()}
        onOpenScienceLibrary={() => navigate('/articles')}
        recipeArticlePath={active.senseiFoodSlug ? `/article/${active.senseiFoodSlug}` : undefined}
      />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RouteAnalytics />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesLibraryPage />} />
          <Route path="/article/:slug" element={<ArticleRoute />} />
          <Route path="/sauce/:sauceId" element={<SauceDetailRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
