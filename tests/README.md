# Portfolio test suite

## Run

```sh
npm run test:types
npm run test:e2e
npm run test:report
```

`test:e2e` first checks and builds the current source, then starts a dedicated production preview at `http://127.0.0.1:4173`. It deliberately refuses to reuse an existing server so stale CSS or another checkout cannot silently pass. If the port is occupied, stop that preview from its terminal before retrying. Development previews on 432x can remain open.

One worker runs by default. Local tests use installed Google Chrome. CI uses Playwright Chromium (provision it with `npx playwright install chromium` before running). Tests never publish, send email, or log into external services.

Quick runs:

```sh
# Production HTTP/assets checks; no browser required
npm run test:contracts

# Representative mobile and desktop browser runs
npm run test:e2e -- --project=mobile --project=desktop

# Latest layout and screenshots at all 15 viewport sizes
npm run test:e2e -- tests/responsive.spec.ts

# One behavior
npm run test:e2e -- tests/contact.spec.ts --project=mobile

# Full checks including the existing Lighthouse performance audit
npm run qa
```

## Coverage

| File | Coverage |
| --- | --- |
| `contracts.spec.ts` | Production HTML, landmarks, all project image variants, crawler files, favicon and sharing image over HTTP. Runs once in the `contracts` project. |
| `portfolio.spec.ts` | Browser errors, overflow, axe WCAG checks in both themes, scroll animation and phone/caption separation, current navigation, theme metadata, menu keyboard controls, phone inspection. |
| `responsive.spec.ts` | Fifteen sizes from 320 to 2560 pixels, including landscape and breakpoint boundaries; light/dark screenshots of all five sections; clipping, alignment and controls. |
| `journeys.spec.ts` | Actual section-link clicks, work-to-contact journey, return to top, keyboard skip link, mobile menu outside-click and resize cleanup. |
| `theme.spec.ts` | OS preference, manual preference persistence, URL override, invalid URL value and blocked storage. |
| `contact.spec.ts` | Copy success, announcement reset, rejection/retry and both results of the legacy copy fallback; focus and temporary-field cleanup. |
| `content.spec.ts` | Project data and decoded images, external popup destinations, consistent Skills styling, SEO/structured data, internal/contact links, direct anchors clear of the header, no-JavaScript essentials. |

Clipboard methods are stubbed to exercise success/failure deterministically without overwriting the system clipboard. External GitHub/Drive navigations are fulfilled locally: these checks verify the destination the site opens, not third-party service availability.

Desktop-only scroll tests skip at widths up to 928px. Mobile menu tests skip above 768px. Other behavior tests run across the viewport matrix; these are viewport emulations in Chrome, not physical-device or Safari/Firefox certification.

## Reports and limits

The HTML report is in `playwright-report/`. Failures retain a trace and screenshot; responsive tests attach section screenshots in both themes. `npm run test:report` opens the report. Generated screenshots are review evidence, not approved pixel-diff baselines. Axe tests cover automated rules; they do not replace manual accessibility testing.

In the current Codex sandbox Chrome has previously terminated before loading the page (`SIGABRT`). Browser runs need a normal Mac terminal until that environment restriction is resolved. Type checking and HTTP contract tests can run independently in Codex. A successful build or contract run does not mean browser tests passed.
