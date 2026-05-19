"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
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

  function closeDrawer() {
    const drawer = document.getElementById("site-drawer") as HTMLInputElement | null;

    if (drawer) {
      drawer.checked = false;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/85 backdrop-blur-xl supports-[backdrop-filter]:bg-base-100/75">
      <div className="section-shell">
        <div className="navbar min-h-0 px-0 py-3">
          <div className="navbar-start gap-2">
            <label
              htmlFor="site-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </label>

            <Link href="/" className="flex items-center gap-3" onClick={closeDrawer}>
              <BrandMark size="sm" className="h-11 w-auto" />
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-semibold tracking-[0.18em] text-base-content">CCI Sabadell</span>
                <span className="text-[0.68rem] uppercase tracking-[0.28em] text-base-content/60">
                  Fe, comunidad y esperanza
                </span>
              </span>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <nav aria-label="Principal">
              <ul className="menu menu-horizontal gap-1 px-1 text-sm">
                {links.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeDrawer}
                        aria-current={active ? "page" : undefined}
                        className={active ? "bg-base-200 font-medium text-base-content" : "text-base-content/70"}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="navbar-end ml-auto gap-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
