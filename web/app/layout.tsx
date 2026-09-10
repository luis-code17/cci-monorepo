import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ThemeToggle } from "@/components/ThemeToggle";
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
            <ul className="menu min-h-full w-80 bg-base-200/95 p-6 text-base-content shadow-2xl backdrop-blur-sm">
              <li className="mb-5 border-b border-base-content/10 pb-4">
                <Link href="/" className="flex items-center gap-3 px-0 py-1">
                  <BrandMark size="sm" className="w-24" />
                  <span className="text-base font-semibold tracking-wide text-base-content">CCI Sabadell</span>
                </Link>
              </li>
              {/* <li>
                <Link href="/blog">Blog</Link>
              </li> */}
              <li>
                <Link href="/predicaciones">Predicaciones</Link>
              </li>
              <li>
                <Link href="/about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/ofrendas">Ofrendas y Diezmos</Link>
              </li>
              <li className="mt-4 border-t border-base-content/10 pt-4">
                <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-base-content/10 bg-base-100/70 px-3 py-2.5 shadow-sm backdrop-blur-sm">
                  <span className="text-sm font-medium text-base-content/80">Tema</span>
                  <ThemeToggle />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}
