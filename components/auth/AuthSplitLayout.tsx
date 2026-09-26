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
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-background text-foreground transition-colors overflow-hidden">
      {/* Ambient background atmosphere */}
      <AuthBackground />

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* ── Left Column: Value Prop Showcase (Desktop only ≥ 1024px) ── */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between py-6">
          <div>
            {/* Brand Title Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight">Lexora</span>
                <span className="text-[11px] font-bold text-muted block -mt-1 tracking-wide uppercase">
                  Sistem Informasi Perpustakaan
                </span>
              </div>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-xs font-bold tracking-wide mb-6 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>PORTAL LAYANAN LITERASI & SIRKULASI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-foreground leading-[1.18] font-sans">
              Akses <span className="font-serif italic font-normal text-primary">Literatur</span> Tanpa Batas,
              <br />
              Peminjaman Tanpa Antre
            </h1>

            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed mt-4">
              Platform sirkulasi buku fisik modern untuk pemustaka dan pustakawan.
              Jelajahi koleksi secara realtime, lakukan reservasi mandiri, dan ambil
              di loket menggunakan kode QR instan.
            </p>

            {/* 4 Feature Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl">
              {/* Feature 1 */}
              <div className="p-4 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2.5 border border-indigo-100 dark:border-indigo-900/40">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Katalog Koleksi Realtime
                </h4>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Cek stok fisik di rak sebelum Anda datang ke perpustakaan.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2.5 border border-indigo-100 dark:border-indigo-900/40">
                  <QrCode className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  QR Pickup Pass Instan
                </h4>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Ambil buku di loket dalam hitungan detik tanpa formulir kertas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2.5 border border-indigo-100 dark:border-indigo-900/40">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Pantauan Jatuh Tempo
                </h4>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Pengingat otomatis masa pinjam 14 hari agar bebas dari denda.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-2xl bg-surface/80 border border-border backdrop-blur-xs shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-primary flex items-center justify-center mb-2.5 border border-indigo-100 dark:border-indigo-900/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  Akun Anggota Terpadu
                </h4>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">
                  Semua riwayat peminjaman dan denda tersimpan dengan aman.
                </p>
              </div>
            </div>
          </div>

          {/* Subtext info */}
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>© 2026 Lexora Library System</span>
            <span>Platform Sirkulasi Modern</span>
          </div>
        </div>

        {/* ── Right Column: Auth Form Card (Desktop: 5 cols, Mobile/Tablet: Centered) ── */}
        <div className="w-full lg:col-span-5 max-w-md mx-auto">
          <div className="relative rounded-3xl border border-border bg-surface p-6 sm:p-9 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            {/* Top subtle highlight gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-primary to-indigo-700" />

            {/* Mobile/Tablet brand logo badge */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Library className="w-6 h-6" />
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                {title}
              </h2>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Children Form (Login / Register) */}
            {children}

            {/* Bottom Navigation */}
            <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted">
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
          <div className="mt-6 text-center text-xs text-muted">
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
