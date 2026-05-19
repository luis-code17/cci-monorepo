export default function Loading() {
  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <div className="space-y-4">
        <div className="skeleton h-4 w-28" />
        <div className="skeleton h-14 w-4/5" />
        <div className="skeleton h-6 w-2/3" />
      </div>

      <div className="mt-12 space-y-6">
        <div className="surface-card overflow-hidden bg-base-200/60">
          <div className="skeleton aspect-[21/9] w-full" />
          <div className="space-y-4 p-6 sm:p-8">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-5 w-full" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-card">
              <div className="space-y-4 p-6">
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-8 w-4/5" />
                <div className="skeleton h-5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
