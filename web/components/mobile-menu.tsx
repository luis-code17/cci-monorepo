"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/predicaciones", label: "Predicaciones" },
  { href: "/about", label: "Sobre Nosotros" },
  { href: "/ofrendas", label: "Ofrendas y Diezmos" },
];

export function MobileMenu() {
  function closeDrawer() {
    const drawer = document.getElementById(
      "site-drawer"
    ) as HTMLInputElement | null;

    if (drawer) {
      drawer.checked = false;
    }
  }

  return (
    <div className="drawer-side z-50">
      <label
        htmlFor="site-drawer"
        aria-label="Cerrar menú"
        className="drawer-overlay bg-base-content/10"
      />

      <div className="relative flex min-h-screen w-full flex-col items-center bg-base-100/30 px-6 py-16 text-base-content shadow-2xl backdrop-blur-sm">
        {/* Botón X */}
        <label
          htmlFor="site-drawer"
          className="btn btn-ghost btn-circle absolute right-5 top-5 text-base-content"
          aria-label="Cerrar menú"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </label>

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="CCI Sabadell"
          onClick={closeDrawer}
        >
          <BrandMark size="lg" className="h-24 w-auto" />
        </Link>

        {/* Navegación */}
        <nav
          aria-label="Menú móvil"
          className="flex flex-1 items-center justify-center"
        >
          <ul className="flex flex-col items-center gap-5 text-center">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeDrawer}
                  className="text-2xl font-semibold text-base-content transition-opacity hover:opacity-70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tema */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-base-content/55">
            Tema
          </span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}