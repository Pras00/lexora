'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QrCode, ArrowRightLeft, ArrowRight, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface AdminLoansClientProps {
  activeLoans: any[];
}

export function AdminLoansClient({ activeLoans }: AdminLoansClientProps) {
  const router = useRouter();
  const [pickupCodeInput, setPickupCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    type: 'success' | 'error';
    text: string;
    loanId?: string;
  } | null>(null);

  const supabase = createClient();

  const handleVerifyAndCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = pickupCodeInput.trim().toUpperCase();
    if (!code) return;

    setIsVerifying(true);
    setVerifyResult(null);

    try {
      // 1. Cari pickup pass
      const { data: pass, error: passError } = await supabase
        .from('pickup_passes')
        .select('*, request:loan_requests(*, user:profiles(*), items:loan_request_items(*))')
        .eq('pickup_code', code)
        .single();

      if (passError || !pass) {
        throw new Error('Kode pickup tidak ditemukan. Harap periksa kembali 6 digit kode peminjam.');
      }

      if (pass.status !== 'active') {
        throw new Error(`Kode pickup ini sudah tidak aktif (Status: ${pass.status}).`);
      }

      if (new Date(pass.expires_at) < new Date()) {
        throw new Error('Batas waktu pengambilan untuk pass ini telah kedaluwarsa.');
      }

      // 2. Buat record Loans
      const reqData = (pass as any).request;
      const { data: newLoan, error: loanError } = await supabase
        .from('loans')
        .insert({
          request_id: pass.request_id,
          user_id: reqData?.user_id,
          status: 'active',
        })
        .select()
        .single();

      if (loanError || !newLoan) {
        throw new Error(loanError?.message || 'Gagal membuat data peminjaman.');
      }

      // 3. Masukkan item-item yang approved ke loan_items (due_date default H+14)
      const approvedItems = (reqData?.items || []).filter((i: any) => i.status === 'approved');
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const loanItems = approvedItems.map((item: any) => ({
        loan_id: newLoan.id,
        book_id: item.book_id,
        due_date: dueDate.toISOString(),
        status: 'borrowed' as const,
        damage_level: 'none' as const,
        replacement_cost: 0,
      }));

      const { error: itemsError } = await supabase
        .from('loan_items')
        .insert(loanItems);

      if (itemsError) throw itemsError;

      // 4. Update status pass menjadi 'used' dan request menjadi 'completed'
      await supabase
        .from('pickup_passes')
        .update({ status: 'used', used_at: new Date().toISOString() })
        .eq('id', pass.id);

      await supabase
        .from('loan_requests')
        .update({ status: 'completed' })
        .eq('id', pass.request_id);

      setVerifyResult({
        type: 'success',
        text: `Pengambilan ${reqData?.request_number} atas nama ${reqData?.user?.full_name} berhasil dikonfirmasi! Peminjaman aktif telah dibuat.`,
        loanId: newLoan.id,
      });

      setPickupCodeInput('');
      router.refresh();
    } catch (err: any) {
      setVerifyResult({
        type: 'error',
        text: err.message || 'Gagal memproses kode pickup.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Loket Peminjaman & Pengembalian"
        description="Konfirmasi penyerahan buku fisik via kode QR dan proses pengembalian koleksi perpustakaan."
      />

      {/* Panel Scan / Input Kode Pickup di Meja Sirkulasi */}
      <div className="p-6 rounded-2xl border-2 border-indigo-500/30 bg-[var(--surface)] shadow-xs">
        <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-indigo-600" />
          <span>Loket Sirkulasi: Konfirmasi Pengambilan Buku (Pickup Pass)</span>
        </h3>
        <p className="text-xs text-[var(--foreground)] mb-4">
          Masukkan 6 digit kode pickup (contoh: <code>LIB-7F42A9</code>) yang ditunjukkan oleh anggota peminjam.
        </p>

        <form onSubmit={handleVerifyAndCreateLoan} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            required
            value={pickupCodeInput}
            onChange={(e) => setPickupCodeInput(e.target.value)}
            placeholder="Ketik kode LIB-XXXXXX..."
            className="flex-1 px-4 py-2.5 text-sm font-mono uppercase tracking-wider rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button
            type="submit"
            disabled={isVerifying || !pickupCodeInput.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            {isVerifying ? 'Memverifikasi...' : 'Konfirmasi Ambil Buku'}
          </button>
        </form>

        {verifyResult && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-start justify-between gap-3 text-xs md:text-sm ${
              verifyResult.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {verifyResult.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <span>{verifyResult.text}</span>
            </div>

            {verifyResult.loanId && (
              <Link
                href={`/admin/loans/${verifyResult.loanId}`}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                Lihat Pinjaman
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Tabel Pinjaman Aktif yang Belum Dikembalikan */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Daftar Peminjaman Fisik Sedang Berjalan ({activeLoans.length})
        </h3>

        {activeLoans.length > 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--foreground)] uppercase font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Nama Peminjam</th>
                    <th className="px-5 py-3.5">No. Anggota</th>
                    <th className="px-5 py-3.5">Jumlah Buku</th>
                    <th className="px-5 py-3.5">Tanggal Ambil</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-[var(--foreground)]">
                  {activeLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-sm">
                        {loan.user?.full_name}
                      </td>
                      <td className="px-5 py-4 font-mono text-[var(--foreground)]">
                        {loan.user?.member_number}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {loan.items?.length || 0} buku
                      </td>
                      <td className="px-5 py-4 text-[var(--foreground)]">
                        {formatDate(loan.pickup_confirmed_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={loan.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/loans/${loan.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <span>Proses Kembali</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={ArrowRightLeft}
            title="Tidak Ada Peminjaman Aktif"
            description="Semua buku pinjaman fisik saat ini telah dikembalikan ke perpustakaan."
          />
        )}
      </div>
    </div>
  );
}
