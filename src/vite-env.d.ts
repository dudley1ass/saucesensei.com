/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENSEIFOOD_SITE_URL?: string;
  /** Google Analytics 4 measurement ID (e.g. G-XXXXXXXXXX) — enables gtag + SPA page_path. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
