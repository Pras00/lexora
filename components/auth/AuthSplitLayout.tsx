import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  QrCode,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthBackground } from '@/components/layout/AuthBackground';
import { LexoraLogo } from '@/components/shared/LexoraLogo';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

// 4 buku fisik populer pilihan yang ada di sistem
const curatedBooks = [
  {
    title: 'Pulang - Pergi',
    author: 'Tere Liye',
    cover: '/covers/pulang-pergi.jpg',
    shelf: 'Rak Sastra F-02',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: '/covers/sapiens.jpg',
    shelf: 'Rak Sejarah B-04',
  },
  {
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    cover: '/covers/bumi-manusia.jpg',
    shelf: 'Rak Klasik C-01',
  },
  {
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    cover: '/covers/laut-bercerita.jpg',
    shelf: 'Rak Fiksi D-08',
  },
];

export function AuthSplitLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden flex items-center justify-center p-3 sm:p-4 lg:py-3 lg:px-6 xl:px-8 bg-background text-foreground transition-colors">
      {/* Latar Belakang Atmosferik Halus */}
      <AuthBackground />

      {/* Tombol Pengubah Tema (Kanan Atas) */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-12 items-center my-auto py-1">
        {/* ── Sisi Kiri: Showcase Fisik Otentik Koleksi Buku (Desktop >= 1024px) ── */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-3 xl:space-y-4 pr-2">
          {/* Brand Logo & Editorial Badge */}
          <div className="space-y-2">
            <Link
              href="/"
              title="Kembali ke Beranda"
              className="inline-flex group focus:outline-none"
            >
              <LexoraLogo
                size="md"
                subtitle="Sistem Informasi Perpustakaan"
              />
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-secondary text-muted text-[11px] font-semibold border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Sirkulasi & Preservasi Koleksi Fisik
              </span>
            </div>
          </div>

          {/* Headline Editorial yang Tenang & Bernas */}
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-foreground leading-tight font-sans">
              Sirkulasi buku fisik yang lebih mudah, tertata, dan tenang.
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-2 sm:line-clamp-none">
              Telusuri ketersediaan buku di rak secara realtime, lakukan reservasi mandiri,
              dan ambil langsung di loket sirkulasi menggunakan kode QR instan tanpa formulir kertas.
            </p>
          </div>

          {/* Preview Koleksi Buku Populer di Rak */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-border bg-surface/80 shadow-2xs backdrop-blur-xs space-y-2.5 max-w-xl">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/70">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <h4 className="text-xs font-bold text-foreground">
                  Koleksi Populer Siap Pinjam di Rak
                </h4>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-muted">
                2.400+ Judul Tersedia
              </span>
            </div>

            {/* 4 Mini Cover Buku Fisik Realistis */}
            <div className="grid grid-cols-4 gap-2.5">
              {curatedBooks.map((b) => (
                <div
                  key={b.title}
                  className="group/book relative flex flex-col items-center"
                >
                  <div className="relative w-full aspect-[1/1.42] max-w-24 rounded-lg overflow-hidden bg-surface-secondary shadow-xs border border-border/80 group-hover/book:scale-103 group-hover/book:shadow-md transition-all duration-200">
                    <Image
                      src={b.cover}
                      alt={b.title}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    {/* Spine shadow realistis */}
                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />
                  </div>
                  <span className="text-[10px] font-bold text-foreground text-center truncate w-full mt-1.5 block">
                    {b.title}
                  </span>
                  <span className="text-[9px] text-muted text-center truncate w-full block">
                    {b.shelf}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Takeaways Row di Bawah Rak Buku */}
            <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[10px] text-muted">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Ambil di loket via <strong>QR Pickup Pass</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Peminjaman resmi hingga <strong>14 hari</strong></span>
              </div>
            </div>
          </div>

          {/* Subtext info & Status Jam Loket */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted max-w-xl">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-primary" />
              <span>Loket Sirkulasi: Senin–Jumat (08.00–16.30 WIB)</span>
            </span>
            <span>© 2026 Lexora Library</span>
          </div>
        </div>

        {/* ── Sisi Kanan: Formulir Autentikasi (Desktop: 5 cols, Mobile/Tablet: Centered) ── */}
        <div className="w-full lg:col-span-5 max-w-md xl:max-w-lg mx-auto py-1">
          <div className="relative rounded-3xl border border-border bg-surface p-4 sm:p-6 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
            {/* Mobile/Tablet brand logo badge */}
            <div className="lg:hidden flex items-center justify-center mb-3">
              <Link href="/" title="Kembali ke Beranda" className="group focus:outline-none">
                <LexoraLogo size="md" />
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-3.5">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
                {title}
              </h2>
              <p className="text-xs text-muted mt-0.5 leading-normal max-w-sm mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Children Form (Login / Register) */}
            {children}

            {/* Bottom Navigation */}
            <div className="mt-3 pt-3 border-t border-border text-center text-xs text-muted">
              {footerText}{' '}
              <Link
                href={footerLinkHref}
                className="font-bold text-primary hover:underline transition-colors ml-1"
              >
                {footerLinkText}
              </Link>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-2 text-center text-xs text-muted">
            <Link
              href="/"
              className="hover:text-foreground transition-colors font-medium inline-flex items-center gap-1"
            >
              <span>← Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
