'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { UserPlus, User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validations/auth.schema';
import { createClient } from '@/lib/supabase/client';

export function RegisterForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            phone: values.phone || null,
            role: 'member',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setIsSuccess(true);
      }
    } catch {
      setErrorMsg('Gagal memproses pendaftaran. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 text-center rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">Pendaftaran Berhasil!</h3>
        <p className="text-xs text-[var(--foreground)] mt-1.5 leading-relaxed">
          Tautan verifikasi email telah dikirim ke alamat email Anda. Silakan periksa kotak masuk (atau folder spam) untuk mengaktifkan akun.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Nama Lengkap
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="text"
            {...register('fullName')}
            placeholder="Pras Santoso"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="email"
            {...register('email')}
            placeholder="pras@email.com"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Nomor Telepon (Opsional)
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="tel"
            {...register('phone')}
            placeholder="081234567890"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Kata Sandi
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="password"
            {...register('password')}
            placeholder="Minimal 6 karakter"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Ulangi Kata Sandi
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="password"
            {...register('confirmPassword')}
            placeholder="••••••••"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-xs disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Daftar Jadi Anggota</span>
          </>
        )}
      </button>
    </form>
  );
}
