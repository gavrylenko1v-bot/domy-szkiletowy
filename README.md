# VERTEX I.S.O

Polish timber-frame house catalogue. Existing Next.js 16 App Router repository and existing Vercel address are retained: https://domy-szkiletowy.vercel.app.

## Development and checks

Node.js 24 LTS, npm 11. Use the committed lockfile.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

E2E uses a production build. Set `CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` when a system Chromium is installed; otherwise use Playwright's normal browser setup. The test web server sets a local API Origin; generated canonical URLs default to the retained production address. `NEXT_PUBLIC_SITE_URL` overrides that address at build time.

## Structure

- `src/content/site.ts`: owner-supplied email, NIP and Wrocław service area; legal name, address and phone remain unconfirmed.
- `src/content/houses.ts`: 10 published concepts. Existing slugs are preserved, including when the model name or dimensions change.
- `src/content/floor-plans.ts`: one source for scaled clear room dimensions, doors, windows, furniture, stair openings and area arithmetic.
- `scripts/plan-geometry.ts`: deterministic SVG renderer. `npm run prepare:content` refreshes plans and JSON passports; WebP assets are retained.
- `src/content/house-details.ts`: room schedule derived from that same geometry, not an independent budget.
- `public/images/houses/<slug>/plan.svg`: all floors; `plan-0.svg` and `plan-1.svg`: individual levels.
- `docs/passports/`: geometry, media list, prompts, architectural assumptions.
- `docs/media-manifest.json`: active image/plan inventory with SHA-256 hashes.

Home includes projects, benefits, technology, process, packages, concept gallery, FAQ and enquiry. Catalogue filters total net floor area, rooms, floors, roof, terrace and style. Galleries and vector plans have keyboard-accessible full-screen dialogs. `/realizacje` intentionally returns 404: no completed buildings have been verified.

## Areas and architecture

The owner clarified **70 m² maximum total usable area across all floors**. All concepts now stay below 70 m² even when adding their entire clear floor areas before deductions for attic slopes. Ground-floor footprint is displayed separately. Do not confuse the model number or footprint with usable area.

The website reports **net floor area**, calculated from clear room rectangles, with exterior/partition walls excluded and a 4 m² upper stair opening excluded. It does not claim a statutory usable-area measurement. Attic height, roof slopes, stairs, structural design, services, daylight and building regulations require professional verification. The assumptions are 280 mm external walls and 120 mm partitions, not a construction specification.

Original AI visualizations describe architectural character. They are not CAD-derived and do not certify exact alignment of every opening with the new plans. OPTIMA 70 has a flat-roof proposal and uses only its two new flat-roof views, keeping the older pitched-roof pictures out of that gallery. Other galleries retain their original 9 concept renders. Room plans are expressly labelled concepts, not construction documentation.

## Enquiries

Server endpoint `/api/leads` validates input and project IDs, checks Origin, caps body size, rejects a honeypot, rate limits using Upstash and uses Resend idempotency keys. A success message is returned only after the email provider acknowledges acceptance; it does not guarantee inbox delivery. Personal data is not logged by the application.

Copy `.env.example` to `.env.local` for development or set variables in the **existing** Vercel project. Never commit real keys.

- `NEXT_PUBLIC_SITE_URL=https://domy-szkiletowy.vercel.app`
- `RESEND_API_KEY`: server key from Resend.
- `LEADS_FROM_EMAIL`: sender on a domain verified in Resend. A Gmail contact address does not establish a verified sender domain.
- `LEADS_TO_EMAIL=vertex7706@gmail.com`: confirmed contact address; set this only in hosting configuration.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: production shared rate limiter.
- `TRUST_PROXY=true` only if the hosting proxy overwrites forwarded IP headers and clients cannot reach the server directly.
- `SITE_PUBLISHED=true`: enables indexing and populated sitemap. The existing safe default remains noindex while legal/architectural content is being finalized.

Without mail/Redis, production returns 503 and displays an honest failure. The confirmed contact email is available as a direct `mailto:` link. Positive provider behavior is tested with a mock; no real email delivery has been verified.

## Existing Vercel deployment

Push the reviewed commits to the linked GitHub `main` branch. The existing integration updates the existing Vercel project and address; do not create a second project. Check the Vercel status for that exact commit. If necessary, open Vercel → existing `domy-szkiletowy` project → Settings → Environment Variables, add the values above, then Deployments → latest deployment → Redeploy.

Before enabling lead intake/indexing: complete legal entity/address, correct the owner's supplied NIP checksum, finish privacy retention/provider terms and obtain architectural coordination. NIP `8961975715` is stored as explicitly reconfirmed by the owner; it fails the Polish checksum and has not been presented as registry-verified.

See [current architectural assumptions](docs/ARCHITECTURE.md), [brand](docs/BRAND.md), [validation](docs/VALIDATION.md) and [release audit](docs/RELEASE-2026-10-25.md).
