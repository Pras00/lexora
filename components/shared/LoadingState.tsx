export function LoadingState({ message = 'Memuat data perpustakaan...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm font-medium text-[var(--muted)]">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse">
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    </div>
  );
}
