let gaInitialized = false;

/**
 * GA4: set `VITE_GA_MEASUREMENT_ID` (e.g. G-XXXXXXXXXX). Page views are sent on SPA route changes.
 */
export function initGoogleAnalytics(): void {
  if (gaInitialized) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof document === 'undefined') return;
  gaInitialized = true;

  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  w.gtag('js', new Date());
  w.gtag('config', id, { send_page_view: false });
}

export function gaPageView(path: string): void {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (!id || !w.gtag) return;
  w.gtag('config', id, { page_path: path });
}
