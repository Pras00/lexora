'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, BookOpen } from 'lucide-react';
import { BookWithCategory, Category } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AdminBooksClientProps {
  initialBooks: BookWithCategory[];
  categories: Category[];
}

export function AdminBooksClient({ initialBooks, categories }: AdminBooksClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const supabase = createClient();

  const filteredBooks = useMemo(() => {
    return initialBooks.filter((b) => {
      if (selectedCat !== 'all' && b.category_id !== selectedCat) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialBooks, search, selectedCat]);

  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) return;

    try {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert('Gagal menghapus buku: ' + (err.message || 'Buku mungkin sedang terkait riwayat pinjaman.'));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Katalog Buku"
        description="Kelola seluruh data inventori koleksi fisik perpustakaan."
        action={
          <Link
            href="/admin/books/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Buku Baru</span>
          </Link>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari judul, ISBN, pengarang..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Buku */}
      {filteredBooks.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--muted)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Judul & Pengarang</th>
                  <th className="px-5 py-3.5">Kategori</th>
                  <th className="px-5 py-3.5">ISBN</th>
                  <th className="px-5 py-3.5">Harga Penggantian</th>
                  <th className="px-5 py-3.5">Stok (Tersedia / Total)</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm">{book.title}</div>
                      <div className="text-[11px] text-[var(--muted)]">{book.author} {book.published_year ? `(${book.published_year})` : ''}</div>
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {book.category?.name || '-'}
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {book.isbn}
                    </td>
                    <td className="px-5 py-4 font-mono font-medium">
                      {formatCurrency(book.price)}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      <span className={book.available_stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                        {book.available_stock}
                      </span>{' '}
                      / {book.total_stock}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={book.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                          title="Edit Buku"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"
                          title="Hapus Buku"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Tidak Ada Buku"
          description="Koleksi buku belum ada atau tidak sesuai dengan kata kunci pencarian Anda."
        />
      )}
    </div>
  );
}
