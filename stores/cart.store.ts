import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book } from '@/types';

export interface CartItem {
  book: Book;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => { success: boolean; message?: string };
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  hasItem: (bookId: string) => boolean;
  totalItems: () => number;
}

const MAX_CART_ITEMS = 5;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book: Book) => {
        const currentItems = get().items;

        if (currentItems.length >= MAX_CART_ITEMS) {
          return {
            success: false,
            message: `Maksimal peminjaman adalah ${MAX_CART_ITEMS} buku sekaligus.`,
          };
        }

        if (currentItems.some((item) => item.book.id === book.id)) {
          return {
            success: false,
            message: 'Buku ini sudah ada di dalam keranjang peminjaman.',
          };
        }

        if (book.available_stock <= 0) {
          return {
            success: false,
            message: 'Maaf, stok buku ini sedang kosong.',
          };
        }

        set({
          items: [
            ...currentItems,
            { book, addedAt: new Date().toISOString() },
          ],
        });

        return { success: true };
      },

      removeItem: (bookId: string) => {
        set({
          items: get().items.filter((item) => item.book.id !== bookId),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      hasItem: (bookId: string) => {
        return get().items.some((item) => item.book.id === bookId);
      },

      totalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'lexora-cart-storage',
    }
  )
);
