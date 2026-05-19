import type { NextConfig } from "next";
import { getWordPressApiUrl } from "@/lib/env";

const WORDPRESS_API_URL = getWordPressApiUrl();
const WORDPRESS_REMOTE_PATTERN = (() => {
  if (!WORDPRESS_API_URL) {
    return null;
  }

  try {
    const wordpressOrigin = new URL(WORDPRESS_API_URL);

    return {
      protocol: wordpressOrigin.protocol.replace(":", "") as "http" | "https",
      hostname: wordpressOrigin.hostname,
      ...(wordpressOrigin.port ? { port: wordpressOrigin.port } : {}),
      pathname: "/**",
    };
  } catch {
    return null;
  }
})();

const WORDPRESS_ALLOW_LOCAL_IP = (() => {
  if (!WORDPRESS_API_URL) {
    return false;
  }

  try {
    const wordpressOrigin = new URL(WORDPRESS_API_URL);

    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(wordpressOrigin.hostname);
  } catch {
    return false;
  }
})();

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: WORDPRESS_ALLOW_LOCAL_IP,
    remotePatterns: [
      ...(WORDPRESS_REMOTE_PATTERN ? [WORDPRESS_REMOTE_PATTERN] : []),
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
