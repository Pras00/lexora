'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Inbox, ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { LoanRequestWithDetails } from '@/types';

interface AdminRequestsClientProps {
  initialRequests: LoanRequestWithDetails[];
}

export function AdminRequestsClient({ initialRequests }: AdminRequestsClientProps) {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredRequests = useMemo(() => {
    if (selectedStatus === 'all') return initialRequests;
    return initialRequests.filter((r) => r.status === selectedStatus);
  }, [initialRequests, selectedStatus]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Pengajuan Peminjaman"
        description="Verifikasi dan berikan persetujuan buku yang diajukan oleh para anggota perpustakaan."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-[var(--border)] w-fit text-xs font-medium">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'pending', label: 'Menunggu' },
          { id: 'approved', label: 'Disetujui' },
          { id: 'completed', label: 'Selesai (Diambil)' },
          { id: 'rejected', label: 'Ditolak' },
          { id: 'expired', label: 'Kedaluwarsa' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedStatus === tab.id
                ? 'bg-white dark:bg-slate-800 text-[var(--foreground)] font-semibold shadow-xs'
                : 'text-[var(--foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabel Pengajuan */}
      {filteredRequests.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--foreground)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">No. Pengajuan</th>
                  <th className="px-5 py-3.5">Peminjam</th>
                  <th className="px-5 py-3.5">Buku Diminta</th>
                  <th className="px-5 py-3.5">Waktu Pengajuan</th>
                  <th className="px-5 py-3.5">Batas Ambil</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[var(--foreground)]">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold">
                      {req.request_number}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm">{req.user?.full_name}</div>
                      <div className="text-[11px] font-mono text-[var(--foreground)]">
                        {req.user?.member_number}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {req.items?.length || 0} buku
                    </td>
                    <td className="px-5 py-4 text-[var(--foreground)]">
                      {formatDate(req.requested_at)}
                    </td>
                    <td className="px-5 py-4 text-[var(--foreground)]">
                      {req.pickup_deadline ? formatDate(req.pickup_deadline) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>{req.status === 'pending' ? 'Tinjau' : 'Lihat'}</span>
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
          icon={Inbox}
          title="Tidak Ada Pengajuan"
          description="Tidak ada data pengajuan peminjaman untuk status yang dipilih."
        />
      )}
    </div>
  );
}
