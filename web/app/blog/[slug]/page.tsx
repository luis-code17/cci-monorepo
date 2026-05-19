import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug } from "@/lib/blog";
import { BlogContent } from "@/components/blog-content";

type Params = Promise<{ slug: string }>;

function formatDateEs(value: string, options: Intl.DateTimeFormatOptions = {}) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(date);
}

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog no encontrado",
    };
  }

  return {
    title: post.title || "Blog",
    description: post.excerpt || "",
  };
}

export default async function BlogDetailPage(props: { params: Params }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const featuredImageUrl = post.featuredImage?.url;
  const featuredImageAlt = post.featuredImage?.altText || post.title;

  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      {/* Navigation */}
      <nav className="mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          ← Volver al blog
        </Link>
      </nav>

      {/* Featured Image */}
      {featuredImageUrl && (
        <figure className="relative mb-12 overflow-hidden rounded-xl bg-base-200 aspect-video sm:aspect-video lg:aspect-16/7">
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            priority
            sizes="(min-width: 1280px) 1120px, (min-width: 768px) 704px, (min-width: 640px) 576px, calc(100vw - 32px)"
            className="object-cover"
          />
        </figure>
      )}

      {/* Article Header */}
      <header className="mb-12 max-w-3xl mx-auto section-stack">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">
            {formatDateEs(post.date)}
          </p>
          <h1 className="text-balance text-4xl font-semibold text-base-content sm:text-5xl md:text-6xl font-serif leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-base-300">
          <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-sm font-semibold">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base-content">{post.author}</p>
            <p className="text-sm text-base-content/60">{formatDateEs(post.date, { day: "numeric", month: "short", year: "2-digit" })}</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto mb-12">
        <BlogContent html={post.content} />
      </article>

      {/* Article Footer */}
      <footer className="max-w-3xl mx-auto mt-12 pt-8 border-t border-base-300">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          ← Volver al blog
        </Link>
      </footer>
    </div>
  );
}
