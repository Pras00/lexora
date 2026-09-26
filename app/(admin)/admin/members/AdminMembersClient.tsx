'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Search, ArrowRight, ShieldCheck, AlertTriangle, Ban } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SearchInput } from '@/components/shared/SearchInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { Profile } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AdminMembersClientProps {
  initialMembers: Profile[];
}

export function AdminMembersClient({ initialMembers }: AdminMembersClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.full_name.toLowerCase().includes(q) ||
          m.member_number.toLowerCase().includes(q) ||
          (m.phone && m.phone.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [initialMembers, search, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: 'active' | 'suspended' | 'blocked') => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'suspended') {
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + 7);
        updateData.suspended_until = suspendedUntil.toISOString();
      } else {
        updateData.suspended_until = null;
        if (newStatus === 'active') {
          updateData.no_show_count = 0; // Reset no show count saat diaktifkan kembali
        }
      }

      await supabase.from('profiles').update(updateData).eq('id', id);
      router.refresh();
    } catch (err) {
      alert('Gagal memperbarui status anggota.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Anggota Perpustakaan"
        description="Pantau status keaktifan kartu anggota dan riwayat kepatuhan sirkulasi."
      />

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama, no. anggota (LX-XXXX)..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan (Suspended)</option>
            <option value="blocked">Diblokir</option>
          </select>
        </div>
      </div>

      {/* Tabel Anggota */}
      {filteredMembers.length > 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-[var(--border)] text-[var(--foreground)] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Nama & No. Anggota</th>
                  <th className="px-5 py-3.5">Telepon</th>
                  <th className="px-5 py-3.5">Tanggal Bergabung</th>
                  <th className="px-5 py-3.5">No-Show</th>
                  <th className="px-5 py-3.5">Status Akun</th>
                  <th className="px-5 py-3.5 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[var(--foreground)]">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-4 font-semibold">
                      <div className="text-sm">{m.full_name}</div>
                      <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                        {m.member_number}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--foreground)]">
                      {m.phone || '-'}
                    </td>
                    <td className="px-5 py-4 text-[var(--foreground)]">
                      {formatDate(m.created_at)}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      <span className={m.no_show_count >= 3 ? 'text-red-600 font-bold' : ''}>
                        {m.no_show_count} / 3
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'active')}
                            className="px-2.5 py-1 text-xs rounded border border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium"
                          >
                            Aktifkan
                          </button>
                        )}
                        {m.status === 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'suspended')}
                            className="px-2.5 py-1 text-xs rounded border border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-medium"
                          >
                            Suspend 7 Hari
                          </button>
                        )}
                        {m.status !== 'blocked' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'blocked')}
                            className="px-2.5 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                          >
                            Blokir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Tidak Ada Anggota"
          description="Data anggota tidak ditemukan untuk kriteria pencarian ini."
        />
      )}
    </div>
  );
}
