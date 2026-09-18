"use client";

import { usePathname } from "next/navigation";

export function RouteBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <div className={pathname === "/" ? "flex-1" : "route-background flex-1"}>{children}</div>;
}
