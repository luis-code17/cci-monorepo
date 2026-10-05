export function RouteBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="route-background flex-1">
      <div className="route-background-layer" aria-hidden="true" />
      <div className="relative z-10 min-h-full">{children}</div>
    </div>
  );
}
