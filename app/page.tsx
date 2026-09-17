import Link from 'next/link';
import { Library, BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between">
      {/* Navbar Top */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-sm">
            <Library className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Lexora</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            Daftar Anggota
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6">
          <Library className="w-3.5 h-3.5" />
          <span>Sistem Informasi Perpustakaan Generasi Baru</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight">
          Akses Ribuan Koleksi Buku dalam <span className="text-indigo-600 dark:text-indigo-400">Satu Sentuhan</span>
        </h1>

        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mt-5 leading-relaxed">
          Eksplorasi katalog literatur, ajukan peminjaman buku dari mana saja, dan ambil fisik di loket sirkulasi dengan sistem QR Pickup Pass instan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          <Link
            href="/catalog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Katalog Buku</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            Masuk ke Portal Anggota
          </Link>
        </div>

        {/* 3 Core Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--foreground)]">Katalog Realtime</h3>
            <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
              Monitoring ketersediaan stok fisik buku secara akurat dan transparan sebelum berkunjung.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--foreground)]">Pickup Pass QR</h3>
            <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
              Pengambilan buku cepat di loket fisik tanpa antre pengisian formulir manual.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-[var(--foreground)]">Sirkulasi Tertib</h3>
            <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
              Manajemen durasi 14 hari, fasilitas perpanjangan online, dan perhitungan denda transparan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
        © 2026 Lexora Library Information System. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
