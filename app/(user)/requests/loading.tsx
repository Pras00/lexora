export default function RequestsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-surface-secondary rounded-lg animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-surface-secondary rounded-md animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-surface-secondary rounded-xl animate-pulse" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-28 bg-surface-secondary rounded-xl animate-pulse" />
        <div className="h-8 w-44 bg-surface-secondary rounded-xl animate-pulse" />
        <div className="h-8 w-40 bg-surface-secondary rounded-xl animate-pulse" />
        <div className="h-8 w-48 bg-surface-secondary rounded-xl animate-pulse" />
      </div>

      {/* Grid 2-Kolom Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri Skeleton */}
        <div className="lg:col-span-8 space-y-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-surface-secondary rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-5 w-36 bg-surface-secondary rounded-md" />
                    <div className="h-3.5 w-48 bg-surface-secondary rounded-md" />
                  </div>
                </div>
                <div className="h-8 w-28 bg-surface-secondary rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan Skeleton */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 animate-pulse">
            <div className="h-5 w-40 bg-surface-secondary rounded-md" />
            <div className="h-2 w-full bg-surface-secondary rounded-full" />
            <div className="h-4 w-48 bg-surface-secondary rounded-md" />
            <div className="h-9 w-full bg-surface-secondary rounded-xl" />
          </div>

          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 animate-pulse">
            <div className="h-5 w-48 bg-surface-secondary rounded-md" />
            <div className="h-14 w-full bg-surface-secondary rounded-xl" />
            <div className="h-14 w-full bg-surface-secondary rounded-xl" />
            <div className="h-14 w-full bg-surface-secondary rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
