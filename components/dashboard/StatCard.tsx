import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'amber' | 'emerald' | 'rose' | 'default';
}

const variantStyles = {
  primary: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
  default: 'bg-slate-100 dark:bg-slate-800 text-[var(--muted)]',
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
        <div className={`p-2.5 rounded-xl ${variantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-[var(--muted)] mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
