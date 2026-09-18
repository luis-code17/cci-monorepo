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
import { MobileMenu } from "@/components/mobile-menu";
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
      <body className="min-h-dvh bg-base-100 text-base-content">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('cci-theme');if(t!=='light'&&t!=='dark'){t='${DEFAULT_THEME}'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;localStorage.setItem('cci-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');document.documentElement.style.colorScheme='${DEFAULT_THEME}';}})();`}
        </Script>
        <div className="drawer drawer-end min-h-dvh">
          <input id="site-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex min-h-dvh flex-col text-base-content">
            <Navbar />
            <main className="flex flex-1 flex-col">
              <RouteBackground>{children}</RouteBackground>
            </main>
            <Footer />
          </div>
          <MobileMenu />
        </div>
      </body>
    </html>
  );
}
