import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function formatDateEs(value: string) {
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
  }).format(date);
}

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.featuredImage?.url;
  const excerpt = post.excerpt;
  const alternativeText = post.featuredImage?.altText || post.title;

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="surface-card group h-full overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col">
        {/* Featured Image Container */}
        <figure className="relative aspect-16/10 bg-base-200 overflow-hidden shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alternativeText}
              fill
              sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-base-200 to-base-300">
              <div className="text-center">
                <span className="font-serif text-4xl text-base-content/30">📖</span>
              </div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </figure>

        {/* Content Section */}
        <div className="space-y-4 p-5 sm:p-6 flex flex-col grow">
          {/* Metadata */}
          <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-base-content/55 font-medium">
            <p>{formatDateEs(post.date)}</p>
            <p className="text-right truncate">{post.author}</p>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold leading-tight text-base-content sm:text-[1.75rem] font-serif group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm leading-6 text-base-content/70 sm:text-[0.97rem] grow line-clamp-3">
            {excerpt}
          </p>

          {/* Read More Link */}
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all duration-300">
              Leer más
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
