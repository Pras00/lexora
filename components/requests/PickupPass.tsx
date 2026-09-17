'use client';

import QRCode from 'react-qr-code';
import { QrCode, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface PickupPassProps {
  pass: {
    pickup_code: string;
    status: string;
    expires_at: string;
  };
  requestNumber: string;
}

export function PickupPass({ pass, requestNumber }: PickupPassProps) {
  const isExpired = new Date(pass.expires_at) < new Date();
  const isActive = pass.status === 'active' && !isExpired;

  return (
    <div className="rounded-2xl border-2 border-indigo-500/30 bg-[var(--surface)] p-6 shadow-sm overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Kartu Pengambilan Buku (Pickup Pass)
          </span>
          <h3 className="text-lg font-bold text-[var(--foreground)] mt-0.5">
            {requestNumber}
          </h3>
        </div>
        <StatusBadge status={isActive ? 'approved' : pass.status} />
      </div>

      {/* QR Code & Kode Manual */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-6 justify-center">
        {/* Box QR Code */}
        <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
          <QRCode
            value={pass.pickup_code}
            size={140}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Info Kode */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-[var(--muted)] font-medium">KODE PENGAMBILAN:</p>
          <p className="text-3xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider my-1">
            {pass.pickup_code}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Batas Ambil: {formatDateTime(pass.expires_at)}</span>
          </div>
        </div>
      </div>

      {/* Petunjuk Penggunaan */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[var(--border)] flex items-start gap-3 text-xs text-[var(--muted)] leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Tunjukkan kode QR atau 6 karakter kode di atas kepada pustakawan di meja sirkulasi fisik perpustakaan sebelum batas waktu berakhir.
        </p>
      </div>
    </div>
  );
}
