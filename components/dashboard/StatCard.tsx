import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'amber' | 'emerald' | 'rose' | 'default';
}

const variantStyles = {
  primary: 'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
  amber: 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
  emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
  rose: 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
  default: 'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800',
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}: StatCardProps) {
  return (
    <div className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          {title}
        </p>
        <div className={`p-2 rounded-xl ${variantStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <p className="font-extrabold text-3xl tracking-tight text-[var(--foreground)]">
        {value}
      </p>

      {description && (
        <p className="text-xs font-medium text-[var(--foreground)] mt-1.5">
          {description}
        </p>
      )}
    </div>
  );
}
