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
  syncBooks: (
    updates: {
      id: string;
      available_stock: number;
      total_stock?: number;
      price?: number;
      category?: any;
    }[]
  ) => void;
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

      syncBooks: (updates) => {
        const updateMap = new Map(updates.map((u) => [u.id, u]));
        set({
          items: get().items.map((item) => {
            const update = updateMap.get(item.book.id);
            if (update) {
              return {
                ...item,
                book: {
                  ...item.book,
                  available_stock: update.available_stock,
                  total_stock: update.total_stock ?? item.book.total_stock,
                  price: update.price ?? item.book.price,
                  ...(update.category ? { category: update.category } : {}),
                },
              };
            }
            return item;
          }),
        });
      },
    }),
    {
      name: 'lexora-cart-storage',
    }
  )
);
