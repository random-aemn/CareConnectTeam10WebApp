# CareConnect Web App

CareConnect is a responsive patient-portal demo built from the CareConnect Figma designs and the earlier Electron
prototype. It provides locally persisted appointment, medication, messaging, health-record, care-team, and preference
experiences for mobile, tablet, and desktop layouts. No data leaves the browser.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Lucide React icons
- Vitest
- React Testing Library
- ESLint

## Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer
- Windows Terminal with a PowerShell profile, or a Bash-compatible terminal such as Git Bash, WSL, macOS Terminal, or
  Linux Terminal

If pnpm is not already available, enable the Node.js Corepack shim and activate pnpm 10:

```powershell
corepack enable
corepack prepare pnpm@10 --activate
```

The same commands work in Bash:

```bash
corepack enable
corepack prepare pnpm@10 --activate
```

Check the installed versions with `node --version` and `pnpm --version`.

## Launch using Windows Terminal

Open Windows Terminal, select a PowerShell profile, and run:

```powershell
cd "path/to/file"
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

Vite prints the development URL, normally `http://localhost:5173`. Keep that terminal open while using the application
and press `Ctrl+C` when you want to stop the server.

If the repository is stored elsewhere, replace the path passed to `cd` with the local repository path.

## Launch using Bash

Open Git Bash, WSL, macOS Terminal, or a Linux terminal. Change to the repository and start the development server:

```bash
cd /path/to/CareConnectTeam10WebApp
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

Use the committed `pnpm-lock.yaml` through `pnpm install --frozen-lockfile` so every developer receives the locked
dependency versions. Open the Vite URL in a browser; the root route redirects to `/overview`.

### Application routes

| Route              | Screen                                        |
|--------------------|-----------------------------------------------|
| `/overview`        | Dashboard and daily summary                   |
| `/appointments`    | Upcoming appointments                         |
| `/medications`     | Active medications                            |
| `/medications/add` | Add-medication workflow                       |
| `/messages`        | Message list and selected message preview     |
| `/health-records`  | Laboratory and health-record summary          |
| `/care-team`       | Care-team directory                           |
| `/preferences`     | Locally saved preferences and demo-data reset |

Unknown URLs display the application’s not-found page.

## Responsive development

The UI uses three responsive shell presentations:

- Mobile, below 768 px: top navigation and menu panel
- Tablet, 768–1023 px: compact navigation rail
- Desktop, 1024 px and wider: full navigation sidebar and toolbar

The page components are shared across viewport sizes. Tailwind breakpoints change their grids, spacing, and visibility
rather than maintaining separate copies of every page.

For comparison with the source designs, test these reference viewport sizes in browser developer tools:

- Mobile: `393 × 852`
- Tablet: `768 × 1024`
- Desktop: `1440 × 1024`

Also test widths between those reference sizes to detect wrapping or overflow issues.

## Debug the application

### Browser developer tools

1. Run `pnpm dev`.
2. Open the local URL in Chrome, Edge, or Firefox.
3. Open the browser developer tools.
4. Use the Console panel for runtime errors and warnings.
5. Use the Network panel to inspect route chunks, the manifest, and static assets.
6. Use the Elements panel to inspect responsive Tailwind classes and accessibility attributes.
7. Use device emulation to verify the mobile, tablet, and desktop sizes listed above.

Vite supports hot module replacement, so most source edits appear without restarting the development server.

### React Developer Tools

The optional React Developer Tools browser extension can inspect the component tree, props, state, lazy-loaded routes,
and mobile navigation state. It is not required to run the application.

### Debug routing

Routes are configured in `src/app/App.tsx`. Navigation entries are defined in `src/app/route-config.ts`.

If a route does not display:

1. Confirm that the URL matches one of the documented paths.
2. Check the browser Console for a lazy-import error.
3. Confirm that the page module has a default export.
4. Restart `pnpm dev` if a newly added file is not detected.

### Debug responsive layouts

The viewport-specific application shells are defined in `src/layouts/AppShell.tsx`. Shared page content is in
`src/pages`, and reusable healthcare components are in `src/components/care`.

When debugging a layout issue, first determine whether it belongs to:

- The application shell or navigation
- A shared page component
- A reusable card or row
- A theme token or global rule in `src/styles/index.css`

This separation helps avoid applying page-specific fixes to the entire application.

### Debug styles

Tailwind is integrated through the Vite plugin. Global theme tokens and reusable CSS classes are in
`src/styles/index.css`.

If a Tailwind change does not appear:

1. Confirm that the class name is present as a complete string in a source file.
2. Check for a more specific rule in the browser’s Styles panel.
3. Restart the Vite server after changing build configuration.

## Test the application

### Windows Terminal (PowerShell)

```powershell
cd "C:\Users\chris\UMGC-projects\SWEN-661\Team_10_CareConnect\CareConnectTeam10WebApp"
pnpm test
```

### Bash

```bash
cd /path/to/CareConnectTeam10WebApp
pnpm test
```

The tests use React Testing Library and JSDOM. They verify routing, core navigation interactions, the mobile message
workflow, and that tested renders produce no console errors or warnings. Clear site data in the browser when you need to
manually start from the original mock dataset.

Test files use the `.test.tsx` suffix. Shared initialization is in `src/test/setup.ts`, and the test environment is
configured in `vitest.config.ts`.

Run tests interactively in watch mode:

```
pnpm exec vitest
```

Run one test file:

```
pnpm exec vitest src/app/App.test.tsx
```

## Lint and type-check

These commands are identical in PowerShell and Bash.

Run ESLint:

```text
pnpm lint
```

Run TypeScript without producing output files:

```text
pnpm exec tsc -b
```

The production build also runs the TypeScript check before bundling.

## Create a production build

Run:

```
pnpm build
```

The optimized application is written to `dist/`. The build includes route-level code splitting for the individual
CareConnect pages.

Preview the production build locally:

```
pnpm exec vite preview
```

Vite will print the preview URL, normally `http://localhost:4173`.

