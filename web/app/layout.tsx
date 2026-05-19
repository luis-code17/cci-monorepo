import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getSiteUrl } from "@/lib/env";
import { DEFAULT_THEME } from "@/lib/theme";
import "./globals.css";

const siteUrl = getSiteUrl();
const metadataBase = siteUrl
  ? (() => {
      try {
        return new URL(siteUrl);
      } catch {
        return undefined;
      }
    })()
  : undefined;

export const metadata: Metadata = {
  title: {
    default: "CCI Sabadell",
    template: "%s | CCI Sabadell",
  },
  description: "Sitio web de CCI Sabadell con predicaciones, blog y versículo del día.",
  metadataBase,
  icons: {
    icon: "/cci_flame_favicon_512x512.png",
    shortcut: "/cci_flame_favicon_512x512.png",
    apple: "/cci_flame_favicon_512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      data-theme={DEFAULT_THEME}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-base-100 text-base-content">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('cci-theme');if(t!=='light'&&t!=='dark'){t='${DEFAULT_THEME}'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;localStorage.setItem('cci-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');document.documentElement.style.colorScheme='${DEFAULT_THEME}';}})();`}
        </Script>
        <div className="drawer drawer-end min-h-screen">
          <input id="site-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <div className="drawer-side z-50">
            <label htmlFor="site-drawer" aria-label="Cerrar menú" className="drawer-overlay" />
            <ul className="menu min-h-full w-80 bg-base-200 p-6 text-base-content">
              <li className="mb-4">
                <span className="text-lg font-semibold">CCI Sabadell</span>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/predicaciones">Predicaciones</Link>
              </li>
              <li>
                <Link href="/about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/ofrendas">Ofrendas y Diezmos</Link>
              </li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}
