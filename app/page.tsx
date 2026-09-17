import Link from 'next/link';
import Image from 'next/image';
import {
  Library,
  BookOpen,
  Clock,
  ShieldCheck,
  ArrowRight,
  QrCode,
  CheckCircle2,
  BookmarkCheck,
  BookMarked,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LandingBackground } from '@/components/layout/LandingBackground';
import { createClient } from '@/lib/supabase/server';
import { HighlightBookCard } from '@/components/books/HighlightBookCard';
import { BookWithCategory } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredBooks: BookWithCategory[] = [];
  let user: any = null;
  let userRole: string = 'member';

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;
    userRole = user?.user_metadata?.role || 'member';

    // Ambil 6 buku unggulan terpopuler/terbaru
    const { data: books } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);

    if (books && books.length > 0) {
      featuredBooks = books as unknown as BookWithCategory[];
    }
  } catch (err) {
    console.warn('Fallback loading featured books:', err);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-clip">
      {/* Subtle patterned & ambient background decoration */}
      <LandingBackground />

      {/* Navbar Top */}
      <header className="sticky top-0 z-50 h-16 px-6 md:px-12 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-[var(--surface)]/85 backdrop-blur-md transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm hover:scale-105 transition-transform">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[var(--foreground)]">Lexora</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
              Perpustakaan Digital
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Link
              href={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Buka Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all"
              >
                Daftar Anggota
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 pt-12 pb-20 md:pt-20 md:pb-28 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
          <BookMarked className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Sistem Informasi &amp; Peminjaman Buku Generasi Baru</span>
        </div>

        {/* Big Catchy Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl text-[var(--foreground)]">
          Jelajahi Dunia Literasi dengan{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-300">
            Satu Sentuhan Mudah
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mt-5 leading-relaxed">
          Temukan ratusan literatur favorit, pantau stok buku fisik secara realtime, dan lakukan peminjaman tanpa antre menggunakan <strong>QR Pickup Pass</strong> instan.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <Link
            href="#koleksi-pilihan"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pinjam Buku Sekarang</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>
          <Link
            href="/catalog"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all shadow-xs"
          >
            <span>Buka Katalog Lengkap</span>
          </Link>
        </div>

        {/* 3D Visual Book Showcase / Fan-out Carousel */}
        <div className="mt-14 w-full max-w-4xl relative">
          {/* Subtle Backlight Glow behind book fan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-72 sm:w-[460px] sm:h-80 bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-transparent rounded-full blur-2xl pointer-events-none -z-10 dark:from-indigo-600/25 dark:via-purple-600/20" />

          <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
            {/* Left Tilt Card */}
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-xl overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300 border border-slate-200/60 dark:border-slate-800 hidden sm:block">
              <Image
                src="/covers/the-wanderers-star.jpg"
                alt="The Wanderer's Star"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>

            {/* Center Main Card */}
            <div className="relative w-44 h-64 sm:w-56 sm:h-80 rounded-2xl overflow-hidden shadow-2xl z-20 border-2 border-indigo-400/40 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/covers/stargates-echo.jpg"
                alt="Stargate's Echo"
                fill
                sizes="250px"
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-indigo-600/90 text-white text-[10px] font-bold backdrop-blur-md">
                Buku Populer
              </div>
            </div>

            {/* Right Tilt Card */}
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-xl overflow-hidden shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300 border border-slate-200/60 dark:border-slate-800 hidden sm:block">
              <Image
                src="/covers/neon-ghost.jpg"
                alt="Neon Ghost"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Pill Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              12+ Koleksi Terverifikasi
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              <QrCode className="w-3.5 h-3.5 text-indigo-500" />
              Ambil dengan QR Pickup Pass
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Durasi Pinjam 14 Hari
            </span>
          </div>
        </div>
      </section>

      {/* Section: Highlight Koleksi Pilihan Perpustakaan */}
      <section id="koleksi-pilihan" className="relative z-10 py-16 px-4 md:px-8 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Koleksi Pilihan
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-1">
                Buku Populer yang Wajib Dibaca
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Temukan buku pilihan pustakawan. Klik &ldquo;Pinjam Sekarang&rdquo; untuk langsung memesan unit buku Anda.
              </p>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors group self-start md:self-auto"
            >
              <span>Jelajahi Semua Buku di Katalog</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid Buku Unggulan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <HighlightBookCard
                key={book.id}
                book={book}
                isLoggedIn={!!user}
              />
            ))}
          </div>

          {/* Bottom CTA to catalog */}
          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--surface)] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Lihat 12 Koleksi Lengkap di Katalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section: 3 Langkah Mudah Meminjam */}
      <section className="relative z-10 py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Alur Peminjaman
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight mt-1">
            Cara Mudah Meminjam Buku di Lexora
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Sirkulasi modern tanpa antre pengisian formulir manual yang memakan waktu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[var(--surface)] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900/50 dark:text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">Pilih Buku Impian</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Jelajahi katalog buku, periksa ketersediaan stok secara realtime, dan masukkan ke keranjang pinjam Anda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[var(--surface)] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/50 dark:border-amber-900/50 dark:text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">Terima Pickup Pass QR</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Pustakawan memverifikasi pengajuan Anda dan sistem menerbitkan kartu pengambilan digital dengan kode QR unik.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-[var(--surface)] shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">Ambil Buku di Loket</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Datang ke perpustakaan fisik, tunjukkan QR Pickup Pass pada layar smartphone, dan buku siap Anda bawa pulang!
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="relative z-10 px-4 pb-16 max-w-5xl mx-auto w-full">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Mulai Pengalaman Membaca Lebih Cerdas Hari Ini
          </h2>
          <p className="text-xs md:text-sm text-indigo-100 max-w-xl mx-auto mt-2.5 leading-relaxed">
            Daftarkan diri Anda sebagai anggota perpustakaan digital Lexora untuk mengakses seluruh koleksi literatur dan fitur peminjaman mandiri.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href={user ? (userRole === 'admin' ? '/admin/dashboard' : '/dashboard') : '/register'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              {user ? 'Masuk ke Dashboard Saya' : 'Daftar Jadi Anggota Gratis'}
            </Link>
            <Link
              href="/catalog"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              Jelajahi Katalog Buku
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 md:px-12 border-t border-slate-200/80 dark:border-slate-800 bg-[var(--surface)] text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Library className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm text-[var(--foreground)]">Lexora</span>
            <span>— Sistem Informasi Perpustakaan Modern</span>
          </div>

          <p>© 2026 Lexora. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
