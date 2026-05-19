"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

export function BrandMark({ size, className = "" }: BrandMarkProps) {
  const asset = sizes[size];
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initial = typeof document !== "undefined" ? document.documentElement.getAttribute("data-theme") : null;
    setIsDark(isDarkThemeValue(initial));

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          const v = document.documentElement.getAttribute("data-theme");
          setIsDark(isDarkThemeValue(v));
        }
      }
    });

    obs.observe(document.documentElement, { attributes: true });

    return () => obs.disconnect();
  }, []);

  const src = isDark ? asset.srcDark : asset.srcLight;

  return (
    <span className={`relative inline-flex ${className}`}>
      <Image
        src={src}
        alt="CCI Sabadell"
        width={asset.width}
        height={asset.height}
        className="h-auto w-auto object-contain"
        style={{ width: "auto", height: "auto" }}
        priority={size === "sm"}
      />
    </span>
  );
}
