# GEEKS FF Likes Store (Next.js)

This repository now hosts the GEEKS FF Likes Store as a **Next.js 15** application with **Tailwind CSS** styling and client-side interactions rebuilt in React. The legacy static HTML/CSS/JS bundle has been migrated so the project can be developed locally, exported as a fully static site, and deployed to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000). Edit files inside the `app/` directory and Tailwind styles in `app/globals.css`.

## Available scripts

| Script          | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `npm run dev`   | Starts Next.js in development mode.                                         |
| `npm run build` | Produces an optimized static build in `.next/` and exports it to `out/`.    |
| `npm run start` | Serves the production build (useful for local smoke tests).                 |
| `npm run deploy`| Builds the site and publishes the contents of `out/` to the `gh-pages` branch. |

## Deploying to GitHub Pages

1. Ensure the required environment variables are set:
   ```bash
   set GITHUB_PAGES=true
   set NEXT_PUBLIC_REPOSITORY_NAME=ff-likes-geek   # replace with the actual repository name
   ```
   These enable correct asset paths under the project subdirectory.
2. Run `npm run deploy`. The command runs `npm run build` and then pushes the static export in `out/` to the `gh-pages` branch via `gh-pages`.

If you host the project at `https://<user>.github.io/<repo>/`, update the `NEXT_PUBLIC_REPOSITORY_NAME` value accordingly before deploying.

## Project structure

- `app/`   App Router pages, layout, and Tailwind-powered UI. Includes dedicated routes:
  - `/`   Like sender dashboard and registry validator.
  - `/info`   UID profile lookup (level, ranks, XP, likes, last login).
  - `/pricing`   Like packages with multi-currency pricing.
  - `/contact`   Support & social channels.
- `public/`   Static assets served at the root of the exported site.
- `app/globals.css`   Tailwind directives plus minimal global tweaks.
- `next.config.mjs`   Configured for static export and GitHub Pages asset prefixing.
- `out/`   Generated static site after running `npm run build` (commit optional).

## Notes

- Tailwind utility classes provide the primary styling. Custom gradients and layout tweaks live alongside the Tailwind layers inside `app/globals.css`.
- Remote API calls and UID validation logic live inside their respective client components (`app/page.js`, `app/info/page.js`).
- The build pipeline relies on `next build` with `output: 'export'`, so `next export` is no longer necessary.
