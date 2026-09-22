'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validations/auth.schema';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const supabase = createClient();

  const {
    register,
    handleSubmit,
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
        setErrorMsg(error.message === 'Invalid login credentials' 
          ? 'Email atau password yang Anda masukkan salah.' 
          : error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Jika ada redirectTo (misalnya alur pinjam buku), gunakan itu.
        // Jika login normal, kembalikan ke halaman awal ('/').
        const targetUrl = redirectTo || '/';

        // Gunakan full navigation untuk memastikan state session Next.js terbarui tanpa race condition
        window.location.href = targetUrl;
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
          Alamat Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="email"
            {...register('email')}
            placeholder="nama@email.com"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--foreground)]">
            Kata Sandi
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lupa sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--foreground)] pointer-events-none" />
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-xs disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Lexora</span>
          </>
        )}
      </button>
    </form>
  );
}
