'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Edit3, Trash2, BookOpen } from 'lucide-react';
import { BookWithCategory, Category } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { CategoryFilterDropdown } from '@/components/shared/CategoryFilterDropdown';
import { formatCurrency } from '@/lib/utils';
import { deleteBook } from '@/app/actions/books';

interface AdminBooksClientProps {
  initialBooks: BookWithCategory[];
  categories: Category[];
}

export function AdminBooksClient({ initialBooks, categories }: AdminBooksClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCat(cat);
    setCurrentPage(1);
  };

  // Hitung jumlah buku per kategori secara dinamis dari initialBooks
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialBooks.length };
    for (const book of initialBooks) {
      if (book.category_id) {
        counts[book.category_id] = (counts[book.category_id] || 0) + 1;
      }
    }
    return counts;
  }, [initialBooks]);

  // Filter daftar buku
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((b) => {
      if (selectedCat !== 'all' && b.category_id !== selectedCat) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.isbn && b.isbn.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [initialBooks, search, selectedCat]);

  // Hitung total halaman & slice data untuk halaman aktif
  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, activePage, pageSize]);

  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) return;

    try {
      const res = await deleteBook(id);
      if (!res.success) {
        alert(res.error || 'Gagal menghapus buku.');
        return;
      }
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Buku mungkin sedang terkait riwayat pinjaman.';
      alert('Gagal menghapus buku: ' + message);
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Buku Baru</span>
          </Link>
        }
      />

      {/* Filter Bar & Searchbar yang Dioptimalkan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface shadow-xs">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Cari judul, ISBN, pengarang... (/)"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">
              Menampilkan <strong className="text-foreground font-semibold">{filteredBooks.length}</strong> dari {initialBooks.length} buku
            </span>
            {(search || selectedCat !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  handleSearchChange('');
                  handleCategoryChange('all');
                }}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                (Reset filter)
              </button>
            )}
          </div>

          <CategoryFilterDropdown
            categories={categories}
            selectedCategory={selectedCat}
            onSelectCategory={handleCategoryChange}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>

      {/* Tabel Buku dengan Pagination Terintegrasi */}
      {filteredBooks.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border text-muted font-semibold text-xs">
                <tr>
                  <th className="px-5 py-3.5">Koleksi Buku</th>
                  <th className="px-5 py-3.5">Kategori</th>
                  <th className="px-5 py-3.5">ISBN</th>
                  <th className="px-5 py-3.5">Nilai Buku</th>
                  <th className="px-5 py-3.5 text-center">Stok Rak</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {paginatedBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-surface-secondary/40 transition-colors"
                  >
                    {/* Koleksi Buku (Sampul Mini + Judul Lora + Pengarang) */}
                    <td className="px-5 py-3.5 min-w-72">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-12 rounded-lg overflow-hidden bg-surface-secondary border border-border/80 shrink-0 shadow-2xs">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url}
                              alt={book.title}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted">
                              <BookOpen className="w-4 h-4 opacity-40" />
                            </div>
                          )}
                          <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-serif font-medium text-sm text-foreground line-clamp-1 leading-snug">
                            {book.title}
                          </h4>
                          <p className="text-xs text-muted mt-0.5 truncate">
                            {book.author} {book.published_year ? `· ${book.published_year}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kategori (Soft Pill Badge) */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-secondary text-muted border border-border/70">
                        {book.category?.name || 'Umum'}
                      </span>
                    </td>

                    {/* ISBN (Rapi 1 Baris) */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-muted">
                      {book.isbn || '-'}
                    </td>

                    {/* Nilai Buku */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs font-medium text-foreground">
                      {formatCurrency(book.price)}
                    </td>

                    {/* Stok Rak */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-center">
                      {book.available_stock > 0 ? (
                        <div className="inline-flex items-center gap-1 text-xs">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {book.available_stock}
                          </span>
                          <span className="text-muted">/ {book.total_stock} eks.</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                          Habis (0)
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={book.status} />
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-secondary text-muted hover:text-foreground transition-colors cursor-pointer shadow-2xs"
                          title="Ubah Data Buku"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted hover:text-rose-600 transition-colors cursor-pointer"
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

          {/* Baris Pagination */}
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Tidak Ada Buku Ditemukan"
          description={
            search || selectedCat !== 'all'
              ? 'Tidak ada koleksi buku yang cocok dengan filter atau kata kunci pencarian Anda.'
              : 'Belum ada data koleksi buku yang terdaftar.'
          }
        />
      )}
    </div>
  );
}
