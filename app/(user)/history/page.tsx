import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { History, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function HistoryPage() {
  let returnedItems: any[] = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from('loan_items')
        .select('*, book:books(*), loan:loans!inner(user_id, pickup_confirmed_at)')
        .eq('loan.user_id', user.id)
        .eq('status', 'returned')
        .order('returned_at', { ascending: false });

      if (data) {
        returnedItems = data;
      }
    }
  } catch (err) {
    console.warn('Error fetching history:', err);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Peminjaman Selesai"
        description="Daftar seluruh buku yang pernah Anda pinjam dan telah berhasil dikembalikan ke perpustakaan."
      />

      {returnedItems.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--foreground)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Judul Buku</th>
                  <th className="px-5 py-3.5">Tanggal Ambil</th>
                  <th className="px-5 py-3.5">Tanggal Kembali</th>
                  <th className="px-5 py-3.5">Kondisi</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[var(--foreground)]">
                {returnedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-4 font-medium">
                      <div className="font-semibold text-sm">{item.book?.title}</div>
                      <div className="text-[11px] text-[var(--foreground)]">{item.book?.author}</div>
                    </td>
                    <td className="px-5 py-4 text-[var(--foreground)]">
                      {formatDate(item.loan?.pickup_confirmed_at)}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {formatDate(item.returned_at)}
                    </td>
                    <td className="px-5 py-4 capitalize text-[var(--foreground)]">
                      {item.damage_level === 'none' ? 'Baik' : item.damage_level}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="Belum Ada Riwayat Selesai"
          description="Buku yang telah Anda pinjam dan kembalikan ke perpustakaan akan tercatat di sini."
          action={
            <Link
              href="/catalog"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Jelajahi Katalog Buku
            </Link>
          }
        />
      )}
    </div>
  );
}
