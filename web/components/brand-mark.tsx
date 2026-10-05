"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

type BrandMarkProps = {
  size: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: {
    width: 120,
    height: 80,
    srcLight: "/cci_logo_light_300x200.png",
    srcDark: "/cci_logo_full_300x200.png",
  },
  md: {
    width: 180,
    height: 120,
    srcLight: "/cci_logo_light_600x400.png",
    srcDark: "/cci_logo_full_600x400.png",
  },
  lg: {
    width: 360,
    height: 240,
    srcLight: "/cci_logo_light_1200x800.png",
    srcDark: "/cci_logo_full_1200x800.png",
  },
};

function isDarkThemeValue(val: string | null) {
  if (!val) return false;
  const v = val.toLowerCase();
  return v === "dark" || v.includes("dark");
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return isDarkThemeValue(document.documentElement.getAttribute("data-theme"));
}

function getServerThemeSnapshot() {
  return false;
}

export function BrandMark({ size, className = "" }: BrandMarkProps) {
  const asset = sizes[size];
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  const src = isDark ? asset.srcDark : asset.srcLight;

  return (
    <span className={`relative inline-flex ${className}`}>
      <Image
        src={src}
        alt="CCI Sabadell"
        width={asset.width}
        height={asset.height}
        className="h-full w-full object-contain"
        priority={size === "sm"}
      />
    </span>
  );
}
