import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'amber' | 'emerald' | 'rose' | 'default';
}

const variantStyles = {
  primary:
    'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50',
  amber:
    'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50',
  emerald:
    'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50',
  rose:
    'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50',
  default:
    'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[var(--surface)] shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
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
