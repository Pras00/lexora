'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Inbox,
  ArrowRight,
  Clock,
  User,
  Calendar,
  Search,
  BookOpen,
  QrCode,
  BookmarkCheck,
  Filter,
  X,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatDateTime } from '@/lib/utils';
import { LoanRequestWithDetails } from '@/types';

interface AdminRequestsClientProps {
  initialRequests: LoanRequestWithDetails[];
}

export function AdminRequestsClient({ initialRequests }: AdminRequestsClientProps) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Hitung metrik ringkas antrean sirkulasi
  const counts = useMemo(() => {
    return {
      all: initialRequests.length,
      pending: initialRequests.filter((r) => r.status === 'pending').length,
      approved: initialRequests.filter((r) => r.status === 'approved').length,
      completed: initialRequests.filter((r) => r.status === 'completed').length,
      rejected: initialRequests.filter((r) => r.status === 'rejected').length,
      expired: initialRequests.filter((r) =>
        ['expired', 'not_picked_up', 'cancelled'].includes(r.status)
      ).length,
    };
  }, [initialRequests]);

  // Filter daftar berdasarkan tab status dan kata kunci pencarian
  const filteredRequests = useMemo(() => {
    return initialRequests.filter((req) => {
      // Filter Status
      if (selectedStatus === 'pending' && req.status !== 'pending') return false;
      if (selectedStatus === 'approved' && req.status !== 'approved') return false;
      if (selectedStatus === 'completed' && req.status !== 'completed') return false;
      if (selectedStatus === 'rejected' && req.status !== 'rejected') return false;
      if (
        selectedStatus === 'expired' &&
        !['expired', 'not_picked_up', 'cancelled'].includes(req.status)
      ) {
        return false;
      }

      // Filter Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchNumber = req.request_number?.toLowerCase().includes(query);
        const matchName = req.user?.full_name?.toLowerCase().includes(query);
        const matchMemberId = req.user?.member_number?.toLowerCase().includes(query);
        const matchBooks = req.items?.some((i) =>
          i.book?.title?.toLowerCase().includes(query)
        );

        if (!matchNumber && !matchName && !matchMemberId && !matchBooks) {
          return false;
        }
      }

      return true;
    });
  }, [initialRequests, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Pengajuan Peminjaman"
        description="Verifikasi kesiapan fisik koleksi di rak dan berikan persetujuan peminjaman anggota perpustakaan."
      />

      {/* ── 3 Kartu KPI Ringkasan Antrean Pustakawan ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Perlu Diverifikasi */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted block">
              Perlu Diverifikasi di Rak
            </span>
            <span className="text-2xl font-extrabold text-foreground font-mono block">
              {counts.pending}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block">
              Antrean menunggu verifikasi
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/50">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Siap Diambil di Loket */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted block">
              Siap Diambil di Loket
            </span>
            <span className="text-2xl font-extrabold text-foreground font-mono block">
              {counts.approved}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
              Tiket pickup pass aktif
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-900/50">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Peminjaman Selesai */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted block">
              Peminjaman Selesai
            </span>
            <span className="text-2xl font-extrabold text-foreground font-mono block">
              {counts.completed}
            </span>
            <span className="text-xs text-muted font-medium block">
              Buku fisik telah diserahkan
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 border border-border">
            <BookmarkCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Toolbar: Filter Status Tabs + Kolom Pencarian Cepat ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-surface-secondary/80 border border-border text-xs font-medium">
          {[
            { id: 'all', label: 'Semua', count: counts.all },
            { id: 'pending', label: 'Menunggu', count: counts.pending },
            { id: 'approved', label: 'Disetujui', count: counts.approved },
            { id: 'completed', label: 'Selesai', count: counts.completed },
            { id: 'rejected', label: 'Ditolak', count: counts.rejected },
            { id: 'expired', label: 'Kedaluwarsa', count: counts.expired },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-surface text-foreground font-bold shadow-2xs border border-border/80'
                    : 'text-muted hover:text-foreground hover:bg-surface/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-secondary text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar Real-Time */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari No. Pengajuan / Peminjam..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabel Pengajuan Terstruktur ── */}
      {filteredRequests.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-secondary/70 border-b border-border text-muted text-xs font-semibold">
                <tr>
                  <th className="px-5 py-3 text-left">No. Pengajuan</th>
                  <th className="px-5 py-3 text-left">Peminjam</th>
                  <th className="px-5 py-3 text-left">Koleksi Diminta</th>
                  <th className="px-5 py-3 text-center">Waktu Pengajuan</th>
                  <th className="px-5 py-3 text-center">Batas Waktu</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-foreground">
                {filteredRequests.map((req) => {
                  const bookItems = req.items || [];
                  const isPending = req.status === 'pending';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-surface-secondary/40 transition-colors"
                    >
                      {/* No. Pengajuan */}
                      <td className="px-5 py-3.5 text-left font-mono font-bold text-xs sm:text-sm text-foreground">
                        {req.request_number}
                      </td>

                      {/* Identitas Peminjam */}
                      <td className="px-5 py-3.5 text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {req.user?.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">
                              {req.user?.full_name}
                            </div>
                            <div className="text-xs font-mono text-muted">
                              {req.user?.member_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Koleksi Buku Diminta + Mini Cover Stacks */}
                      <td className="px-5 py-3.5 text-left">
                        <div className="flex items-center gap-2.5">
                          {/* Mini Stacks Cover */}
                          <div className="flex items-center -space-x-3 shrink-0">
                            {bookItems.slice(0, 3).map((item, idx) => (
                              <div
                                key={item.id}
                                style={{ zIndex: 10 - idx }}
                                className="relative w-6 h-8 rounded-md overflow-hidden bg-surface-secondary border border-surface shadow-xs shrink-0"
                              >
                                {item.book?.cover_url ? (
                                  <Image
                                    src={item.book.cover_url}
                                    alt={item.book.title}
                                    fill
                                    sizes="24px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-slate-400">
                                    <BookOpen className="w-3 h-3 opacity-40" />
                                  </div>
                                )}
                                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                              </div>
                            ))}
                          </div>

                          <div className="text-left">
                            <span className="font-bold text-foreground block">
                              {bookItems.length} Buku
                            </span>
                            <span className="text-xs text-muted truncate max-w-44 block">
                              {bookItems[0]?.book?.title || 'Koleksi Perpustakaan'}
                              {bookItems.length > 1 ? ` (+${bookItems.length - 1})` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Waktu Pengajuan */}
                      <td className="px-5 py-3.5 text-center text-muted">
                        <span className="font-medium text-foreground block">
                          {formatDate(req.requested_at)}
                        </span>
                        <span className="text-xs text-muted block">
                          {new Date(req.requested_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })} WIB
                        </span>
                      </td>

                      {/* Batas Ambil / Batas Verifikasi */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex justify-center">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>Tenggat 24 Jam</span>
                            </span>
                          ) : req.pickup_deadline && req.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Batas: {formatDate(req.pickup_deadline)}</span>
                            </span>
                          ) : (
                            <span className="text-muted text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex justify-center">
                          <StatusBadge status={req.status} />
                        </div>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex justify-center">
                          <Link
                            href={`/admin/requests/${req.id}`}
                            className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                              isPending
                                ? 'bg-primary text-white hover:bg-primary-hover shadow-2xs active:scale-95'
                                : 'border border-border bg-surface-secondary text-foreground hover:bg-surface-secondary/80'
                            }`}
                          >
                            <span>{isPending ? 'Verifikasi' : 'Rincian'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
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
          icon={Inbox}
          title="Tidak Ada Pengajuan Ditemukan"
          description={
            searchQuery
              ? `Tidak ada pengajuan yang cocok dengan pencarian "${searchQuery}".`
              : 'Tidak ada data pengajuan peminjaman untuk kategori filter yang dipilih.'
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
  );
}
