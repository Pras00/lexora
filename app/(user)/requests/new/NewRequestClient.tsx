'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, BookOpen, Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { createClient } from '@/lib/supabase/client';

export function NewRequestClient() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center text-xs text-[var(--muted)]">Memuat keranjang...</div>;
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader
          title="Keranjang Peminjaman"
          description="Daftar buku yang ingin Anda ajukan untuk dipinjam."
        />
        <EmptyState
          icon={BookOpen}
          title="Keranjang Anda Masih Kosong"
          description="Pilih buku-buku yang ingin Anda pinjam dari katalog perpustakaan."
          action={
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Jelajahi Katalog Buku</span>
            </Link>
          }
        />
      </div>
    );
  }

  const handleSubmitRequest = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirectTo=/requests/new');
        return;
      }

      // 1. Cek apakah user memiliki denda yang belum dibayar
      const { data: unpaidFines } = await supabase
        .from('fines')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'unpaid');

      if (unpaidFines && unpaidFines.length > 0) {
        setErrorMsg('Anda memiliki denda yang belum diselesaikan. Harap lunasi denda sebelum mengajukan peminjaman baru.');
        setIsLoading(false);
        return;
      }

      // 2. Cek apakah user sedang ditangguhkan (suspended)
      const { data: profile } = await supabase
        .from('profiles')
        .select('status, suspended_until')
        .eq('id', user.id)
        .single();

      if (profile?.status === 'suspended') {
        const until = profile.suspended_until ? new Date(profile.suspended_until).toLocaleDateString('id-ID') : 'beberapa hari ke depan';
        setErrorMsg(`Akun Anda sedang ditangguhkan hingga ${until} karena riwayat no-show 3x.`);
        setIsLoading(false);
        return;
      }

      // 3. Simpan Loan Request ke database
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Auto-expire 24 jam

      const { data: request, error: reqError } = await supabase
        .from('loan_requests')
        .insert({
          user_id: user.id,
          status: 'pending',
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (reqError || !request) {
        throw new Error(reqError?.message || 'Gagal membuat pengajuan peminjaman.');
      }

      // 4. Masukkan item-item buku
      const requestItems = items.map((item) => ({
        request_id: request.id,
        book_id: item.book.id,
        status: 'pending' as const,
      }));

      const { error: itemsError } = await supabase
        .from('loan_request_items')
        .insert(requestItems);

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      // Sukses: Bersihkan keranjang dan alihkan ke detail pengajuan
      clearCart();
      router.push(`/requests/${request.id}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konfirmasi Pengajuan Peminjaman"
        description="Periksa kembali buku yang Anda pilih sebelum mengirimkan pengajuan ke petugas sirkulasi."
      />

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Daftar Buku di Keranjang */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Buku yang Diajukan ({items.length} dari maks 5)
            </h3>
            <button
              onClick={clearCart}
              className="text-xs text-[var(--muted)] hover:text-red-600 transition-colors"
            >
              Kosongkan Keranjang
            </button>
          </div>

          <div className="space-y-3">
            {items.map(({ book }) => (
              <div
                key={book.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all"
              >
                <div className="relative w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={book.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-[var(--foreground)] truncate">
                    {book.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{book.author}</p>
                  <p className="text-[11px] font-mono text-[var(--muted)] mt-1">
                    ISBN: {book.isbn}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(book.id)}
                  className="p-2 text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Hapus buku ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Aturan & Submit */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">Ketentuan Peminjaman</h4>
            
            <ul className="text-xs text-[var(--muted)] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Durasi peminjaman default adalah <strong>14 hari kalender</strong> sejak buku fisik diambil.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Setelah disetujui, Anda memiliki <strong>2 hari kerja</strong> untuk mengambil buku di perpustakaan.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Denda keterlambatan sebesar <strong>Rp 1.000 / buku / hari</strong> dihitung H+1 setelah jatuh tempo.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={handleSubmitRequest}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Kirim Pengajuan Peminjaman</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
