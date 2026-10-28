import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { History, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function HistoryPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let returnedItems: any[] = [];

  try {
    const { user } = await getCurrentUser();

    if (user && process.env.DATABASE_URL) {
      const data = await sql`
        SELECT li.*,
          json_build_object('id', b.id, 'title', b.title, 'author', b.author, 'cover_url', b.cover_url, 'isbn', b.isbn) as book,
          json_build_object('user_id', l.user_id, 'pickup_confirmed_at', l.pickup_confirmed_at) as loan
        FROM loan_items li
        JOIN loans l ON li.loan_id = l.id
        JOIN books b ON li.book_id = b.id
        WHERE l.user_id = ${user.id} AND li.status = 'returned'
        ORDER BY li.returned_at DESC
      `;

      if (data) {
        returnedItems = data;
      }
    }
  } catch (err) {
    console.warn('Error fetching history from NeonDB:', err);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Peminjaman Selesai"
        description="Daftar seluruh buku yang pernah Anda pinjam dan telah berhasil dikembalikan ke perpustakaan."
      />

      {returnedItems.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary border-b border-border text-foreground uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Judul Buku</th>
                  <th className="px-5 py-3.5">Tanggal Ambil</th>
                  <th className="px-5 py-3.5">Tanggal Kembali</th>
                  <th className="px-5 py-3.5">Kondisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {returnedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {item.book?.title}
                      <span className="block text-xs font-normal text-muted mt-0.5">
                        {item.book?.author}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {item.loan?.pickup_confirmed_at
                        ? formatDate(item.loan.pickup_confirmed_at)
                        : '-'}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {item.returned_at ? formatDate(item.returned_at) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.damage_level === 'none' ? 'returned' : item.damage_level} />
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
          title="Belum Ada Riwayat Peminjaman"
          description="Buku yang telah Anda pinjam dan kembalikan akan otomatis tercatat di sini."
          action={
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Pinjam Buku Pertama</span>
            </Link>
          }
        />
      )}
    </div>
  );
}
