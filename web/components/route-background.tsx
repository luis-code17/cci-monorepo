"use client";

import { usePathname } from "next/navigation";

export function RouteBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <div className="route-background flex-1">
      <div className="route-background-layer" aria-hidden="true" />
      <div className="relative z-10 min-h-full">{children}</div>
    </div>
  );
}
