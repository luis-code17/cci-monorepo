# CCI Monorepo

Repositorio monorepo para el frontend público de CCI Sabadell y el stack local de WordPress usado como CMS headless para el blog.

## Estructura

- `web/`: aplicación Next.js principal.
- `wordpress/`: entorno local de WordPress con Docker Compose.

## Requisitos

- Node.js 20+.
- `pnpm`.
- Docker y Docker Compose.

## Frontend

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
```

Variables importantes:

- `NEXT_PUBLIC_WORDPRESS_API_URL`
- `NEXT_PUBLIC_SITE_URL`

## WordPress local

```bash
cd wordpress
docker compose up -d
```

Endpoints locales:

- Admin: `http://localhost:8000/wp-admin`
- GraphQL: `http://localhost:8000/graphql`

## Higiene del repo

El repositorio está preparado para no subir:

- secretos y variables locales (`.env.local`, `.env.local.cci`, etc.)
- dependencias instaladas (`node_modules`, `vendor`)
- artefactos generados (`.next`, `build`, `dist`, `coverage`)
- contenido local de WordPress (`uploads`, `upgrade`, `languages`)

Los archivos de ejemplo, como `web/.env.example`, sí se conservan para facilitar la puesta en marcha.
