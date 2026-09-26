'use client';

import { useState, useMemo } from 'react';
import { BookWithCategory, Category } from '@/types';
import { BookCard } from './BookCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookOpen, SlidersHorizontal, X } from 'lucide-react';

interface BookCatalogClientProps {
  initialBooks: BookWithCategory[];
  categories: Category[];
}

export function BookCatalogClient({
  initialBooks,
  categories,
}: BookCatalogClientProps) {
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

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    onlyAvailable;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyAvailable(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 md:p-5 rounded-2xl border border-border bg-surface shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari judul buku, pengarang, atau nomor ISBN..."
            />
          </div>

          {/* Toggle Hanya Stok Tersedia */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                onlyAvailable
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-surface border-border text-muted hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  onlyAvailable ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
              <span>Hanya Stok Tersedia</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                title="Hapus semua filter"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="pt-2 border-t border-border flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary text-muted hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Semua Koleksi ({initialBooks.length})
          </button>

          {categories.map((cat) => {
            const count = initialBooks.filter(
              (b) => b.category_id === cat.id
            ).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-secondary text-muted hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Jumlah Hasil */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <p>
          Menampilkan{' '}
          <strong className="text-foreground font-bold">
            {filteredBooks.length}
          </strong>{' '}
          dari total {initialBooks.length} buku
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
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          }
        />
      )}
    </div>
  );
}
