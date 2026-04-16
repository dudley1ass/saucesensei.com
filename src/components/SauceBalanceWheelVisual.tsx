import { useId } from 'react';
import type { SauceWheelTarget } from '../data/sauces';
import type { SauceWheelTexture } from '../utils/sauceBalance';

/**
 * Interactive flavor wheel: Acid (top), Sweet (bottom), Fat (right), Salt (left).
 * Dot position uses perceived dx/dy from computeSauceWheelPosition:
 *   +dx → fat, -dx → salt, +dy → acid, -dy → sweet
 */

/** Max distance (px) from center the live dot and style target share (printed diagram scale). */
const DOT_MAX_RADIUS_PX = 108;
/** Style target band: radius as fraction of max pull (sauce *type* should land inside). */
const STYLE_TARGET_RADIUS_FR = 0.15;
/** Product diagram half-ranges: fat (+) … salt (−), acid (+) … sweet (−). */
const DIAGRAM_FAT_SALT_RADIUS = 3;
const DIAGRAM_ACID_SWEET_RADIUS = 4;

/** Map diagram grid (same numbers as `wheelTarget` in `sauces.ts`) → SVG; used for BOTH teal band and orange dot. */
function diagramGridToSvg(gx: number, gy: number): { cx: number; cy: number } {
  const maxR = DOT_MAX_RADIUS_PX;
  let x = (gx / DIAGRAM_FAT_SALT_RADIUS) * maxR;
  let y = -(gy / DIAGRAM_ACID_SWEET_RADIUS) * maxR;
  const len = Math.hypot(x, y);
  if (len > maxR && len > 0) {
    x = (x / len) * maxR;
    y = (y / len) * maxR;
  }
  return { cx: 200 + x, cy: 200 + y };
}

export type SauceBalanceWheelVisualProps = {
  dx: number;
  dy: number;
  pctSalt: number;
  pctFat: number;
  pctAcid: number;
  pctSweet: number;
  /** 0–100 umami pressure — drives inner glow (not a wedge). */
  umamiScore?: number;
  /** Previous frame (perceived) for motion hint */
  prevDx?: number;
  prevDy?: number;
  /** When true, shows the reference graphic beside the SVG (landing layout). */
  showReferenceImage?: boolean;
  /** Smaller SVG for tight layouts */
  compact?: boolean;
  /** Less chrome when embedded next to recipe */
  dense?: boolean;
  /** Hide bottom Salt/Fat/Acid/Sweet % strip when metrics live in a side panel */
  hideQuadrantStrip?: boolean;
  /** Ideal region for this sauce *type* on the wheel (center from data; band size fixed in UI). */
  sauceTarget?: SauceWheelTarget | null;
  /** Body read — dot ring color / weight / dash (recipe view). */
  texture?: SauceWheelTexture;
  title?: string;
  caption?: string;
};

function umamiGlowStops(score: number): { inner: string; outer: string; tier: 'low' | 'mid' | 'high' } {
  if (score < 30) return { inner: '#cbd5e1', outer: '#64748b', tier: 'low' };
  if (score < 60) return { inner: '#fde68a', outer: '#d97706', tier: 'mid' };
  return { inner: '#f0abfc', outer: '#a21caf', tier: 'high' };
}

function textureDotRing(texture: SauceWheelTexture | undefined): {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
} {
  switch (texture) {
    case 'thin':
      return { stroke: '#38bdf8', strokeWidth: 2, strokeDasharray: '3 4' };
    case 'medium-thin':
      return { stroke: '#a78bfa', strokeWidth: 2.5, strokeDasharray: '5 3' };
    case 'medium':
      return { stroke: '#fde047', strokeWidth: 3 };
    case 'thick':
      return { stroke: '#fb923c', strokeWidth: 3.5, strokeDasharray: '2 1' };
    default:
      return { stroke: '#ffffff', strokeWidth: 3 };
  }
}

