export default function Loading() {
  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <div className="max-w-3xl space-y-4">
        <div className="skeleton h-4 w-28" />
        <div className="skeleton h-14 w-full" />
        <div className="skeleton h-6 w-4/5" />
      </div>

      <div className="mt-12 space-y-4">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-6 w-2/3" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="surface-card overflow-hidden shadow-sm">
            <div className="skeleton aspect-video w-full" />
            <div className="space-y-4 p-5 sm:p-6">
              <div className="skeleton h-4 w-28" />
              <div className="space-y-2">
                <div className="skeleton h-6 w-full" />
                <div className="skeleton h-6 w-4/5" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-7 w-16 rounded-full" />
                <div className="skeleton h-7 w-20 rounded-full" />
              </div>
              <div className="flex gap-3">
                <div className="skeleton h-11 w-28 rounded-full" />
                <div className="skeleton h-11 w-32 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
