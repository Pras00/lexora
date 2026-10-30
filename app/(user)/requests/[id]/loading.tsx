export default function RequestDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-40 bg-surface-secondary rounded animate-pulse" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-72 bg-surface-secondary rounded-lg animate-pulse" />
          <div className="h-4 w-56 bg-surface-secondary rounded-md animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-surface-secondary rounded-xl animate-pulse" />
      </div>
      <div className="p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-surface-secondary rounded-md" />
        <div className="h-20 w-full bg-surface-secondary rounded-xl" />
        <div className="h-20 w-full bg-surface-secondary rounded-xl" />
      </div>
    </div>
  );
}

