import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RouteBackground } from "@/components/route-background";
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
          <div className="drawer-content flex min-h-screen flex-col text-base-content">
            <Navbar />
            <main className="flex-1">
              <RouteBackground>{children}</RouteBackground>
            </main>
            <Footer />
          </div>
          <div className="drawer-side z-50">
            <label htmlFor="site-drawer" aria-label="Cerrar menú" className="drawer-overlay bg-base-content/10" />
            <div className="relative flex min-h-screen w-full flex-col items-center bg-base-100/30 px-6 py-16 text-base-content shadow-2xl backdrop-blur-sm">
              <label
                htmlFor="site-drawer"
                className="btn btn-ghost btn-circle absolute right-5 top-5 text-base-content"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </label>
              <Link href="/" className="shrink-0" aria-label="CCI Sabadell">
                <BrandMark size="lg" className="h-24 w-auto" />
              </Link>

              <nav aria-label="Menú móvil" className="flex flex-1 items-center justify-center">
                <ul className="flex flex-col items-center gap-5 text-center">
                  <li>
                    <Link href="/" className="text-2xl font-semibold text-base-content transition-opacity hover:opacity-70">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link href="/predicaciones" className="text-2xl font-semibold text-base-content transition-opacity hover:opacity-70">
                      Predicaciones
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-2xl font-semibold text-base-content transition-opacity hover:opacity-70">
                      Sobre Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link href="/ofrendas" className="text-2xl font-semibold text-base-content transition-opacity hover:opacity-70">
                      Ofrendas y Diezmos
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex shrink-0 flex-col items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-base-content/55">Tema</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
