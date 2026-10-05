# CCI Sabadell Web

Next.js App Router frontend with Tailwind CSS and DaisyUI.

## CMS

The frontend now reads content from WordPress Headless CMS through WPGraphQL and ACF.

Copy `.env.example` and set the environment variables for your deployment.

## Catálogo de predicaciones de YouTube

The `/predicaciones` page uses the YouTube Data API v3 to load the channel's public uploads and public playlists. Add a server-only `YOUTUBE_API_KEY` to `.env.local` and the deployment environment. Create the key in Google Cloud Console, enable **YouTube Data API v3**, and restrict the key to that API. The key is never exposed to the browser. API responses are cached for one hour. Without a key, the page falls back to the channel RSS feed and shows the latest 15 videos without playlist filters.

## Local Development

```bash
pnpm dev
```

## E2E tests

The Playwright harness starts its own local Next.js server and runs the browser suite in desktop and mobile Chromium contexts. Payment requests are intercepted, so tests never send real donations.

```bash
pnpm e2e:install   # once per machine
pnpm e2e           # run the suite
pnpm e2e:headed    # watch the browser
pnpm e2e:ui        # open Playwright's test UI
```

The HTML report is written to `playwright-report/`; traces, screenshots, and videos for failed tests are written to `test-results/`.

## Migration Notes

See [docs/wordpress-migration.md](./docs/wordpress-migration.md) for the required WordPress plugins, content model, and GraphQL examples.

For the local WordPress stack, see [../wordpress/README.md](../wordpress/README.md).
