'use client';

import Link from 'next/link';
import { BookmarkCheck } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useEffect, useState } from 'react';

export function CartButton() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? items.length : 0;

  return (
    <Link
      href="/requests/new"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      title="Keranjang Pengajuan Buku"
    >
      <BookmarkCheck className="w-4 h-4 text-[var(--foreground)]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-indigo-600 rounded-full animate-pulse">
          {count}
        </span>
      )}
    </Link>
  );
}
