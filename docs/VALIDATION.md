# Validation notes

Final executed checks on 2026-10-25: `npm ci`, TypeScript, ESLint (zero warnings), production build, 4 node:test cases, and 12 Playwright tests passed. Browser tests cover 18 pages on each of two viewport sizes. The production dependency audit reported zero vulnerabilities. Commands are in README.

- Dependency installation uses the committed npm lockfile (`npm ci`).
- TypeScript, ESLint, production build and node:test are executed in the cloud machine.
- Browser suite covers all 18 public routes at desktop and iPhone 13 viewport sizes; it checks rendering, images, horizontal overflow, metadata and interactive scenarios.
- Browser testing here uses Chromium from `@sparticuz/chromium` 153.0.0 (bundled npm artifact with lockfile integrity). The standard Playwright download endpoint was denied by the environment's egress policy; TLS/checksum verification was not disabled. Runtime browser files are extracted into `/tmp` from the retained `/workspace/browser-tools` package.
- The positive email path is tested with synthetic `.invalid` addresses and a mocked Resend response. No real email was sent; provider credentials and recipient are absent.
- Live Redis connectivity, deliverability, public hosting, field Core Web Vitals, legal adequacy and professional architectural accuracy are not validated by these tests.
- `SITE_PUBLISHED=false` deliberately prevents indexing. A published sitemap must be checked again after setting the real site URL and enabling indexing.
- CI workflow is supplied for GitHub Actions; it has not executed on GitHub as part of this task.
- ESLint 9 is used for compatibility with the React, accessibility and import plugins bundled by eslint-config-next; ESLint 10 currently conflicts with their peer ranges.

VERTEX I.S.O update: approved brand in SVG lockups, favicon, header, mobile menu, footer and SEO titles. Added audit of internal links and anchors, brand assets and metadata across all public pages. Re-ran TypeScript, lint, node:test, production build and all 12 desktop/mobile browser tests successfully. Polish UI copy reviewed; no customer testimonials, completed work, certifications, prices or guarantees were invented.
