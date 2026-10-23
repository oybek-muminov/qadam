# Qadam — public introduction

A separate local project for the public Uzbek landing page. This is the page a new visitor sees before entering an account or choosing a learning path. The project name is Qadam.

## Run locally

Requires Node.js 24 and npm. From this project directory:

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run preview
```

Preview: **http://127.0.0.1:1435/**. Both preview and development commands bind only to `127.0.0.1`, use port `1435`, and fail if it is occupied. They never select another port automatically. Stop your preview with Ctrl+C. For editing, use `npm.cmd run dev` instead of the preview command.

For a Windows preview that continues after the launching terminal exits, run `powershell.exe -NoProfile -File .\scripts\start-preview.ps1` after building. It starts a hidden detached process, records its PID in `.preview.json`, and writes `.preview.stdout.log` / `.preview.stderr.log`. The loopback URL works only on the computer running this process; it cannot be shared with other devices.

## Included

- Light, responsive public landing page: platform introduction, four planned services, process explanation and footer.
- Prominent multi-subject ambition, with explicit physics-first availability wording.
- Header, hero and closing account-entry links; honest login/register preview pages with no credential fields.
- Mobile section navigation using native accessible `details`/`summary`, section links, return links and focus restoration.
- Uzbek text, local SVG art, system fonts, keyboard focus indicators, skip link and reduced-motion support. No third-party runtime requests.

## Deliberately outside this release

No cabinet, onboarding choices, lessons, materials, tests, scores, payments, authentication, accounts, data collection, persistence or backend. Services are described as planned, not available.

`src/subjects.ts` contains the initial stable physics ID and public service descriptions. Future learning content, roadmaps and results should be scoped by subject ID. No speculative multi-subject infrastructure is built here.

## Files

- `src/app.ts`: public page, account-preview routes and navigation.
- `src/subjects.ts`: typed public content and account route parser.
- `src/style.css`, `src/tokens.css`: responsive layout and design tokens.
- `tests/entry.test.ts`: DOM interaction and responsive CSS contract checks.
- `dist/`: generated production output.
- `.github/workflows/pages.yml`: checks, build and static Pages deployment.

## GitHub Pages

The workflow builds and publishes only `dist/` after all checks pass on `main`. Relative asset URLs also work beneath `/qadam/`; hash-based account preview routes need no server fallback. GitHub Pages must use **GitHub Actions** as its publishing source.

Only the deploy job receives `pages: write` and `id-token: write`. No repository secrets are required. Pages hosts this static frontend; real authentication and learning records will need a separate backend in a future release.

The DOM tests check responsive rules at 360/390/768/1440px, but do not render pixels. Actual browser visual review and overflow verification remain separate checks.

## Checks

```powershell
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Dependencies are development-only and locked in `package-lock.json`: TypeScript, Vite, Prettier and Happy DOM. The shipped page uses browser APIs directly.
