import { BlogCard } from "@/components/blog-card";
import { getPosts } from "@/lib/blog";
import { CMS_EMPTY_STATE_MESSAGE } from "@/lib/fallbacks";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archivo del blog",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      {/* Archive Header */}
      <section className="max-w-3xl section-stack mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Archivo</p>
          <h1 className="text-balance text-4xl font-semibold text-base-content sm:text-5xl md:text-6xl font-serif mt-3">
            Blog y reflexiones
          </h1>
        </div>
        <p className="max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
          Compartimos reflexiones, actualizaciones y palabras de ánimo para acompañar la vida de la comunidad.
        </p>
      </section>

      {/* Posts Grid */}
      <section>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="alert alert-info shadow-md max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{CMS_EMPTY_STATE_MESSAGE}</span>
          </div>
        )}
      </section>
    </div>
  );
}
