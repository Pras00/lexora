import Link from 'next/link';
import Image from 'next/image';
import {
  Library,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 px-6 md:px-10 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md transition-colors">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
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
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover hover:shadow-xs transition-all active:scale-95"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto w-full relative">
        {/* Subtle, taste-driven background atmosphere (Not noisy, not AI slop) */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Soft ambient orb */}
          <div className="absolute top-10 right-1/4 w-[420px] h-[420px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-amber-500/5 dark:bg-amber-600/5 rounded-full blur-3xl" />

          {/* Architectural micro-dot pattern with radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_50%_30%,black_35%,transparent_75%)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Typography & Value Prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-bold tracking-wide mb-6 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>PERPUSTAKAAN DIGITAL MODERN</span>
            </div>

            <h1 className="leading-[1.12] tracking-tight text-4xl sm:text-5xl lg:text-6xl text-foreground font-sans">
              Jelajahi Dunia{' '}
              <span className="font-serif italic text-primary relative">
                Literasi
              </span>
              <br />
              <span className="font-extrabold">dengan Mudah</span>
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-lg leading-relaxed mt-6">
              Temukan ratusan koleksi buku pilihan, pantau ketersediaan stok fisik secara realtime, dan lakukan reservasi tanpa antre menggunakan{' '}
              <strong className="text-foreground font-semibold">QR Pickup Pass</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-9">
              <Link
                href="#koleksi-pilihan"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pinjam Buku Sekarang</span>
              </Link>
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold border border-border bg-surface text-foreground rounded-xl hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              >
                <span>Lihat Katalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro proof metrics bar */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">500+</p>
                <p className="text-xs font-semibold text-muted mt-0.5">Koleksi Buku</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">14 Hari</p>
                <p className="text-xs font-semibold text-muted mt-0.5">Masa Pinjam</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">QR Pass</p>
                <p className="text-xs font-semibold text-muted mt-0.5">Pickup Cepat</p>
              </div>
            </div>
          </div>

          {/* Right — Book Fan Showcase with Floating Proof Card */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative flex items-end justify-center gap-4 py-8">
              {/* Left card */}
              <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-2xl overflow-hidden border border-border transform -rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block shadow-md bg-surface">
                <Image
                  src="/covers/the-wanderers-star.jpg"
                  alt="The Wanderer's Star"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {/* Center card */}
              <div className="relative w-48 h-64 sm:w-56 sm:h-80 rounded-2xl overflow-hidden ring-4 ring-surface shadow-xl transform hover:-translate-y-2 transition-transform duration-300 z-10 bg-surface">
                <Image
                  src="/covers/stargates-echo.jpg"
                  alt="Stargate's Echo"
                  fill
                  sizes="250px"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                  Populer
                </div>
              </div>

              {/* Right card */}
              <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-2xl overflow-hidden border border-border transform rotate-6 hover:rotate-0 transition-transform duration-300 hidden sm:block shadow-md bg-surface">
                <Image
                  src="/covers/neon-ghost.jpg"
                  alt="Neon Ghost"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {/* Floating tactful proof chip */}
              <div className="absolute -bottom-2 sm:-bottom-4 left-2 sm:left-6 px-4 py-2.5 rounded-2xl bg-surface/90 border border-border backdrop-blur-md shadow-md flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Stok Fisik Realtime</p>
                  <p className="text-[11px] text-muted">Ambil di loket tanpa antre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Koleksi Pilihan ─────────────────────────────────────── */}
      <section id="koleksi-pilihan" className="px-6 md:px-10 py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-bold tracking-wide mb-3 border border-indigo-100 dark:border-indigo-900/50">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>KOLEKSI REKOMENDASI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Buku <span className="font-serif italic font-normal text-primary">Populer</span> Pilihan
              </h2>
              <p className="text-muted mt-2 max-w-md leading-relaxed text-sm">
                Koleksi buku favorit yang siap Anda pinjam hari ini. Tambahkan ke keranjang untuk reservasi instan.
              </p>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group transition-colors"
            >
              <span>Jelajahi Semua Koleksi</span>
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
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold bg-surface border border-border text-foreground rounded-xl hover:border-primary hover:text-primary transition-colors shadow-2xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Katalog Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 Langkah Sederhana ───────────────────────────────────── */}
      <section className="px-6 md:px-10 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Tiga Langkah <span className="font-serif italic font-normal text-primary">Sederhana</span>
            </h2>
            <p className="text-muted mt-3 leading-relaxed text-sm">
              Proses reservasi dan peminjaman buku fisik kini jauh lebih cepat, tertib, dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-transparent via-indigo-200 dark:via-indigo-900 to-transparent -z-10" />

            {/* Step 1 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center text-xl font-black mb-5 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                1
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Pilih Buku</h3>
              <p className="text-xs text-muted leading-relaxed">
                Jelajahi katalog digital, periksa ketersediaan stok buku fisik secara realtime, lalu tambahkan ke keranjang.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center text-xl font-black mb-5 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                2
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Terima QR Pass</h3>
              <p className="text-xs text-muted leading-relaxed">
                Pustakawan menyetujui pengajuan Anda dan sistem menerbitkan kode QR Pickup Pass instan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center text-xl font-black mb-5 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                3
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Ambil di Loket</h3>
              <p className="text-xs text-muted leading-relaxed">
                Tunjukkan QR Pass ke petugas loket sirkulasi — buku langsung diserahkan tanpa antre formulir manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="px-4 pb-12 pt-6">
        <div className="max-w-5xl mx-auto w-full">
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-900/40 rounded-full blur-xl pointer-events-none" />

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white relative z-10">
              Mulai Pengalaman Membaca Lebih Cerdas Hari Ini
            </h2>
            <p className="text-indigo-100 mt-3 max-w-xl mx-auto leading-relaxed text-sm relative z-10">
              Daftarkan akun anggota perpustakaan Lexora sekarang dan nikmati kemudahan reservasi literatur fisik secara mandiri.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 relative z-10">
              <Link
                href={
                  user
                    ? userRole === 'admin'
                      ? '/admin/dashboard'
                      : '/dashboard'
                    : '/register'
                }
                className="inline-flex justify-center items-center px-7 py-3.5 text-sm font-bold bg-white text-primary rounded-xl hover:bg-slate-50 hover:scale-105 transition-all shadow-xs"
              >
                {user ? 'Buka Dashboard Saya' : 'Daftar Jadi Anggota'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="px-6 md:px-10 py-10 border-t border-border bg-surface mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-2xs">
              <Library className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground">Lexora</span>
          </div>
          <p className="text-xs font-medium text-muted">
            © 2026 Lexora — Sistem Informasi Perpustakaan Digital & Sirkulasi Fisik
          </p>
        </div>
      </footer>
    </div>
  );
}
