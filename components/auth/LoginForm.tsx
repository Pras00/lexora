'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
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
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const supabase = createClient();

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMsg(
          error.message === 'Invalid login credentials'
            ? 'Email atau password yang Anda masukkan salah.'
            : error.message
        );
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const targetUrl = redirectTo || '/';
        window.location.href = targetUrl;
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.');
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Email input */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1.5">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="email"
            {...register('email')}
            placeholder="nama@email.com"
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password input with eye toggle */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
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
          <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border bg-surface-secondary text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3 text-muted hover:text-foreground transition-colors cursor-pointer"
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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

      {/* Demo Account Quick Pick (Reference Image Style) */}
      <div className="pt-3 border-t border-border">
        <p className="text-[11px] font-semibold text-muted mb-2">
          Pilih Akun Demo (Klik untuk isi cepat):
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('admin@lexora.id', 'password123')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface-secondary text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Pustakawan</span>
            </div>
            <p className="text-[10px] text-muted truncate mt-0.5">admin@lexora.id</p>
          </button>

          <button
            type="button"
            onClick={() => fillDemoAccount('user@lexora.id', 'password123')}
            className="p-2.5 rounded-xl border border-border bg-surface-secondary/70 hover:bg-surface-secondary text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Anggota</span>
            </div>
            <p className="text-[10px] text-muted truncate mt-0.5">user@lexora.id</p>
          </button>
        </div>
      </div>
    </form>
  );
}
