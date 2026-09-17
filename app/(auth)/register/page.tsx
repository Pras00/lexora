import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Library } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthBackground } from '@/components/layout/AuthBackground';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50/70 dark:bg-slate-950 transition-colors overflow-x-clip">
      <AuthBackground />
      {/* Top Bar with ThemeToggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md mb-3">
            <Library className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Daftar Anggota Baru
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mulai jelajahi dan pinjam buku koleksi perpustakaan
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[var(--surface)] p-6 sm:p-8 shadow-sm">
          <RegisterForm />

          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
            Sudah terdaftar sebagai anggota?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[var(--muted)]">
          <Link href="/" className="hover:underline">
            ← Kembali ke Halaman Awal
          </Link>
        </div>
      </div>
    </div>
  );
}
