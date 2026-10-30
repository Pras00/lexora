'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validations/auth.schema';

export function LoginForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMsg(
          result.error || 'Email atau kata sandi yang Anda masukkan salah.'
        );
        setIsLoading(false);
        return;
      }

      // Berhasil autentikasi, navigasikan ke URL tujuan
      const targetUrl = redirectTo || result.redirectPath || '/dashboard';
      router.push(targetUrl);
      router.refresh();
    } catch {
      setErrorMsg(
        'Gagal menghubungkan ke layanan autentikasi. Silakan periksa koneksi internet Anda.'
      );
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Email input */}
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
          <p className="text-[11px] text-rose-500 mt-0.5 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password input with eye toggle */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-foreground">
            Kata Sandi
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lupa sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-muted pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-muted hover:text-foreground transition-colors cursor-pointer"
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
          <p className="text-[11px] text-rose-500 mt-0.5 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun</span>
          </>
        )}
      </button>

      {/* Demo Account Quick Pick */}
      <div className="pt-2.5 border-t border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-muted">Akses Cepat Akun Demo:</span>
          <span className="text-[10px] text-muted">Klik untuk isi otomatis</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('admin@lexora.id', 'admin12345')}
            className="px-2.5 py-1.5 rounded-xl border border-border hover:border-primary/50 bg-surface-secondary/50 hover:bg-surface-secondary text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pustakawan</span>
            </div>
            <p className="text-[10px] text-muted font-mono truncate mt-0.5 group-hover:text-foreground transition-colors">
              admin@lexora.id
            </p>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount('member@lexora.id', 'member12345')}
            className="px-2.5 py-1.5 rounded-xl border border-border hover:border-emerald-500/50 bg-surface-secondary/50 hover:bg-surface-secondary text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Anggota</span>
            </div>
            <p className="text-[10px] text-muted font-mono truncate mt-0.5 group-hover:text-foreground transition-colors">
              member@lexora.id
            </p>
          </button>
        </div>
      </div>
    </form>
  );
}