## Recommended verification before committing

```
pnpm test
pnpm lint
pnpm exec tsc -b
pnpm build
```

Then review every application route at the mobile, tablet, and desktop reference sizes.

## Project organization

```text
src/
  app/                 Router, route metadata, and route tests
  components/
    care/              Appointment, medication, message, and summary components
    dialogs/           Accessible responsive workflow dialogs
    ui/                Shared UI primitives and page layout
  data/                Typed sample CareConnect data
  layouts/             Responsive application shells and navigation
  pages/               Route-level page components
  hooks/               Shared keyboard-shortcut and offline-queue hooks
  state/               Context provider, reducer, local persistence, modal state, and notifications
  styles/              Tailwind theme tokens and global styles
  test/                Shared test setup
public/                Manifest and application icon
```

## PWA and offline demo behavior

The production build includes a standalone manifest, Android and Apple icons, four application shortcuts, an offline
fallback, controlled update prompts, and an engagement-based installation prompt. Use the production preview when
testing installation or service-worker behavior; development mode is not a reliable service-worker test environment.

CareConnect keeps approved demo records and queued demo mutations in IndexedDB. The queue records waiting, syncing, synced, and needs-attention
states and processes pending work when connectivity returns. The demo synchronization adapter never sends information
to a healthcare system. Application state retained for offline demonstration expires after 30 days, and Preferences
provides a Clear offline data action for local records, queued operations, and CareConnect caches.

The service worker separates shell, static, navigation, and approved data caches. It does not cache authorization
headers, failed responses, opaque responses, or responses marked private or no-store. New service-worker versions wait
for the user to choose Update now before activation.

To test installation, run `pnpm build`, then `pnpm exec vite preview`, open the localhost URL, and visit the application
again or keep it open for at least 30 seconds. Android Chrome and desktop Chromium browsers can use the in-app install
action. On iOS Safari, use Share and then Add to Home Screen.

## Current limitations

- All workflows use local mock data and are intended only for UI demonstration.
- Demo records persist locally for at most 30 days; Preferences can reset them or clear all offline data.
- Search, notifications, appointment actions, medication dose tracking, and messaging are front-end simulations only.
- Native Electron File, Edit, View, and window menus are not part of the browser application. CareConnect Help remains
  available from the toolbar and mobile menu.
- The PWA service worker caches the application shell and approved local assets. Demo mutations are queued in IndexedDB
  for simulated synchronization when the browser returns online; there is no production backend or cross-device sync.
- The application must not be treated as a production healthcare system or as a source of real patient information.
