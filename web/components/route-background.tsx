"use client";

import { usePathname } from "next/navigation";

export function RouteBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className={pathname === "/" ? "min-h-full" : "route-background min-h-full"}>{children}</div>;
}