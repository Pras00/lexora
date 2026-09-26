import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'amber' | 'emerald' | 'rose' | 'default';
}

const variantStyles = {
  primary: {
    icon: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900/50',
    cardHover: 'hover:border-indigo-300 dark:hover:border-indigo-800',
    accentBar: 'bg-indigo-500',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900/50',
    cardHover: 'hover:border-amber-300 dark:hover:border-amber-800',
    accentBar: 'bg-amber-500',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900/50',
    cardHover: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    accentBar: 'bg-emerald-500',
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/50',
    cardHover: 'hover:border-rose-300 dark:hover:border-rose-800',
    accentBar: 'bg-rose-500',
  },
  default: {
    icon: 'bg-surface-secondary text-muted border-border',
    cardHover: 'hover:border-border-strong',
    accentBar: 'bg-slate-400',
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
}: StatCardProps) {
  const current = variantStyles[variant];

  return (
    <div
      className={`group relative p-5 bg-surface border border-border rounded-2xl shadow-xs transition-all duration-200 hover:shadow-md ${current.cardHover} hover:-translate-y-0.5 overflow-hidden`}
    >
      {/* Top subtle highlight line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity ${current.accentBar}`}
      />

      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {title}
        </p>
        <div
          className={`p-2 rounded-xl border transition-transform duration-200 group-hover:scale-105 ${current.icon}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="font-extrabold text-3xl tracking-tight text-foreground font-sans">
        {value}
      </div>

      {description && (
        <p className="text-xs font-medium text-muted mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
