import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { BookmarkCheck, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Loan, LoanItem, Book } from '@/types';

type ActiveLoan = Loan & {
  items: (LoanItem & {
    book: Book | null;
  })[];
};

export default async function LoansPage() {
  let activeLoans: ActiveLoan[] = [];

  try {
    const { user } = await getCurrentUser();

    if (user && process.env.DATABASE_URL) {
      const data = await sql`
        SELECT l.*,
          (
            SELECT json_agg(
              json_build_object(
                'id', li.id,
                'status', li.status,
                'due_date', li.due_date,
                'extension_count', li.extension_count,
                'returned_at', li.returned_at,
                'damage_level', li.damage_level,
                'replacement_cost', li.replacement_cost,
                'book', json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'isbn', b.isbn)
              )
            )
            FROM loan_items li
            JOIN books b ON li.book_id = b.id
            WHERE li.loan_id = l.id
          ) as items
        FROM loans l
        WHERE l.user_id = ${user.id} AND l.status = 'active'
        ORDER BY l.created_at DESC
      `;

      if (data) {
        activeLoans = data as unknown as ActiveLoan[];
      }
    }
  } catch (err) {
    console.warn('Error fetching loans from NeonDB:', err);
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
              className="p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
                <div>
                  <span className="text-xs text-foreground">Tanggal Pengambilan Fisik:</span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
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
                {loan.items?.map((item) => {
                  const isOverdue = new Date(item.due_date) < new Date() && item.status === 'borrowed';

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">
                          {item.book?.title}
                        </h4>
                        <p className="text-xs text-foreground mt-0.5">{item.book?.author}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs mt-2.5">
                          {isOverdue ? (
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Terlambat! Batas: {formatDate(item.due_date)}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-foreground">
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
