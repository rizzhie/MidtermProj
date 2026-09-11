# Angel's Cakes and Pastries — Ordering System (Front End)

React + Vite + Tailwind CSS front end for the Angel's Cakes and Pastries ordering system. The
storefront (menu, cart, checkout) and a small `/admin` dashboard are both backed by the
[Laravel API](../backend) — there's no more hardcoded product data.

## Stack
- React + Vite
- Tailwind CSS v4 (CSS-first `@theme` tokens, see `src/index.css`)
- React Router (`/`, `/about`, `/menu`, `/cart`, `/checkout`, `/admin/*`)
- `@/` alias paths (see `vite.config.js` + `jsconfig.json`)
- `cn()` utility (clsx + tailwind-merge) in `src/lib/utils.js`
- `src/lib/api.js` — fetch wrapper around the Laravel API (token storage, error handling)

## Folder structure
```
src/
  components/
    common/      # Layout, Navbar, Footer, AdminLayout, RequireAdmin
    ui/          # Button, Card, Input, Modal, QuantityStepper — style primitives
    features/    # Page-specific Section components (home, menu, cart, checkout)
  context/       # CartContext (localStorage cart) + AdminAuthContext (Sanctum token)
  data/          # siteContent.js — site copy, shipping options, payment methods
  lib/           # utils.js, api.js
  pages/         # One file per storefront route, plus pages/admin/*
```

Note: `src/data/products.js` was removed — the menu/categories now come from
`GET /api/products` and `GET /api/categories`.

## Local development

1. Get the [backend](../backend) running first (see its README) — it defaults to
   `http://localhost:8000/api` locally, or `http://localhost:3001/api` under Docker.
2. ```bash
   cp .env.example .env   # set VITE_API_URL if the API isn't on :8000
   npm install
   npm run dev
   ```

## Admin dashboard

Visit `/admin/login` and sign in with the seeded admin account
(`admin@angelsbakery.test` / `password`, see the backend README) to manage:

- **Products** — `/admin/products` (create, edit, delete)
- **Categories** — `/admin/categories` (create, edit, delete)
- **Orders** — `/admin/orders` (view items, update fulfillment status, delete)

These write actions require a Sanctum bearer token; `AdminAuthContext` stores it in
`localStorage` and attaches it to requests via `src/lib/api.js`.

## Editing content
- Menu (products/categories): via the `/admin` dashboard, or directly in the database.
- Site copy (tagline, about text, contact info, shipping/payment options): `src/data/siteContent.js`

## Deploying to Vercel
1. Push this project to a GitHub repo.
2. Import the repo in Vercel.
3. Framework preset: Vite. Build command `npm run build`, output directory `dist` (Vercel usually auto-detects this).
4. Set `VITE_API_URL` to your deployed API's URL in the Vercel project's environment variables.
5. `vercel.json` already includes the SPA rewrite so client-side routing works on refresh.
