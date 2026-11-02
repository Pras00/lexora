'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Edit3,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { Category } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';

interface AdminCategoriesClientProps {
  categories: (Category & { booksCount: number })[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<(Category & { booksCount: number }) | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter daftar kategori berdasarkan pencarian nama atau slug
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const handleStartEdit = (cat: Category & { booksCount: number }) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setMsg(null);

    try {
      if (editingCategory) {
        // Mode Edit Kategori
        const res = await updateCategory(editingCategory.id, name, description);
        if (!res.success) {
          setMsg({ type: 'error', text: res.error || 'Gagal memperbarui kategori.' });
          return;
        }

        setMsg({ type: 'success', text: `Kategori "${name}" berhasil diperbarui.` });
        handleCancelEdit();
      } else {
        // Mode Tambah Kategori Baru
        const res = await createCategory(name, description);
        if (!res.success) {
          setMsg({ type: 'error', text: res.error || 'Gagal menambahkan kategori.' });
          return;
        }

        setMsg({ type: 'success', text: `Kategori "${name}" berhasil ditambahkan.` });
        setName('');
        setDescription('');
      }

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setMsg({ type: 'error', text: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?`)) return;

    try {
      const res = await deleteCategory(id);
      if (!res.success) {
        alert(res.error || 'Gagal menghapus kategori.');
        return;
      }

      if (editingCategory?.id === id) {
        handleCancelEdit();
      }

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kategori ini sedang memiliki buku terkait.';
      alert('Gagal menghapus kategori: ' + message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Kategori Buku"
        description="Kelola kelompok klasifikasi koleksi literatur fisik perpustakaan."
      />

      {/* Notifikasi Status Aksi */}
      {msg && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 text-xs shadow-2xs transition-all ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed font-medium">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Formulir Tambah / Edit Kategori */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-4 lg:sticky lg:top-20"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              {editingCategory ? (
                <Edit3 className="w-4 h-4 text-primary" />
              ) : (
                <Plus className="w-4 h-4 text-primary" />
              )}
              <h3 className="text-sm font-semibold text-foreground">
                {editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
              </h3>
            </div>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-muted hover:text-foreground font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nama Kategori <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sejarah & Biografi"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan cakupan topik buku dalam kategori ini..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {editingCategory
              ? isLoading
                ? 'Menyimpan Perubahan...'
                : 'Perbarui Kategori'
              : isLoading
                ? 'Menambahkan...'
                : 'Simpan Kategori'}
          </button>
        </form>

        {/* Kolom Kanan: Tabel Daftar Kategori & Search Filter */}
        <div className="lg:col-span-2 space-y-3">
          {/* Toolbar Ringkas: Jumlah Kategori & Kolom Pencarian */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-surface shadow-xs">
            <span className="text-xs text-muted">
              Menampilkan{' '}
              <strong className="font-semibold text-foreground">
                {filteredCategories.length}
              </strong>{' '}
              dari {categories.length} kategori
            </span>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau slug... (Esc)"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-2xs transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground cursor-pointer"
                  title="Bersihkan pencarian"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tabel Kategori Terstruktur dengan Scroll Internal & Sticky Header */}
          {filteredCategories.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
              <div className="overflow-x-auto overflow-y-auto max-h-128">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-surface-secondary border-b border-border text-muted font-semibold text-xs shadow-2xs">
                    <tr>
                      <th className="px-5 py-3.5 bg-surface-secondary">Kategori & Slug</th>
                      <th className="px-5 py-3.5 bg-surface-secondary">Deskripsi</th>
                      <th className="px-5 py-3.5 text-center bg-surface-secondary">Jumlah Koleksi</th>
                      <th className="px-5 py-3.5 text-right bg-surface-secondary">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {filteredCategories.map((c) => {
                      const isEditing = editingCategory?.id === c.id;

                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-surface-secondary/40 transition-colors ${
                            isEditing ? 'bg-primary/5' : ''
                          }`}
                        >
                          {/* Nama & Slug */}
                          <td className="px-5 py-3.5 min-w-48">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Tag className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-foreground text-xs block truncate">
                                  {c.name}
                                </span>
                                <span className="text-xs font-mono text-muted block mt-0.5">
                                  /{c.slug}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Deskripsi */}
                          <td className="px-5 py-3.5 text-muted max-w-xs leading-relaxed">
                            <span className="line-clamp-2">{c.description || '-'}</span>
                          </td>

                          {/* Jumlah Buku */}
                          <td className="px-5 py-3.5 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-secondary text-muted border border-border">
                              <BookOpen className="w-3 h-3 text-muted shrink-0" />
                              <span>
                                <strong className="font-semibold text-foreground">
                                  {c.booksCount}
                                </strong>{' '}
                                koleksi
                              </span>
                            </div>
                          </td>

                          {/* Aksi */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(c)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer shadow-2xs ${
                                  isEditing
                                    ? 'border-primary bg-primary/15 text-primary'
                                    : 'border-border bg-surface hover:bg-surface-secondary text-muted hover:text-foreground'
                                }`}
                                title="Ubah Data Kategori"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(c.id, c.name)}
                                className="p-1.5 rounded-lg border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted hover:text-rose-600 transition-colors cursor-pointer"
                                title="Hapus Kategori"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="Tidak Ada Kategori Ditemukan"
              description={
                searchQuery
                  ? `Tidak ada kategori yang cocok dengan pencarian "${searchQuery}".`
                  : 'Belum ada data kelompok kategori literatur yang terdaftar.'
              }
              action={
                searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-surface-secondary hover:bg-surface-secondary/80 text-foreground border border-border transition-all cursor-pointer"
                  >
                    <span>Hapus Kata Kunci Pencarian</span>
                  </button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