function describeBias(dx: number, dy: number): string {
  const parts: string[] = [];
  // `dx`/`dy` are diagram-grid units (±3 / ±4), same as `wheelTarget` in data.
  if (dx > 0.2) parts.push('pulled toward Fat (right)');
  else if (dx < -0.2) parts.push('pulled toward Salt (left)');
  if (dy > 0.2) parts.push('pulled toward Acid (top)');
  else if (dy < -0.2) parts.push('pulled toward Sweet (bottom)');
  if (parts.length === 0) return 'Near the center on this model — reads fairly balanced.';
  return parts.join(' · ');
}

export function SauceBalanceWheelVisual({
  dx,
  dy,
  pctSalt,
  pctFat,
  pctAcid,
  pctSweet,
  umamiScore = 0,
  prevDx,
  prevDy,
  showReferenceImage = false,
  compact = false,
  dense = false,
  hideQuadrantStrip = false,
  sauceTarget = null,
  texture,
  title = 'Sauce balance wheel',
  caption,
}: SauceBalanceWheelVisualProps) {
  const clipUid = useId().replace(/:/g, '');
  const arrowId = useId().replace(/:/g, '');
  const umamiGradId = `umami-grad-${clipUid}`;
  const { cx, cy } = diagramGridToSvg(dx, dy);
  const prev =
    prevDx !== undefined && prevDy !== undefined ? diagramGridToSvg(prevDx, prevDy) : null;
  const bias = describeBias(dx, dy);
  const vb = 400;
  const h = compact ? 260 : 400;
  const motion =
    prev && (Math.abs(prev.cx - cx) > 2 || Math.abs(prev.cy - cy) > 2) ? (
      <g aria-hidden>
        <line
          x1={prev.cx}
          y1={prev.cy}
          x2={cx}
          y2={cy}
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeOpacity="0.55"
          strokeDasharray="6 4"
          markerEnd={`url(#ah-${arrowId})`}
        />
      </g>
    ) : null;

  const umamiGlowR = 18 + Math.min(34, (umamiScore / 100) * 34);
  const umamiStops = umamiGlowStops(umamiScore);
  const glowOpacity = Math.min(0.92, 0.12 + (umamiScore / 100) * 0.78);
  const ring = textureDotRing(texture);

  /** ~15% of max pull as band radius; center from diagram grid in `sauces.ts`. */
  const targetEllipse =
    sauceTarget != null
      ? (() => {
          const { cx, cy } = diagramGridToSvg(sauceTarget.dx, sauceTarget.dy);
          const baseR = DOT_MAX_RADIUS_PX * STYLE_TARGET_RADIUS_FR;
          const rxN = Math.max(1e-6, sauceTarget.rx);
          const ryN = Math.max(1e-6, sauceTarget.ry);
          const geomMean = Math.sqrt(rxN * ryN);
          const rx = baseR * (rxN / geomMean);
          const ry = baseR * (ryN / geomMean);
          return { cx, cy, rx, ry };
        })()
      : null;

  const axisLabelClass = compact
    ? 'text-[10px] font-extrabold tracking-widest uppercase'
    : 'text-xs sm:text-sm font-extrabold tracking-widest uppercase';

  const wheelSvg = (
    <div className={`relative mx-auto ${compact ? 'max-w-[260px]' : 'max-w-md'}`}>
      <div className={compact ? 'relative pt-5 pb-5 pl-8 pr-8' : 'relative pt-7 pb-7 pl-10 pr-10'}>
        <span
          className={`pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-red-200 drop-shadow ${axisLabelClass}`}
        >
          Acid
        </span>
        <span
          className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-amber-200 drop-shadow ${axisLabelClass}`}
        >
          Fat
        </span>
        <span
          className={`pointer-events-none absolute left-1/2 bottom-0 translate-y-0.5 -translate-x-1/2 text-emerald-200 drop-shadow ${axisLabelClass}`}
        >
          Sweet
        </span>
        <span
          className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-sky-200 drop-shadow ${axisLabelClass}`}
        >
          Salt
        </span>
        <svg viewBox={`0 0 ${vb} ${vb}`} className="w-full h-auto drop-shadow-xl">
        <defs>
          <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </radialGradient>
          <radialGradient id="rimGlow" cx="50%" cy="50%" r="52%">
            <stop offset="58%" stopColor="#1e293b" stopOpacity="0" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.45" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
          <filter id="softBlend" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <radialGradient id={umamiGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={umamiStops.inner} stopOpacity="0.75" />
            <stop offset="55%" stopColor={umamiStops.outer} stopOpacity="0.35" />
            <stop offset="100%" stopColor={umamiStops.outer} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`wheel-clip-${clipUid}`}>
            <circle cx={200} cy={200} r={172} />
          </clipPath>
          <marker id={`ah-${arrowId}`} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" opacity="0.85" />
          </marker>
        </defs>

        <circle cx={200} cy={200} r={188} fill="#0f172a" opacity="0.95" />
        <circle cx={200} cy={200} r={172} fill="#111827" />

        <g clipPath={`url(#wheel-clip-${clipUid})`} filter="url(#softBlend)" opacity="0.92">
          <circle cx={200} cy={76} r={108} fill="#ef4444" />
          <circle cx={322} cy={200} r={108} fill="#f59e0b" />
          <circle cx={200} cy={324} r={108} fill="#22c55e" />
          <circle cx={78} cy={200} r={108} fill="#3b82f6" />
        </g>
        <circle cx={200} cy={200} r={172} fill="url(#rimGlow)" />

        {!sauceTarget && (
          <ellipse
            cx={200}
            cy={200}
            rx={54}
            ry={40}
            fill="none"
            stroke="#f8fafc"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
        )}

        <circle
          cx={200}
          cy={200}
          r={umamiGlowR}
          fill={`url(#${umamiGradId})`}
          opacity={glowOpacity}
        />

        <circle cx={200} cy={200} r={56} fill="url(#wheelCenter)" filter="url(#softShadow)" stroke="#334155" strokeWidth="1.5" opacity="0.92" />

        <line x1={200} y1={200} x2={200} y2={48} stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <line x1={200} y1={200} x2={352} y2={200} stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <line x1={200} y1={200} x2={200} y2={352} stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <line x1={200} y1={200} x2={48} y2={200} stroke="white" strokeOpacity="0.12" strokeWidth="1" />

        {targetEllipse && (
          <ellipse
            clipPath={`url(#wheel-clip-${clipUid})`}
            cx={targetEllipse.cx}
            cy={targetEllipse.cy}
            rx={targetEllipse.rx}
            ry={targetEllipse.ry}
            fill="none"
            stroke="#5eead4"
            strokeWidth="3.5"
            strokeOpacity="0.9"
            strokeDasharray="8 5"
          />
        )}

        {motion}

        {texture !== undefined ? (
          <circle
            cx={cx}
            cy={cy}
            r={13.5}
            fill="none"
            stroke={ring.stroke}
            strokeWidth={ring.strokeWidth}
            strokeDasharray={ring.strokeDasharray}
            opacity={0.92}
          />
        ) : null}
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill="#fbbf24"
          stroke="#fff"
          strokeWidth={texture !== undefined ? 1.5 : 3}
          className="drop-shadow-lg"
        />
        <circle cx={cx} cy={cy} r={4} fill="#f97316" opacity="0.95" />
        </svg>
      </div>
    </div>
  );

  return (
    <section className="rounded-2xl overflow-hidden border-2 border-indigo-900/40 bg-slate-950 shadow-xl">
      <div
        className={`bg-gradient-to-r from-indigo-950 via-slate-900 to-rose-950 border-b border-white/10 ${
          dense ? 'px-3 py-2' : 'px-4 py-3'
        }`}
      >
        <h2 className="font-bold text-amber-100 tracking-wide uppercase text-sm">{title}</h2>
        {!dense && (
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {caption ??
              'Orange dot = perceived balance (not raw grams). Axes: Acid ↑ Sweet ↓ Fat → Salt ←. Umami reads as center glow.'}
          </p>
        )}
        <p className="font-semibold text-amber-200/95 text-sm mt-2">{bias}</p>
      </div>

      <div
        className={`grid gap-3 p-3 bg-slate-900/95 ${showReferenceImage ? 'md:grid-cols-2' : 'grid-cols-1'}`}
        style={{ minHeight: compact ? undefined : h }}
      >
        {showReferenceImage && (
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Reference graphic</p>
            <img
              src="/sauce-balance-wheel.svg"
              alt="Sauce balance wheel reference (Acid top, Sweet bottom, Fat right, Salt left)"
              className="w-full rounded-xl border border-white/10 shadow-lg"
            />
          </div>
        )}
        <div className="flex flex-col justify-center">
          {!showReferenceImage && (
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Live (perceived)</p>
          )}
          {showReferenceImage && (
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 md:hidden">Reference</p>
          )}
          <div role="img" aria-label={`Flavor wheel. Acid top, sweet bottom, fat right, salt left. ${bias}`}>
            {wheelSvg}
          </div>
          {(texture !== undefined || targetEllipse) && (
            <div className="mt-2 pt-2 border-t border-white/10 px-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-500">Umami (glow)</span>
                <span className="flex items-center gap-2 text-slate-300">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-1 ring-white/30"
                    style={{ backgroundColor: umamiStops.inner }}
                    title={`${umamiStops.tier} band`}
                  />
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-1 ring-white/30"
                    style={{ backgroundColor: umamiStops.outer }}
                    title="Outer falloff"
                  />
                  <span className="text-slate-400 font-medium tabular-nums">{umamiScore}</span>
                  <span className="text-slate-500">({umamiStops.tier})</span>
                </span>
              </div>
              {targetEllipse ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Style target</span>
                  <span className="flex items-center gap-2 text-slate-300">
                    <svg width="28" height="14" viewBox="0 0 28 14" className="shrink-0" aria-hidden>
                      <ellipse
                        cx="14"
                        cy="7"
                        rx="9"
                        ry="7"
                        fill="none"
                        stroke="#5eead4"
                        strokeWidth="1.5"
                        strokeOpacity="0.85"
                        strokeDasharray="3 2"
                      />
                    </svg>
                    Where this sauce type should sit
                  </span>
                </div>
              ) : null}
              {texture !== undefined ? (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Texture (dot ring)</span>
                  <span className="flex items-center gap-2 text-slate-300 capitalize">
                    <svg width="28" height="14" viewBox="0 0 28 14" className="shrink-0" aria-hidden>
                      <circle
                        cx="14"
                        cy="7"
                        r="5"
                        fill="#fbbf24"
                        stroke={ring.stroke}
                        strokeWidth={Math.min(3.5, ring.strokeWidth)}
                        strokeDasharray={ring.strokeDasharray}
                      />
                    </svg>
                    {texture.replace(/-/g, ' ')}
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {!hideQuadrantStrip && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 py-3 text-xs font-semibold bg-slate-950 text-slate-100 border-t border-white/10">
          <div className="rounded-lg bg-blue-900/55 px-2 py-1.5 border border-blue-400/35">
            Salt {pctSalt.toFixed(0)}%
          </div>
          <div className="rounded-lg bg-amber-900/55 px-2 py-1.5 border border-amber-400/35">
            Fat {pctFat.toFixed(0)}%
          </div>
          <div className="rounded-lg bg-red-900/55 px-2 py-1.5 border border-red-400/35">
            Acid {pctAcid.toFixed(0)}%
          </div>
          <div className="rounded-lg bg-emerald-900/55 px-2 py-1.5 border border-emerald-400/35">
            Sweet {pctSweet.toFixed(0)}%
          </div>
        </div>
      )}
    </section>
  );
}
