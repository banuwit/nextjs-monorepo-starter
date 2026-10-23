# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Product requirements

The product specification is split by stage: [Stage 1 frontend](apps/frontend/prd.md), [Stage 2 mobile](apps/mobile/prd.md), and [Stage 3 backend](apps/backend/prd.md). Stages 2 and 3 are roadmaps until explicitly requested.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

### Backoffice app shell

[Backoffice layout](<./apps/frontend/src/app/(backoffice)/layout.tsx>) renders the shared sidebar and [AppHeader](./apps/frontend/src/components/app-sidebar-header.tsx) for every backoffice route. Use [PageHeading](./apps/frontend/src/components/page-heading.tsx) inside each page for its breadcrumb and `<h1>`; pass `parents` for linked ancestors and `children` for optional text or badges below the title.

To check the shell, run `pnpm --filter frontend dev` and open `/dashboard` in a browser.

### Appearance preferences

Edit [preferences-config.ts](./apps/frontend/src/lib/preferences-config.ts) to set the defaults and two independent flags:

- `showPreferences`: shows or hides the header Preferences button. Hiding it does not disable cookie restoration.
- `persistToCookie`: saves/restores font, page layout, sidebar style, radius and scale when `true`. When `false`, their saved cookies are ignored and changes last until a full page reload (client-side navigation retains them). Existing cookies are not deleted; enabling the flag again restores valid saved choices. Primary, Sidebar and App Body colors never read or write cookies, regardless of this flag; each reload applies their configured defaults.

For centrally managed appearance, set both flags to `false`, edit `defaults`, and deploy. Users see the new defaults on reload without clearing cookies. The theme toggle remains available and **always** saves its choice independently to `app_theme`; Restore Defaults does not change the theme.

The menu offers:

- Fonts: Geist, Inter, Nunito, Roboto, DM Sans, Poppins and Raleway.
- Page Layout: Centered / Full Width; Sidebar Style: Sidebar / Inset / Floating.
- Primary Color: Blue, Indigo, Violet, Emerald, Teal, Orange, Rose and Neutral, using Tailwind 600 for filled controls in both modes. Standalone links and status text use a paired 700 shade in light mode and 300 shade in dark mode for readability. Chart palettes stay unchanged.
- Sidebar Color: the same eight color names as Primary Color plus White and Gray, selected independently, using shade 800 in both light and dark modes. White uses dark text in light mode and a dark neutral surface in dark mode. Old `default`/`primary` cookies fall back to the configured default.
- App Body Color: the same eight Tailwind 50 colors at 60% background opacity (equivalent to `bg-blue-50/60`). Text and child components remain fully opaque. Dark mode retains the 950 shades. Only the content area's background changes; header, cards, and chart palettes retain their colors.
- Border Radius: None (`0`), Small (`0.375rem`), Medium (`0.625rem`), Large (`1rem`), applied through shared radius tokens. Circular avatars and explicitly fixed radii retain their shape.
- Scale: Small (87.5%), Medium (100%), Large (112.5%) of the browser's base font size. This scales text, spacing and components using `rem`; fixed pixel sizes and responsive breakpoints are unchanged.

Navbar behavior stays sticky and sidebar collapse stays icon-only. Defaults are Geist, Full Width, Sidebar, Blue primary, Neutral sidebar, Neutral app body, Medium radius and Medium scale; the initial theme is Light.

Preference cookies last one year from each write. Only the changed persistable preference is written; opening the page does not persist defaults. Restore Defaults resets all eight appearance choices, saving only the five non-color defaults when persistence is enabled. Legacy color cookies are ignored. Invalid cookie values fall back independently to defaults. The old `localStorage.theme` is migrated to the theme cookie once when no theme cookie exists.

The root layout reads cookies for correct initial sidebar rendering, so routes render on demand. A boot script resolves the system theme and legacy theme before hydration. Fonts are served locally through `next/font/local`; the added Latin WOFF2 assets come from Google Fonts, with OFL licenses alongside them in [fonts](./apps/frontend/src/app/fonts/). Only Geist is preloaded; alternative fonts load when used.

After changing preferences, check the controls in a browser across navigation and reload. Follow the cases in [Panduan Preferences](./.agents/rule/preferences.md).

This Turborepo includes the following packages/apps:

### Apps and Packages

- `frontend`: a [Next.js](https://nextjs.org/) app
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
pnpm exec turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=frontend
```

Without global `turbo`:

```sh
npx turbo build --filter=frontend
pnpm exec turbo build --filter=frontend
pnpm exec turbo build --filter=frontend
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=frontend
```

Without global `turbo`:

```sh
npx turbo dev --filter=frontend
pnpm exec turbo dev --filter=frontend
pnpm exec turbo dev --filter=frontend
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
