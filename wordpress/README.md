# Local WordPress Development

This directory contains a local WordPress stack for the headless frontend.

## What it provides

- WordPress at `http://localhost:8000`
- MySQL with persistent storage
- A simple seed for standard blog posts

## Start the stack

```bash
cd wordpress
docker compose up -d
```

Then open:

- WordPress admin: `http://localhost:8000/wp-admin`
- GraphQL endpoint: `http://localhost:8000/graphql`

## First-time WordPress setup

1. Open `http://localhost:8000`.
2. Complete the WordPress installer.
3. Create an admin user.
4. Log into the dashboard.
5. Go to `Settings > Permalinks`.
6. Select `Post name`.
7. Save changes to enable pretty URLs.

## Required plugins

Install and activate:

- WPGraphQL

### Install with WP-CLI

Use the bundled `wpcli` service after the database is ready:

```bash
docker compose run --rm wpcli plugin install wp-graphql --activate
```

If the GitHub archive URL changes, install the plugin manually from the WordPress admin.

### Verification

## Blog template for the web

If you want to see how blogs are rendered in the frontend, the template is implemented in:

- [web/app/blog/page.tsx](../web/app/blog/page.tsx) for the blog list
- [web/app/blog/[slug]/page.tsx](../web/app/blog/[slug]/page.tsx) for the blog detail template
- [web/components/image-carousel.tsx](../web/components/image-carousel.tsx) for the image gallery

Useful docs:

- [wordpress/WORDPRESS-BLOGS-GUIDE.md](WORDPRESS-BLOGS-GUIDE.md)
- [web/BLOG-TEMPLATE-CHANGES.md](../web/BLOG-TEMPLATE-CHANGES.md)
- [EJEMPLO-BLOG-COMPLETO.md](../EJEMPLO-BLOG-COMPLETO.md)

Frontend routes:

- `http://localhost:3000/blog`
- `http://localhost:3000/blog/<slug>`

In the admin dashboard:

1. Confirm the plugin is active in `Plugins`.
2. Open `GraphQL` in the sidebar if the plugin adds it.
3. Visit `http://localhost:8000/graphql`.

## Content model

WordPress is only used for the blog now.

Use standard WordPress posts for the blog:

1. Go to `Posts > Add New`.
2. Add a title.
3. Write the content in the editor.
4. Set a featured image on the right sidebar.
5. Optional: add an excerpt for shorter previews.
6. Publish.

The frontend renders the featured image, title, excerpt and content on the home page and the `/blog` archive.

## Seeded content

The MU-plugin inserts a few Spanish demo blog posts on a fresh database.

If you want to reseed, delete the local database volume and restart the stack.

## Frontend connection

Set the frontend env var to the local GraphQL endpoint:

```bash
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8000/graphql
```

The frontend can then consume the live WordPress data directly.

## Suggested workflow

1. Start WordPress with Docker Compose.
2. Install WPGraphQL.
3. Create or edit standard posts.
4. Point the frontend at `http://localhost:8000/graphql`.
5. Run the frontend and verify the blog renders.

## Troubleshooting

- If GraphQL fields are missing, confirm WPGraphQL is active.
- If images do not load in the frontend, verify the WordPress origin is allowed in `web/next.config.ts`.
