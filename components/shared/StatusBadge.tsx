import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  // Request Statuses
  pending: {
    label: 'Menunggu',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  approved: {
    label: 'Disetujui',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Ditolak',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  expired: {
    label: 'Kedaluwarsa',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  cancelled: {
    label: 'Dibatalkan',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  not_picked_up: {
    label: 'Tidak Diambil',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Selesai',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },

  // Loan Item Statuses
  borrowed: {
    label: 'Sedang Dipinjam',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
  },
  returned: {
    label: 'Dikembalikan',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  overdue: {
    label: 'Terlambat',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  damaged: {
    label: 'Rusak',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  lost: {
    label: 'Hilang',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },

  // Fine Statuses
  unpaid: {
    label: 'Belum Lunas',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  paid: {
    label: 'Lunas',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },

  // Member Statuses
  active: {
    label: 'Aktif',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  suspended: {
    label: 'Ditangguhkan',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  blocked: {
    label: 'Diblokir',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
};

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border border-black/5 dark:border-white/5',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
