export function getWordPressApiUrl() {
  return process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? null;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? null;
}
