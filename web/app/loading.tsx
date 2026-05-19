export default function Loading() {
  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-card overflow-hidden">
          <div className="skeleton h-[34rem] w-full" />
        </div>
        <div className="space-y-6">
          <div className="surface-card bg-base-200/60 p-6">
            <div className="skeleton h-4 w-28" />
            <div className="mt-4 space-y-3">
              <div className="skeleton h-12 w-4/5" />
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-2/3" />
            </div>
          </div>
          <div className="surface-card bg-base-100 p-6">
            <div className="skeleton h-4 w-36" />
            <div className="mt-4 space-y-3">
              <div className="skeleton h-5 w-20" />
              <div className="skeleton h-5 w-4/5" />
              <div className="skeleton h-5 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
