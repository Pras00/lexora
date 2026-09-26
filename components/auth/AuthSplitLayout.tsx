import React from 'react';
import Link from 'next/link';
import {
  Library,
  BookOpen,
  QrCode,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthBackground } from '@/components/layout/AuthBackground';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthSplitLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthSplitLayoutProps) {
  return (
    <div className="relative h-screen overflow-y-auto lg:overflow-hidden flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-background text-foreground transition-colors">
      {/* Ambient background atmosphere */}
      <AuthBackground />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-center my-auto">
        {/* ── Left Column: Value Prop Showcase (Desktop only ≥ 1024px) ── */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between py-2">
          <div>
            {/* Brand Title Badge */}
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Library className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight">Lexora</span>
                <span className="text-[10px] font-bold text-muted block -mt-1 tracking-wide uppercase">
                  Sistem Informasi Perpustakaan
                </span>
              </div>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-[11px] font-bold tracking-wide mb-3.5 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>PORTAL LAYANAN LITERASI & SIRKULASI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.18] font-sans">
              Akses <span className="font-serif italic font-normal text-primary">Literatur</span> Tanpa Batas,
              <br />
              Peminjaman Tanpa Antre
            </h1>

            <p className="text-xs sm:text-sm text-muted max-w-lg leading-relaxed mt-2.5">
              Platform sirkulasi buku fisik modern untuk pemustaka dan pustakawan.
              Jelajahi koleksi secara realtime, lakukan reservasi mandiri, dan ambil
              di loket menggunakan kode QR instan.
            </p>

            {/* 4 Feature Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3 mt-5 max-w-xl">
              {/* Feature 1 */}
              <div className="p-3 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2 border border-indigo-100 dark:border-indigo-900/40">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Katalog Realtime
                </h4>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                  Cek stok buku di rak sebelum datang ke perpustakaan.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-3 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2 border border-indigo-100 dark:border-indigo-900/40">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  QR Pickup Pass
                </h4>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                  Ambil buku di loket dalam hitungan detik tanpa kertas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-3 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2 border border-indigo-100 dark:border-indigo-900/40">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Pantauan Jatuh Tempo
                </h4>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                  Pengingat otomatis masa pinjam 14 hari bebas denda.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-3 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2 border border-indigo-100 dark:border-indigo-900/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Akun Terpadu
                </h4>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                  Riwayat peminjaman dan denda tersimpan dengan aman.
                </p>
              </div>
            </div>
          </div>

          {/* Subtext info */}
          <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <span>© 2026 Lexora Library System</span>
            <span>Platform Sirkulasi Modern</span>
          </div>
        </div>

        {/* ── Right Column: Auth Form Card (Desktop: 5 cols, Mobile/Tablet: Centered) ── */}
        <div className="w-full lg:col-span-5 max-w-[480px] mx-auto py-2">
          <div className="relative rounded-3xl border border-border bg-surface p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            {/* Top subtle highlight gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-primary to-indigo-700" />

            {/* Mobile/Tablet brand logo badge */}
            <div className="lg:hidden flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Library className="w-5 h-5" />
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                {title}
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Children Form (Login / Register) */}
            {children}

            {/* Bottom Navigation */}
            <div className="mt-4 pt-3.5 border-t border-border text-center text-xs text-muted">
              {footerText}{' '}
              <Link
                href={footerLinkHref}
                className="font-bold text-primary hover:underline transition-colors"
              >
                {footerLinkText}
              </Link>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-3.5 text-center text-xs text-muted">
            <Link
              href="/"
              className="hover:text-foreground transition-colors font-medium"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
