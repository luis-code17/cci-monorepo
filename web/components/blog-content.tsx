"use client";

type BlogContentProps = {
  html: string;
};

export function BlogContent({ html }: BlogContentProps) {
  // Clean problematic special characters
  const cleanHtml = html
    .replace(/​/g, "") // Zero-width space
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Other invisible characters
    .trim();

  if (!cleanHtml) {
    return <p className="text-base-content/50">Sin contenido</p>;
  }

  return (
    <article
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
      className="article-content"
    />
  );
}
