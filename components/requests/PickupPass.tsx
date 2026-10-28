'use client';

import QRCode from 'react-qr-code';
import { Clock, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { LexoraMark } from '@/components/shared/LexoraLogo';

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
    <div className="rounded-2xl border-2 border-primary/30 bg-surface p-6 shadow-xs overflow-hidden relative">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <LexoraMark className="w-9 h-9" />
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Kartu Pengambilan Buku (Pickup Pass)
            </span>
            <h3 className="text-lg font-bold text-foreground mt-0.5">
              {requestNumber}
            </h3>
          </div>
        </div>
        <StatusBadge status={isActive ? 'approved' : pass.status} />
      </div>

      {/* QR Code & Kode Manual */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-6 justify-center">
        {/* Box QR Code */}
        <div className="p-3 bg-white rounded-xl shadow-xs border border-border">
          <QRCode
            value={pass.pickup_code}
            size={140}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            viewBox="0 0 256 256"
          />
        </div>

        {/* Info Kode */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-muted font-medium">KODE PENGAMBILAN:</p>
          <p className="text-3xl font-mono font-extrabold text-primary tracking-wider my-1">
            {pass.pickup_code}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Batas Ambil: {formatDateTime(pass.expires_at)}</span>
          </div>
        </div>
      </div>

      {/* Petunjuk Penggunaan */}
      <div className="p-3.5 rounded-xl bg-surface-secondary border border-border flex items-start gap-3 text-xs text-foreground leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Tunjukkan kode QR atau 6 karakter kode di atas kepada pustakawan di meja sirkulasi fisik perpustakaan sebelum batas waktu berakhir.
        </p>
      </div>
    </div>
  );
}
