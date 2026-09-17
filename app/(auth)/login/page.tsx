import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Library } from 'lucide-react';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md mb-3">
            <Library className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Masuk ke Lexora
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            Sistem Informasi & Peminjaman Perpustakaan
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-[var(--muted)]">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
            Belum memiliki kartu anggota?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[var(--muted)]">
          <Link href="/catalog" className="hover:underline">
            ← Kembali ke Katalog Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
