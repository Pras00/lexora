import Link from 'next/link';
import {
  Library,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  QrCode,
  BookOpenCheck,
  Building2,
  BookmarkCheck,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserMenu } from '@/components/layout/UserMenu';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { HighlightBookCard } from '@/components/books/HighlightBookCard';
import { HeroQuickSearch } from '@/components/home/HeroQuickSearch';
import { HeroBookShowcase } from '@/components/home/HeroBookShowcase';
import { BookWithCategory } from '@/types';

export const dynamic = 'force-dynamic';

const FALLBACK_FEATURED_BOOKS: BookWithCategory[] = [
  {
    id: 'featured-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category_id: 'cat-1',
    publisher: 'Prentice Hall',
    published_year: 2008,
    description: 'Panduan fundamental tentang penulisan kode yang rapi, mudah dipelihara, dan berstandar industri.',
    cover_url: '/covers/clean-code.jpg',
    price: 250000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-1',
      name: 'Teknologi & Komputasi',
      slug: 'teknologi-komputasi',
      description: null,
      created_at: '',
    },
  },
  {
    id: 'featured-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category_id: 'cat-1',
    publisher: "O'Reilly Media",
    published_year: 2017,
    description: 'Eksplorasi mendalam mengenai keandalan, skalabilitas, dan pemeliharaan sistem data terdistribusi.',
    cover_url: '/covers/ddia.jpg',
    price: 380000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-1',
      name: 'Teknologi & Komputasi',
      slug: 'teknologi-komputasi',
      description: null,
      created_at: '',
    },
  },
  {
    id: 'featured-3',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    category_id: 'cat-1',
    publisher: 'Addison-Wesley Professional',
    published_year: 2018,
    description: 'Katalog teknik refactoring untuk meningkatkan struktur internal dan kualitas kode perangkat lunak.',
    cover_url: '/covers/refactoring.jpg',
    price: 310000,
    total_stock: 4,
    available_stock: 3,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-1',
      name: 'Teknologi & Komputasi',
      slug: 'teknologi-komputasi',
      description: null,
      created_at: '',
    },
  },
  {
    id: 'featured-4',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    isbn: '978-9799731234',
    category_id: 'cat-3',
    publisher: 'Lentera Dipantara',
    published_year: 1980,
    description: 'Mahakarya sastra Indonesia yang mengisahkan pergulatan batin Minke di tengah tatanan kolonial Hindia Belanda.',
    cover_url: '/covers/bumi-manusia.jpg',
    price: 115000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-3',
      name: 'Sastra & Humaniora',
      slug: 'sastra-humaniora',
      description: null,
      created_at: '',
    },
  },
  {
    id: 'featured-5',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '978-0307887894',
    category_id: 'cat-4',
    publisher: 'Crown Business',
    published_year: 2011,
    description: 'Metodologi inovasi berkelanjutan dan validasi ide bisnis dengan siklus Build-Measure-Learn yang teruji.',
    cover_url: '/covers/lean-startup.jpg',
    price: 220000,
    total_stock: 4,
    available_stock: 3,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-4',
      name: 'Bisnis & Manajemen',
      slug: 'bisnis-manajemen',
      description: null,
      created_at: '',
    },
  },
  {
    id: 'featured-6',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    isbn: '978-9793062792',
    category_id: 'cat-3',
    publisher: 'Bentang Pustaka',
    published_year: 2005,
    description: 'Kisah inspiratif sepuluh anak Belitong dalam memperjuangkan mimpi dan pendidikan di tengah keterbatasan.',
    cover_url: '/covers/laskar-pelangi.jpg',
    price: 89000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: {
      id: 'cat-3',
      name: 'Sastra & Humaniora',
      slug: 'sastra-humaniora',
      description: null,
      created_at: '',
    },
  },
];

