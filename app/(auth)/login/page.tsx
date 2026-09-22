import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Library } from 'lucide-react';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthBackground } from '@/components/layout/AuthBackground';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[var(--surface)] transition-colors overflow-x-clip">
      <AuthBackground />
      {/* Top Bar with ThemeToggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 mb-4">
            <Library className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Masuk ke Lexora
          </h2>
          <p className="text-sm font-medium text-[var(--foreground)] mt-2">
            Sistem Informasi & Peminjaman Perpustakaan
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs font-medium text-[var(--foreground)]">Memuat formulir...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center text-sm font-medium text-[var(--foreground)]">
            Belum memiliki kartu anggota?{' '}
            <Link
              href="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline transition-colors"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-[var(--foreground)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            ← Kembali ke Halaman Awal
          </Link>
        </div>
      </div>
    </div>
  );
}
