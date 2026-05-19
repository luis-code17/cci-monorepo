"use client";

import { useEffect, useRef } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { DEFAULT_THEME, STORAGE_KEY, type ThemeName } from "@/lib/theme";

function isThemeName(value: string | null): value is ThemeName {
  return value === "light" || value === "dark";
}

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (isThemeName(storedTheme)) {
    return storedTheme;
  }

  const currentTheme = document.documentElement.getAttribute("data-theme");
  return isThemeName(currentTheme) ? currentTheme : DEFAULT_THEME;
}

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    if (checkboxRef.current) {
      checkboxRef.current.checked = initialTheme === "dark";
    }
  }, []);

  function handleChange() {
    const currentTheme = getInitialTheme();
    const nextTheme: ThemeName = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);

    if (checkboxRef.current) {
      checkboxRef.current.checked = nextTheme === "dark";
    }
  }

  return (
    <label
      className="swap swap-rotate btn btn-ghost btn-circle border border-base-200/70 bg-base-100/70 text-base-content shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-base-200/80"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        className="theme-controller sr-only"
        onChange={handleChange}
      />
      <SunMedium className="swap-off h-5 w-5" aria-hidden="true" />
      <MoonStar className="swap-on h-5 w-5" aria-hidden="true" />
    </label>
  );
}
