# CCI Sabadell Web

Next.js App Router frontend with Tailwind CSS and DaisyUI.

## CMS

The frontend now reads content from WordPress Headless CMS through WPGraphQL and ACF.

Copy `.env.example` and set the environment variables for your deployment.

## Local Development

```bash
pnpm dev
```

## Migration Notes

See [docs/wordpress-migration.md](./docs/wordpress-migration.md) for the required WordPress plugins, content model, and GraphQL examples.

For the local WordPress stack, see [../wordpress/README.md](../wordpress/README.md).
