'use client';

import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, BookmarkCheck, ArrowRight, BookMarked } from 'lucide-react';
import { BookWithCategory } from '@/types';
import { useCartStore } from '@/stores/cart.store';

interface HighlightBookCardProps {
  book: BookWithCategory;
  isLoggedIn: boolean;
}

export function HighlightBookCard({ book, isLoggedIn }: HighlightBookCardProps) {
  const router = useRouter();
  const { addItem, hasItem } = useCartStore();
  const [imgError, setImgError] = useState<boolean>(false);
  const isAdded = hasItem(book.id);

  const handleBorrowClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(`/login?redirectTo=/catalog/${book.id}`);
      return;
    }

    addItem(book);
    router.push('/requests/new');
  };

  const inStock = book.available_stock > 0;

  return (
    <article className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-strong hover:shadow-md transition-all duration-300">
      {/* Cover Image Container */}
      <Link
        href={`/catalog/${book.id}`}
        className="relative h-64 w-full bg-surface-secondary block overflow-hidden"
        aria-label={`Lihat detail ${book.title}`}
      >
        {book.cover_url && !imgError ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted p-4 text-center bg-surface-secondary">
            <BookOpen className="w-10 h-10 stroke-1 mb-2 opacity-50" />
            <span className="text-xs font-medium text-foreground line-clamp-2">{book.title}</span>
          </div>
        )}

        {/* Kategori label */}
        {book.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase bg-surface/90 text-primary rounded-full backdrop-blur-xs shadow-xs border border-border">
            {book.category.name}
          </span>
        )}

        {/* Stock badge */}
        <span
          className={`absolute bottom-3 right-3 px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-full backdrop-blur-xs shadow-xs border ${
            inStock
              ? 'bg-emerald-500/90 text-white border-emerald-600/50'
              : 'bg-rose-500/90 text-white border-rose-600/50'
          }`}
        >
          {inStock ? `${book.available_stock} Tersedia` : 'Habis'}
        </span>
      </Link>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col p-5 gap-3">
        <div>
          <Link href={`/catalog/${book.id}`}>
            <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-sm font-medium text-muted mt-1.5">
            {book.author} · {book.published_year}
          </p>
          {book.description && (
            <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleBorrowClick}
            disabled={!inStock}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              !inStock
                ? 'bg-surface-secondary text-muted cursor-not-allowed border border-border'
                : isAdded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-accent-subtle text-primary border border-border hover:bg-primary hover:text-white'
            }`}
          >
            {isAdded ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Di Keranjang</span>
              </>
            ) : (
              <>
                <BookMarked className="w-4 h-4" />
                <span>Pinjam</span>
              </>
            )}
          </button>

          <Link
            href={`/catalog/${book.id}`}
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-border text-foreground hover:border-primary hover:text-primary hover:bg-surface-secondary transition-all"
            title="Lihat Detail"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
