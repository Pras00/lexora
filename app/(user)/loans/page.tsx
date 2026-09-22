import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { BookmarkCheck, Clock, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

export default async function LoansPage() {
  let activeLoans: any[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('loans')
        .select(`
          *,
          items:loan_items(*, book:books(*))
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (data) {
        activeLoans = data;
      }
    }
  } catch (err) {
    console.warn('Error fetching loans:', err);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buku yang Sedang Dipinjam"
        description="Pantau batas waktu pengembalian (due date) dan ajukan perpanjangan buku fisik Anda."
      />

      {activeLoans.length > 0 ? (
        <div className="space-y-6">
          {activeLoans.map((loan) => (
            <div
              key={loan.id}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border)] gap-2">
                <div>
                  <span className="text-xs text-[var(--foreground)]">Tanggal Pengambilan Fisik:</span>
                  <p className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                    {formatDate(loan.pickup_confirmed_at)}
                  </p>
                </div>
                <Link
                  href={`/loans/${loan.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Kelola Pinjaman & Perpanjangan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loan.items?.map((item: any) => {
                  const isOverdue = new Date(item.due_date) < new Date() && item.status === 'borrowed';

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[var(--foreground)] truncate">
                          {item.book?.title}
                        </h4>
                        <p className="text-xs text-[var(--foreground)] mt-0.5">{item.book?.author}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs mt-2.5">
                          {isOverdue ? (
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Terlambat! Batas: {formatDate(item.due_date)}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[var(--foreground)]">
                              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              Jatuh tempo: {formatDate(item.due_date)}
                            </span>
                          )}
                        </div>
                      </div>

                      <StatusBadge status={isOverdue ? 'overdue' : item.status} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookmarkCheck}
          title="Tidak Ada Pinjaman Aktif"
          description="Saat ini Anda tidak sedang meminjam buku fisik apapun."
          action={
            <Link
              href="/catalog"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Pinjam Buku Sekarang
            </Link>
          }
        />
      )}
    </div>
  );
}
