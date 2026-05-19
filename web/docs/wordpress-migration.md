# WordPress Migration Notes

This frontend only uses WordPress for the blog.

## Content contract

The frontend expects just standard blog posts from WordPress.

## Expected page slugs

None. Static pages now live in Next.js.

## Blog query

```graphql
query WordPressBlogPosts($first: Int = 20) {
  posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

## Deployment notes

- Set `NEXT_PUBLIC_WORDPRESS_API_URL` for the GraphQL endpoint.
- Set `NEXT_PUBLIC_SITE_URL` so metadata can resolve canonical URLs correctly.
- Ensure the WordPress origin is allowed by `next.config.ts` image remote patterns.
