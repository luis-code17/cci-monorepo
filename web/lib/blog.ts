import { cache } from "react";
import { wpClient } from "@/lib/wp-client";

type WordPressAuthor = {
  name?: string | null;
};

type WordPressMedia = {
  sourceUrl?: string | null;
  altText?: string | null;
};

type WordPressPostNode = {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  author?: {
    node?: WordPressAuthor | null;
  } | null;
  featuredImage?: {
    node?: WordPressMedia | null;
  } | null;
};

type WordPressPostsData = {
  posts?: {
    nodes?: WordPressPostNode[] | null;
  } | null;
};

type WordPressPostData = {
  post?: WordPressPostNode | null;
};

export type BlogImage = {
  url: string | null;
  altText: string | null;
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: BlogImage | null;
  author: string;
};

const POSTS_QUERY = `
  query BlogPosts($first: Int = 20) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        title
        slug
        excerpt
        content
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const POST_QUERY = `
  query BlogPost($slug: String!) {
    post(id: $slug, idType: SLUG) {
      title
      slug
      excerpt
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function resolveWordPressUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!apiUrl) {
    return null;
  }

  try {
    return new URL(url, new URL(apiUrl).origin).toString();
  } catch {
    return null;
  }
}

function normalizePost(node: WordPressPostNode): BlogPost {
  const title = node.title?.trim() || "Sin título";
  const content = node.content?.trim() || "";
  const excerpt = stripHtml(node.excerpt?.trim() || content).slice(0, 180);
  const featuredImageNode = node.featuredImage?.node ?? null;

  return {
    title,
    slug: node.slug?.trim() || "",
    excerpt,
    content,
    date: node.date?.trim() || "",
    author: node.author?.node?.name?.trim() || "Autor desconocido",
    featuredImage: featuredImageNode
      ? {
          url: resolveWordPressUrl(featuredImageNode.sourceUrl),
          altText: featuredImageNode.altText?.trim() || title,
        }
      : null,
  };
}

export const getPosts = cache(async function getPosts() {
  const payload = await wpClient<WordPressPostsData>(POSTS_QUERY, { first: 20 }, { revalidate: 300 });

  return payload?.posts?.nodes?.map(normalizePost) ?? [];
});

export const getPostBySlug = cache(async function getPostBySlug(slug: string) {
  const payload = await wpClient<WordPressPostData>(POST_QUERY, { slug }, { revalidate: 300 });

  if (!payload?.post) {
    return null;
  }

  return normalizePost(payload.post);
});