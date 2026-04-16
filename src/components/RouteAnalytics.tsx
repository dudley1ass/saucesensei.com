import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gaPageView } from '../analytics';

/** Scroll restoration + GA4 `page_path` on SPA navigations. */
export function RouteAnalytics() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    gaPageView(path);
  }, [location]);

  return null;
}
