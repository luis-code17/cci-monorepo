"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { href: "/", label: "Inicio" },
  // { href: "/blog", label: "Blog" },
  { href: "/predicaciones", label: "Predicaciones" },
  { href: "/about", label: "Sobre Nosotros" },
  { href: "/ofrendas", label: "Ofrendas y Diezmos" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeDrawer() {
    const drawer = document.getElementById("site-drawer") as HTMLInputElement | null;

    if (drawer) {
      drawer.checked = false;
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="section-shell">
        <div className={`navbar relative mt-3 min-h-14 rounded-full border px-3 py-2 shadow-lg backdrop-blur-xl transition-colors ${hasScrolled ? "border-base-content/15 bg-base-100/90" : "border-base-content/10 bg-base-100/75"}`}>
          <div className="navbar-start flex-1 lg:flex-none">
            <Link href="/" aria-label="CCI Sabadell, inicio" className="inline-flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <BrandMark size="sm" className="h-9 w-14" />
            </Link>
          </div>

          <div className="site-nav-controls navbar-center absolute right-0 flex translate-x-0 items-center gap-2">
            <nav
              aria-label="Principal"
              className="site-desktop-nav rounded-full border border-base-content/10 bg-base-100/70 px-3 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <ul className="menu menu-horizontal items-center gap-2 px-1 text-sm lg:gap-2">
                {links.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeDrawer}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "relative flex items-center justify-center px-2 py-1.5 text-center text-sm font-medium transition-colors duration-200 lg:rounded-full lg:px-3 lg:py-1.5",
                          active
                            ? "text-base-content lg:after:absolute lg:after:bottom-0 lg:after:left-2 lg:after:right-2 lg:after:h-[2px] lg:after:rounded-full lg:after:bg-base-content lg:after:content-['']"
                            : "text-base-content/70 hover:text-base-content lg:after:absolute lg:after:bottom-0 lg:after:left-2 lg:after:right-2 lg:after:h-[2px] lg:after:rounded-full lg:after:bg-base-content lg:after:scale-x-0 lg:after:transition-transform lg:after:duration-200 lg:after:content-[''] hover:lg:after:scale-x-100",
                        ].join(" ")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <label
              htmlFor="site-drawer"
              className="site-mobile-nav btn btn-ghost btn-circle border border-base-content/10 bg-base-100/60 text-base-content shadow-sm backdrop-blur-sm"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </label>
            <ThemeToggle />
          </div>

          <div className="navbar-end hidden" />
        </div>
      </div>
    </header>
  );
}
