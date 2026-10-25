# Validation — 25 October 2026, current release

- npm lockfile install completed on Node 24.19.0.
- TypeScript: passed. ESLint: passed. `git diff --check`: passed.
- Next.js production build: passed, 25 generated route/metadata entries. 18 public content pages were visited individually.
- Node tests: **5 passed**, covering catalogue, area arithmetic <=70 m² across floors, fixtures, furnished room/door intersections, stair alignment, input validation, rate limits and provider acknowledgement.
- Playwright with system Chromium: **15 passed, 1 intentional skip**. The duplicate mobile width sweep is skipped because desktop Chromium tests every requested width. 360, 390, 430, 768, 1024, 1440 and 1920 px were checked for overflow and readable text on home, catalogue, representative projects and contact.
- All 18 public routes were checked on desktop/mobile for unique metadata, H1, valid local images, internal links and anchors. Interaction tests cover area/rooms/roof/terrace/floor filtering, sort/reset/empty state, form error without fake success, gallery navigation/full screen, floor-plan tabs/zoom/focus restoration, FAQ, mobile navigation and 404s.
- axe-core: **37 runs, 0 violations** for selected WCAG 2 A/AA and 2.1 AA rules: 18 pages at 390 and 1440 px, plus the plan dialog. Automated checks do not certify full accessibility.
- `SITE_PUBLISHED=true` SEO configuration: 18 sitemap entries with the retained Vercel origin; robots references the correct sitemap. Default draft/noindex behavior is preserved.
- Production API success is mocked with synthetic addresses. Live email/Redis connectivity and inbox deliverability are not verified because provider configuration is absent. No real email was sent.
- Field Core Web Vitals, real Safari/iPhone behavior, final legal completeness, building regulations and architectural cross-view coordination are not established by these checks.

Existing GitHub main had a successful Vercel deployment status before this release. Exact release deployment verification is reported in the task handoff and GitHub commit checks. The Vercel project/domain were not replaced.
