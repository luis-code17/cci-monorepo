export default function Loading() {
  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <div className="max-w-3xl space-y-4">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-14 w-full" />
        <div className="skeleton h-6 w-4/5" />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card overflow-hidden">
          <div className="skeleton aspect-[4/5] w-full" />
          <div className="space-y-4 p-6">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-8 w-4/5" />
            <div className="skeleton h-5 w-full" />
          </div>
        </div>

        <div className="surface-card bg-base-200/60">
          <div className="space-y-6 p-6 sm:p-8">
            <div className="skeleton h-4 w-40" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-28 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
