'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Shield, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

interface ProfileClientProps {
  userEmail: string;
  initialProfile: Profile | null;
}

export function ProfileClient({ userEmail, initialProfile }: ProfileClientProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialProfile) return;

    setIsLoadingProfile(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialProfile.id);

      if (error) throw error;

      router.refresh(); // Invalidate server cache so layout updates instantly
      setMessage({ type: 'success', text: 'Data profil berhasil diperbarui.' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil.' });
      } else {
        setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
      return;
    }

    setIsLoadingPassword(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Kata sandi akun Anda berhasil diganti.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage({ type: 'error', text: err.message || 'Gagal mengubah kata sandi.' });
      } else {
        setMessage({ type: 'error', text: 'Gagal mengubah kata sandi.' });
      }
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Pengaturan Profil Anggota"
        description="Kelola informasi identitas akun kartu perpustakaan dan keamanan login Anda."
      />

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs md:text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Kartu Anggota Info Box */}
      <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 via-() to-slate-50 dark:from-indigo-950/30 dark:via-() dark:to-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {fullName.charAt(0) || 'L'}
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--foreground)]">{fullName || 'Anggota'}</h3>
              <p className="text-xs text-[var(--foreground)]">{userEmail}</p>
              <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                No. Anggota: {initialProfile?.member_number || 'LX-0001'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] text-[var(--foreground)] uppercase font-semibold">Status Akun</p>
              <StatusBadge status={initialProfile?.status || 'active'} />
            </div>
            <div className="pl-3 border-l border-[var(--border)]">
              <p className="text-[10px] text-[var(--foreground)] uppercase font-semibold">No-Show</p>
              <p className="text-xs font-bold text-[var(--foreground)] mt-0.5">
                {initialProfile?.no_show_count || 0} / 3 kali
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Biodata */}
        <form
          onSubmit={handleUpdateProfile}
          className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs"
        >
          <h4 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Informasi Identitas</span>
          </h4>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Alamat Email (Akun)
            </label>
            <input
              type="email"
              disabled
              value={userEmail}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-slate-100 dark:bg-slate-800/50 text-[var(--foreground)] cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingProfile}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isLoadingProfile ? 'Menyimpan...' : 'Simpan Perubahan Data'}
          </button>
        </form>

        {/* Form Ganti Password */}
        <form
          onSubmit={handleUpdatePassword}
          className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs"
        >
          <h4 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Ubah Kata Sandi</span>
          </h4>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoadingPassword || !newPassword}
            className="w-full mt-2 py-2.5 px-4 rounded-lg border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--foreground)] text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isLoadingPassword ? 'Memproses...' : 'Perbarui Kata Sandi'}
          </button>
        </form>
      </div>
    </div>
  );
}
