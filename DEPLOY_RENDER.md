# Deploy Sauce Sensei (GitHub + Render)

## 1) Push to GitHub

```bash
git add .
git commit -m "Prepare Sauce Sensei for Render deploy"
git push origin <your-branch>
```

## 2) Create Render service

1. In Render, click **New +** -> **Blueprint** (recommended) or **Static Site**.
2. Connect your GitHub repo (`saucesensei`).
3. If using Blueprint, Render will read `render.yaml` automatically.

Expected settings:
- **Environment**: Static Site
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`

## 3) Environment variable

Add this in Render (optional but recommended):
- `VITE_SENSEIFOOD_SITE_URL=https://senseifood.com`

## 4) Custom domain

1. In Render service settings, add domain: `saucesensei.com`
2. Add `www.saucesensei.com` and redirect it to apex (or vice versa)
3. Update DNS records at your domain host per Render instructions.

## 5) Verify after deploy

- `https://saucesensei.com/` loads.
- Hard refresh on deep links works (SPA rewrite via `render.yaml`).
- `https://saucesensei.com/robots.txt` returns OK.
- `https://saucesensei.com/sitemap.xml` returns OK.

## Notes

- `render.yaml` is already configured with an SPA rewrite rule.
- `public/robots.txt` and `public/sitemap.xml` are included for crawler discovery.
