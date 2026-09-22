'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema, BookInput } from '@/lib/validations/book.schema';
import { Category, Book } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BookFormProps {
  categories: Category[];
  initialData?: Book | null;
  isEditing?: boolean;
}

export function BookForm({ categories, initialData, isEditing = false }: BookFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          author: initialData.author,
          isbn: initialData.isbn,
          categoryId: initialData.category_id,
          publisher: initialData.publisher || '',
          publishedYear: initialData.published_year || undefined,
          description: initialData.description || '',
          coverUrl: initialData.cover_url || '',
          price: initialData.price,
          totalStock: initialData.total_stock,
          status: initialData.status,
        }
      : {
          price: 150000,
          totalStock: 3,
          status: 'active',
        },
  });

  const onSubmit = async (values: BookInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isEditing && initialData) {
        // Hitung selisih total_stock untuk menyesuaikan available_stock
        const stockDiff = values.totalStock - initialData.total_stock;
        const newAvailableStock = Math.max(0, initialData.available_stock + stockDiff);

        const { error } = await supabase
          .from('books')
          .update({
            title: values.title,
            author: values.author,
            isbn: values.isbn,
            category_id: values.categoryId,
            publisher: values.publisher || null,
            published_year: values.publishedYear || null,
            description: values.description || null,
            cover_url: values.coverUrl || null,
            price: values.price,
            total_stock: values.totalStock,
            available_stock: newAvailableStock,
            status: values.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('books').insert({
          title: values.title,
          author: values.author,
          isbn: values.isbn,
          category_id: values.categoryId,
          publisher: values.publisher || null,
          published_year: values.publishedYear || null,
          description: values.description || null,
          cover_url: values.coverUrl || null,
          price: values.price,
          total_stock: values.totalStock,
          available_stock: values.totalStock,
          status: values.status,
        });

        if (error) throw error;
      }

      router.push('/admin/books');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data buku.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/admin/books"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Daftar Buku
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-5"
      >
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Judul Buku *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Contoh: Clean Architecture"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Pengarang / Penulis *
            </label>
            <input
              type="text"
              {...register('author')}
              placeholder="Contoh: Robert C. Martin"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Nomor ISBN *
            </label>
            <input
              type="text"
              {...register('isbn')}
              placeholder="Contoh: 978-0134494166"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.isbn && <p className="text-xs text-red-500 mt-1">{errors.isbn.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Kategori Koleksi *
            </label>
            <select
              {...register('categoryId')}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Penerbit
            </label>
            <input
              type="text"
              {...register('publisher')}
              placeholder="Contoh: Prentice Hall"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Tahun Terbit
            </label>
            <input
              type="number"
              {...register('publishedYear')}
              placeholder="Contoh: 2018"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Harga Buku (Nilai Ganti Rugi) *
            </label>
            <input
              type="number"
              {...register('price')}
              placeholder="150000"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Total Stok Buku Fisik *
            </label>
            <input
              type="number"
              {...register('totalStock')}
              placeholder="5"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.totalStock && <p className="text-xs text-red-500 mt-1">{errors.totalStock.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Status Katalog
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="active">Aktif (Tampil di Katalog)</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              URL Gambar Sampul (Cover URL)
            </label>
            <input
              type="url"
              {...register('coverUrl')}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.coverUrl && <p className="text-xs text-red-500 mt-1">{errors.coverUrl.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Sinopsis / Deskripsi Buku
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Tuliskan ringkasan isi buku..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
          <Link
            href="/admin/books"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambahkan Buku'}
          </button>
        </div>
      </form>
    </div>
  );
}
