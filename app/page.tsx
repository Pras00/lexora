import Link from 'next/link';
import Image from 'next/image';
import {
  Library,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserMenu } from '@/components/layout/UserMenu';
import { createClient } from '@/lib/supabase/server';
import { HighlightBookCard } from '@/components/books/HighlightBookCard';
import { User } from '@supabase/supabase-js';
import { BookWithCategory, Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredBooks: BookWithCategory[] = [];
  let user: User | null = null;
  let userRole: string = 'member';
  let userProfile: Profile | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    user = authUser;
    userRole = user?.user_metadata?.role || 'member';

    if (user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (prof) userProfile = prof as Profile;
    }

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 px-6 md:px-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md transition-colors">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Library className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Lexora</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <UserMenu
              user={{
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata,
                profile: userProfile,
              }}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto w-full relative">
        {/* Soft Background Blob (Subtle, not AI Slop) */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Teks */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              PERPUSTAKAAN DIGITAL MODERN
            </div>

            <h1 className="font-extrabold leading-[1.15] tracking-tight text-[var(--foreground)] text-4xl sm:text-5xl lg:text-6xl">
              Jelajahi Dunia{' '}
              <span className="text-indigo-600 dark:text-indigo-400">Literasi</span>
              <br />
              dengan Mudah
            </h1>

            <p className="text-base sm:text-lg text-[var(--foreground)] max-w-lg leading-relaxed mt-6">
              Temukan ratusan literatur favorit, pantau stok buku fisik secara realtime, dan lakukan peminjaman tanpa antre menggunakan{' '}
              <strong className="text-[var(--foreground)] font-semibold">QR Pickup Pass</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
              <Link
                href="#koleksi-pilihan"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pinjam Buku Sekarang</span>
              </Link>
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold border-2 border-[var(--border)] text-[var(--foreground)] rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-colors"
              >
                <span>Lihat Katalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-12 pt-8 border-t border-[var(--border)]">
              <div>
                <p className="text-2xl font-extrabold text-[var(--foreground)]">500+</p>
                <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">Koleksi Buku</p>
              </div>
              <div className="w-px h-10 bg-[var(--surface)]" />
              <div>
                <p className="text-2xl font-extrabold text-[var(--foreground)]">14 Hari</p>
                <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">Durasi Pinjam</p>
              </div>
              <div className="w-px h-10 bg-[var(--surface)]" />
              <div>
                <p className="text-2xl font-extrabold text-[var(--foreground)]">QR Pass</p>
                <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">Pickup Instan</p>
              </div>
            </div>
          </div>

          {/* Right — Book Fan Showcase */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="flex items-end justify-center gap-4 py-8">
              {/* Left card */}
              <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden border border-[var(--border)] transform -rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block shadow-lg bg-[var(--surface)]">
                <Image src="/covers/the-wanderers-star.jpg" alt="The Wanderer's Star" fill sizes="200px" className="object-cover" />
              </div>

              {/* Center card */}
              <div className="relative w-48 h-64 sm:w-56 sm:h-80 rounded-xl overflow-hidden ring-4 ring-[var(--surface)] shadow-xl transform hover:-translate-y-2 transition-transform duration-300 z-10 bg-[var(--surface)]">
                <Image src="/covers/stargates-echo.jpg" alt="Stargate's Echo" fill sizes="250px" className="object-cover" priority />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase">
                  Populer
                </div>
              </div>

              {/* Right card */}
              <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-xl overflow-hidden border border-[var(--border)] transform rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block shadow-lg bg-[var(--surface)]">
                <Image src="/covers/neon-ghost.jpg" alt="Neon Ghost" fill sizes="200px" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Koleksi Pilihan ─────────────────────────────────────── */}
      <section id="koleksi-pilihan" className="px-6 md:px-10 py-20 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-bold tracking-wide mb-4">
                KOLEKSI PILIHAN
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Buku Populer
              </h2>
              <p className="text-[var(--foreground)] mt-2 max-w-md leading-relaxed">
                Temukan buku pilihan pustakawan. Klik &quot;Pinjam Sekarang&quot; untuk langsung memesan.
              </p>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group transition-colors"
            >
              <span>Jelajahi Semua Buku</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredBooks.map((book) => (
              <HighlightBookCard key={book.id} book={book} isLoggedIn={!!user} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold bg-[var(--surface)] border-2 border-[var(--border)] text-[var(--foreground)] rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lihat Katalog Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 Langkah ───────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              Tiga Langkah Sederhana
            </h2>
            <p className="text-[var(--foreground)] mt-4 leading-relaxed">
              Proses peminjaman buku kini jauh lebih mudah dan modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-transparent via-indigo-200 dark:via-indigo-900 to-transparent -z-10" />
            
            {/* Step 1 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 text-center shadow-sm relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">Pilih Buku</h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                Jelajahi katalog, periksa ketersediaan stok realtime, dan tambahkan ke keranjang pinjam.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 text-center shadow-sm relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">Terima QR Pass</h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                Pustakawan memverifikasi pengajuan dan sistem menerbitkan kode QR unik secara digital.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 text-center shadow-sm relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">Ambil Buku</h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">
                Tunjukkan QR Pass di smartphone Anda ke petugas loket — buku siap dibawa pulang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="px-4 pb-10 pt-10 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto w-full">
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
            {/* Soft decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-800/30 rounded-full blur-xl pointer-events-none" />

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white relative z-10">
              Mulai Pengalaman Membaca Lebih Cerdas Hari Ini
            </h2>
            <p className="text-indigo-100 mt-4 max-w-xl mx-auto leading-relaxed relative z-10">
              Daftarkan diri sebagai anggota perpustakaan digital Lexora dan akses seluruh koleksi literatur dengan fitur peminjaman mandiri.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 relative z-10">
              <Link
                href={user ? (userRole === 'admin' ? '/admin/dashboard' : '/dashboard') : '/register'}
                className="inline-flex justify-center items-center px-7 py-3.5 text-sm font-bold bg-white text-indigo-700 rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-sm"
              >
                {user ? 'Masuk ke Dashboard' : 'Daftar Jadi Anggota'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-10 border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Library className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-[var(--foreground)]">Lexora</span>
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]">
            © 2026 Lexora — Sistem Informasi Perpustakaan Modern
          </p>
        </div>
      </footer>
    </div>
  );
}
