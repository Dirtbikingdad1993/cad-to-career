# CAD to Career — Base44 site source

This folder contains the separate Base44-hosted version of CAD to Career, added on November 13, 2026 without replacing the existing root CAD to Career/Supabase code.

**Live site:** https://cad-to-career-a71f3b30.base44.app  
**Base44 app ID:** `6af6b3315b6e54dda71f3b30`  
**Source layout:** Vite/React frontend in `src/`; Base44 backend in `base44/`; unit tests in `tests/`.

## Run checks

```bash
cd apps/base44-site
npm ci
npm test
npm run lint
npm run build
```

`npm run typecheck` currently has outstanding typing issues in preexisting UI/auth components; a passing production build does not imply that typechecking is clean.

The browser smoke tests in `tests/browser.smoke.mjs` require Playwright and its Chromium dependencies; they target the live site by default. Do not run the live-site test as part of offline/local CI without configuring a suitable browser environment.

## Publishing

The live Base44 app is **not automatically synced** to this GitHub folder. Commit updates here only after deciding which implementation will be canonical; GitHub commits do not automatically deploy this Base44 snapshot. Do not copy app secrets, `.env.local`, or production student data into Git.

A portfolio submission remains unconfirmed until reviewed, and completion certificates are platform completion records, not accredited credentials.
