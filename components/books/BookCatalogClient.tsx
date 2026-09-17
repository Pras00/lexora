'use client';

import { useState, useMemo } from 'react';
import { BookWithCategory, Category } from '@/types';
import { BookCard } from './BookCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookOpen } from 'lucide-react';

interface BookCatalogClientProps {
  initialBooks: BookWithCategory[];
  categories: Category[];
}

export function BookCatalogClient({ initialBooks, categories }: BookCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      // 1. Filter Kategori
      if (selectedCategory !== 'all' && book.category_id !== selectedCategory) {
        return false;
      }

      // 2. Filter Ketersediaan Stok
      if (onlyAvailable && book.available_stock <= 0) {
        return false;
      }

      // 3. Filter Pencarian Text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.author.toLowerCase().includes(query);
        const matchIsbn = book.isbn.toLowerCase().includes(query);
        return matchTitle || matchAuthor || matchIsbn;
      }

      return true;
    });
  }, [initialBooks, searchQuery, selectedCategory, onlyAvailable]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari judul buku, pengarang, atau nomor ISBN..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Kategori */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Toggle Hanya Stok Tersedia */}
          <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
            />
            <span>Hanya stok tersedia</span>
          </label>
        </div>
      </div>

      {/* Info Jumlah Hasil */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <p>
          Menampilkan <strong className="text-[var(--foreground)]">{filteredBooks.length}</strong> buku
        </p>
      </div>

      {/* Grid Koleksi Buku */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Tidak Ada Buku Ditemukan"
          description="Coba ubah kata kunci pencarian Anda atau pilih kategori lain."
          action={
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyAvailable(false);
              }}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Reset Filter
            </button>
          }
        />
      )}
    </div>
  );
}
