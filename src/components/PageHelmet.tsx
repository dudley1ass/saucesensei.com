import { Helmet } from 'react-helmet-async';

export function PageHelmet({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  /** Path for canonical, e.g. `/articles` (default: current `location.pathname`). */
  path?: string;
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const canonical = `${origin}${pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
