'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validations/auth.schema';
import { createClient } from '@/lib/supabase/client';

export function RegisterForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <div className="p-5 text-center rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground">Pendaftaran Berhasil!</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Tautan verifikasi telah dikirim ke email Anda. Silakan periksa kotak masuk untuk mengaktifkan akun.
        </p>
        <Link
          href="/login"
          className="inline-block mt-3 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-xs"
        >
          Ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Row 1: Nama Lengkap (Full Width) */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          Nama Lengkap
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            {...register('fullName')}
            placeholder="Pras Santoso"
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {errors.fullName && (
          <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.fullName.message}</p>
        )}
      </div>

      {/* Row 2: Email & Nomor Telepon (2 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="email"
              {...register('email')}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Telepon <span className="text-[10px] font-normal text-muted">(Opsional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="tel"
              {...register('phone')}
              placeholder="081234567890"
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Kata Sandi & Ulangi Kata Sandi (2 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Min. 6 karakter"
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-muted hover:text-foreground transition-colors cursor-pointer"
              title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Ulangi Sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 top-2.5 text-muted hover:text-foreground transition-colors cursor-pointer"
              title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