export default async function HomePage() {
  let featuredBooks: BookWithCategory[] = FALLBACK_FEATURED_BOOKS;

  const { user, profile: userProfile } = await getCurrentUser();
  const userRole = userProfile?.role || user?.user_metadata?.role || 'member';

  if (process.env.DATABASE_URL) {
    try {
      const dbBooks = await sql`
        SELECT b.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.status = 'active'
        ORDER BY b.created_at DESC
        LIMIT 6
      `;
      if (dbBooks && dbBooks.length > 0) {
        featuredBooks = dbBooks as unknown as BookWithCategory[];
      }
    } catch (neonErr) {
      console.warn('NeonDB query books warning:', neonErr);
    }
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
      <section className="px-6 py-8 md:px-10 pt-8 pb-14 md:pt-12 md:pb-18 lg:pt-12 lg:pb-20 max-w-7xl mx-auto w-full relative">
        {/* Soft atmospheric background without arbitrary bracket CSS */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-6 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Typography, Search, & Value Prop */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary text-muted text-xs font-semibold mb-4 border border-border">
              <Library className="w-3.5 h-3.5 text-primary" />
              <span>Sistem Sirkulasi & Koleksi Buku Fisik</span>
            </div>

            <h1 className="leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl text-foreground font-sans font-bold">
              Jelajahi Dunia{' '}
              <span className="font-serif italic font-normal text-primary">
                Literasi
              </span>
              <br />
              <span className="font-extrabold">dengan Mudah</span>
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-lg leading-relaxed mt-4 sm:mt-5">
              Temukan ratusan koleksi buku pilihan, pantau ketersediaan stok fisik secara realtime, dan lakukan reservasi tanpa antre menggunakan{' '}
              <strong className="text-foreground font-semibold">QR Pickup Pass</strong>.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 sm:mt-7">
              <Link
                href={user ? "#koleksi-pilihan" : "/login?redirectTo=%23koleksi-pilihan"}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Pinjam Buku Sekarang</span>
              </Link>
              <Link
                href={user ? "/catalog" : "/login?redirectTo=/catalog"}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold border border-border bg-surface text-foreground rounded-xl hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              >
                <span>Lihat Katalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Interactive Hero Quick Search */}
            <HeroQuickSearch isAuthenticated={Boolean(user)} />

            {/* Micro proof metrics bar */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-8 pt-6 pb-2 border-t border-border">
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
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-extrabold text-foreground tracking-tight">0 Biaya</p>
                <p className="text-xs font-semibold text-muted mt-0.5">Reservasi Mandiri</p>
              </div>
            </div>
          </div>

          {/* Right — Book Showcase with Physical Library Context */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <HeroBookShowcase />
          </div>
        </div>
      </section>

      {/* ── Koleksi Pilihan ─────────────────────────────────────── */}
      <section id="koleksi-pilihan" className="px-6 md:px-10 py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary text-primary text-xs font-semibold mb-3 border border-border">
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Koleksi Terpopuler</span>
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
      <section className="px-6 md:px-10 py-20 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-secondary text-primary text-xs font-semibold mb-3 border border-border">
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Alur Sirkulasi Cepat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Tiga Langkah <span className="font-serif italic font-normal text-primary">Sederhana</span>
            </h2>
            <p className="text-muted mt-3 leading-relaxed text-sm">
              Proses reservasi dan peminjaman buku fisik kini jauh lebih cepat, tertib, dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Horizontal flow line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-16 right-16 h-px bg-border -z-10" />

            {/* Step 1 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-md hover:border-border-strong transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-subtle text-primary flex items-center justify-center mb-5 border border-border shadow-2xs">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-primary bg-accent-subtle rounded-md mb-3 border border-border">
                Langkah 01
              </span>
              <h3 className="text-base font-bold text-foreground mb-2">Pilih & Reservasi Buku</h3>
              <p className="text-xs text-muted leading-relaxed">
                Jelajahi ratusan buku di katalog digital, periksa stok fisik yang tersedia di rak secara realtime, lalu masukkan ke keranjang peminjaman.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-md hover:border-border-strong transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-subtle text-primary flex items-center justify-center mb-5 border border-border shadow-2xs">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-primary bg-accent-subtle rounded-md mb-3 border border-border">
                Langkah 02
              </span>
              <h3 className="text-base font-bold text-foreground mb-2">Terbitkan QR Pickup Pass</h3>
              <p className="text-xs text-muted leading-relaxed">
                Setelah permohonan disetujui petugas perpustakaan, sistem langsung menerbitkan kode QR Pickup Pass pada dashboard akun Anda.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xs hover:shadow-md hover:border-border-strong transition-all hover:-translate-y-1 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-subtle text-primary flex items-center justify-center mb-5 border border-border shadow-2xs">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-primary bg-accent-subtle rounded-md mb-3 border border-border">
                Langkah 03
              </span>
              <h3 className="text-base font-bold text-foreground mb-2">Ambil di Loket Sirkulasi</h3>
              <p className="text-xs text-muted leading-relaxed">
                Tunjukkan QR Pass pada petugas loket perpustakaan. Buku fisik langsung diserah-terimakan dalam hitungan detik tanpa antrean manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Asymmetric Split CTA Banner with Member Pass Preview ── */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Subtle radial backdrops */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/20 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Column: Proposition & Action */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold mb-4 border border-white/20">
                  <Library className="w-3.5 h-3.5" />
                  <span>Keanggotaan Perpustakaan Lexora</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Satu Kartu Anggota Digital, Akses ke Ratusan Literatur Fisik
                </h2>

                <p className="text-indigo-100 mt-4 leading-relaxed text-sm sm:text-base">
                  Bergabung bersama komunitas pembaca aktif Lexora. Nikmati kemudahan reservasi buku kapan saja, notifikasi pengingat otomatis, dan riwayat peminjaman yang transparan.
                </p>

                {/* Benefits Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Maksimal 3 buku per peminjaman</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Perpanjangan masa pinjam mandiri</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>QR Pickup Pass instan di loket</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Bebas antre formulir kertas</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href={
                      user
                        ? userRole === 'admin'
                          ? '/admin/dashboard'
                          : '/dashboard'
                        : '/register'
                    }
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-7 py-3.5 text-sm font-bold bg-white text-primary rounded-xl hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
                  >
                    <span>{user ? 'Buka Dashboard Saya' : 'Daftar Jadi Anggota Gratis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {!user && (
                    <Link
                      href="/login"
                      className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <span>Masuk ke Akun</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Tactile Digital Library Card Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-white/10 border border-white/25 backdrop-blur-md p-6 text-white shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center font-bold">
                        <Library className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black tracking-widest uppercase">LEXORA PASS</p>
                        <p className="text-[10px] text-indigo-200">Digital Library ID</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                      AKTIF
                    </span>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                      {/* Stylized QR mockup graphic */}
                      <QrCode className="w-full h-full text-slate-900" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-indigo-200 uppercase font-semibold">Nomor Anggota</p>
                      <p className="text-sm font-mono font-bold tracking-wider">LX-2026-9812</p>
                      <p className="text-[11px] text-indigo-200">Akses Sirkulasi Fisik: Penuh</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-indigo-200">
                    <span>Masa Berlaku: 1 Tahun</span>
                    <span className="text-white font-medium">Perpustakaan Lexora</span>
                  </div>
                </div>
              </div>
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
