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
      <div className="p-6 text-center rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">Pendaftaran Berhasil!</h3>
        <p className="text-xs text-muted mt-1.5 leading-relaxed">
          Tautan verifikasi email telah dikirim ke alamat email Anda. Silakan periksa kotak masuk (atau folder spam) untuk mengaktifkan akun.
        </p>
        <Link
          href="/login"
          className="inline-block mt-4 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl transition-all shadow-xs"
        >
          Ke Halaman Masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Nama Lengkap */}
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
            className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="email"
            {...register('email')}
            placeholder="pras@email.com"
            className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Nomor Telepon */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          Nomor Telepon (Opsional)
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="tel"
            {...register('phone')}
            placeholder="081234567890"
            className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone.message}</p>
        )}
      </div>

      {/* Kata Sandi */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          Kata Sandi
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Minimal 6 karakter"
            className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-2.5 text-muted hover:text-foreground transition-colors cursor-pointer"
            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Ulangi Kata Sandi */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          Ulangi Kata Sandi
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-2.5 text-muted hover:text-foreground transition-colors cursor-pointer"
            title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
