'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Tags, CheckCircle2, AlertCircle } from 'lucide-react';
import { Category } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface AdminCategoriesClientProps {
  categories: (Category & { booksCount: number })[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const supabase = createClient();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setMsg(null);

    // Otomatis buat slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      const { error } = await supabase.from('categories').insert({
        name: name.trim(),
        slug,
        description: description.trim() || null,
      });

      if (error) throw error;

      setMsg({ type: 'success', text: `Kategori "${name}" berhasil ditambahkan.` });
      setName('');
      setDescription('');
      router.refresh();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Gagal menambahkan kategori.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"?`)) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err: any) {
      alert('Gagal menghapus kategori: ' + (err.message || 'Kategori ini sedang memiliki buku terkait.'));
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manajemen Kategori Buku"
        description="Kelola kelompok klasifikasi koleksi literatur perpustakaan."
      />

      {msg && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs md:text-sm ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Kategori */}
        <form
          onSubmit={handleAddCategory}
          className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs h-fit"
        >
          <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Tambah Kategori Baru</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Nama Kategori *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sejarah & Biografi"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Koleksi buku mengenai..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Menambahkan...' : 'Simpan Kategori'}
          </button>
        </form>

        {/* Tabel Daftar Kategori */}
        <div className="lg:col-span-2">
          {categories.length > 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--muted)] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Nama & Slug</th>
                    <th className="px-5 py-3.5">Deskripsi</th>
                    <th className="px-5 py-3.5">Jumlah Buku</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-5 py-4 font-semibold">
                        <div>{c.name}</div>
                        <div className="text-[11px] font-mono text-[var(--muted)]">{c.slug}</div>
                      </td>
                      <td className="px-5 py-4 text-[var(--muted)] max-w-xs truncate">
                        {c.description || '-'}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--muted)] font-mono">
                          {c.booksCount} buku
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Tags}
              title="Belum Ada Kategori"
              description="Tambahkan kategori pertama Anda menggunakan formulir di sebelah kiri."
            />
          )}
        </div>
      </div>
    </div>
  );
}
