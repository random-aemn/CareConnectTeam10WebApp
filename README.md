# CareConnect Web App

CareConnect is a responsive patient-portal UI prototype built from the CareConnect Figma designs. It provides static overview, appointment, medication, message, health-record, care-team, and preference screens for mobile, tablet, and desktop layouts.

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

Check the installed versions:

```powershell
node --version
pnpm --version
```

## Install dependencies

From the repository root, run:

```powershell
pnpm install
```

Use the committed `pnpm-lock.yaml` file so every developer receives compatible dependency versions.

## Run the application

Start the Vite development server:

```powershell
pnpm dev
```

Vite will print the local URL, normally `http://localhost:5173`. Open that URL in a browser. The root route redirects to `/overview`.

### Application routes

| Route | Screen |
| --- | --- |
| `/overview` | Dashboard and daily summary |
| `/appointments` | Upcoming appointments |
| `/medications` | Active medications |
| `/messages` | Message list and selected message preview |
| `/health-records` | Laboratory and health-record summary |
| `/care-team` | Care-team directory |
| `/preferences` | Static preference controls |

Unknown URLs display the application’s not-found page.

## Responsive development

The UI uses three responsive shell presentations:

- Mobile, below 768 px: top navigation and menu panel
- Tablet, 768–1023 px: compact navigation rail
- Desktop, 1024 px and wider: full navigation sidebar and toolbar

The page components are shared across viewport sizes. Tailwind breakpoints change their grids, spacing, and visibility rather than maintaining separate copies of every page.

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

The optional React Developer Tools browser extension can inspect the component tree, props, state, lazy-loaded routes, and mobile navigation state. It is not required to run the application.

### Debug routing

Routes are configured in `src/app/App.tsx`. Navigation entries are defined in `src/app/route-config.ts`.

If a route does not display:

1. Confirm that the URL matches one of the documented paths.
2. Check the browser Console for a lazy-import error.
3. Confirm that the page module has a default export.
4. Restart `pnpm dev` if a newly added file is not detected.

### Debug responsive layouts

The viewport-specific application shells are defined in `src/layouts/AppShell.tsx`. Shared page content is in `src/pages`, and reusable healthcare components are in `src/components/care`.

When debugging a layout issue, first determine whether it belongs to:

- The application shell or navigation
- A shared page component
- A reusable card or row
- A theme token or global rule in `src/styles/index.css`

This separation helps avoid applying page-specific fixes to the entire application.

### Debug styles

Tailwind is integrated through the Vite plugin. Global theme tokens and reusable CSS classes are in `src/styles/index.css`.

If a Tailwind change does not appear:

1. Confirm that the class name is present as a complete string in a source file.
2. Check for a more specific rule in the browser’s Styles panel.
3. Restart the Vite server after changing build configuration.

## Test the application

Run the Vitest test suite once:

```powershell
pnpm test
```

The current tests use React Testing Library and JSDOM. They verify that the overview and feature routes render their expected content and navigation.

Test files use the `.test.tsx` suffix. Shared initialization is in `src/test/setup.ts`, and the test environment is configured in `vitest.config.ts`.

Run tests interactively in watch mode:

```powershell
pnpm exec vitest
```

Run one test file:

```powershell
pnpm exec vitest src/app/App.test.tsx
```

## Lint and type-check

Run ESLint:

```powershell
pnpm lint
```

Run TypeScript without producing output files:

```powershell
pnpm exec tsc -b
```

The production build also runs the TypeScript check before bundling.

## Create a production build

Run:

```powershell
pnpm build
```

The optimized application is written to `dist/`. The build includes route-level code splitting for the individual CareConnect pages.

Preview the production build locally:

```powershell
pnpm exec vite preview
```

Vite will print the preview URL, normally `http://localhost:4173`.

## Recommended verification before committing

```powershell
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
    ui/                Shared UI primitives and page layout
  data/                Typed sample CareConnect data
  layouts/             Responsive application shells and navigation
  pages/               Route-level page components
  styles/              Tailwind theme tokens and global styles
  test/                Shared test setup
public/                Manifest and application icon
```

## Current limitations

- Data is static and intended only for UI demonstration.
- Controls generally preserve the appearance of the design but do not execute healthcare workflows.
- Preferences do not persist.
- Search and notification controls are visual placeholders.
- The manifest is present, but the application does not register a service worker or cache patient data offline.
- The application must not be treated as a production healthcare system or as a source of real patient information.
