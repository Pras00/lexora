'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface DeckBook {
  id: string;
  title: string;
  author: string;
  year: number;
  category: string;
  categorySlug: string;
  coverUrl: string;
  shelfLocation: string;
  floor: string;
  availableStock: number;
  totalStock: number;
  rating: number;
  reviewsCount: string;
  tagline: string;
}

const DECK_BOOKS: DeckBook[] = [
  {
    id: 'bumi-manusia',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    year: 1980,
    category: 'Sastra & Humaniora',
    categorySlug: 'fiksi-sastra',
    coverUrl: '/covers/bumi-manusia.jpg',
    shelfLocation: 'Rak Sastra B-04',
    floor: 'Lantai 2',
    availableStock: 5,
    totalStock: 6,
    rating: 4.9,
    reviewsCount: '340+ Pembaca',
    tagline: 'Roman sejarah monumental tentang pergulatan intelektual Minke di era Hindia Belanda.',
  },
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    category: 'Software Engineering',
    categorySlug: 'teknologi-pemrograman',
    coverUrl: '/covers/clean-code.jpg',
    shelfLocation: 'Rak Rekayasa T-12',
    floor: 'Lantai 3',
    availableStock: 4,
    totalStock: 5,
    rating: 4.8,
    reviewsCount: '520+ Pembaca',
    tagline: 'Panduan fundamental tentang penulisan kode bersih, keterbacaan, dan refactoring profesional.',
  },
  {
    id: 'ddia',
    title: 'Designing Data-Intensive Apps',
    author: 'Martin Kleppmann',
    year: 2017,
    category: 'Sains & Sistem Data',
    categorySlug: 'teknologi-pemrograman',
    coverUrl: '/covers/ddia.jpg',
    shelfLocation: 'Rak Data D-08',
    floor: 'Lantai 3',
    availableStock: 4,
    totalStock: 4,
    rating: 4.9,
    reviewsCount: '480+ Pembaca',
    tagline: 'Prinsip arsitektur sistem terdistribusi, database reliabel, dan konsistensi data skala besar.',
  },
  {
    id: 'lean-startup',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    year: 2011,
    category: 'Bisnis & Manajemen',
    categorySlug: 'bisnis-manajemen',
    coverUrl: '/covers/lean-startup.jpg',
    shelfLocation: 'Rak Bisnis M-02',
    floor: 'Lantai 1',
    availableStock: 3,
    totalStock: 4,
    rating: 4.7,
    reviewsCount: '290+ Pembaca',
    tagline: 'Metodologi inovasi berkelanjutan dan validasi bisnis cepat dengan siklus Build-Measure-Learn.',
  },
];

export function HeroBookShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const current = DECK_BOOKS[activeIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance deck every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DECK_BOOKS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DECK_BOOKS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + DECK_BOOKS.length) % DECK_BOOKS.length);
  };

  return (
    <div
      className="relative flex flex-col items-center lg:items-end w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Main Interactive Showcase Container ─────────────────── */}
      <div className="relative w-full max-w-[480px] flex flex-col items-center">
        {/* Soft Ambient Glow Halo */}
        <div className="absolute top-4 inset-x-0 h-64 flex items-center justify-center pointer-events-none -z-10">
          <div className="w-80 h-80 bg-primary/15 rounded-full blur-3xl opacity-75 dark:opacity-40" />
          <div className="w-64 h-64 bg-amber-500/10 rounded-full blur-2xl opacity-40 dark:opacity-20 translate-x-12" />
        </div>

        {/* ── 3D Fanned Card Deck Stage ─────────────────────────── */}
        <div
          className="relative w-full flex items-center justify-center pt-2"
          style={{ height: 295, minHeight: 295 }}
        >
          {/* Subtle ground contact shadow */}
          <div className="absolute bottom-2 w-3/4 h-8 bg-radial from-slate-950/25 via-slate-900/10 to-transparent blur-lg rounded-full pointer-events-none" />

          {/* Book Cards in Deck (Centered with -35px offset for fan balance) */}
          <div
            className="relative"
            style={{ width: 195, height: 280, transform: 'translateX(-35px)' }}
          >
            {DECK_BOOKS.map((book, idx) => {
              const count = DECK_BOOKS.length;
              // diff: 0 = front active, 1 = second (peeking right), 2 = third, 3 = fourth
              const diff = (idx - activeIndex + count) % count;
              const isFront = diff === 0;

              // Transform calculations for the fanned deck
              let translateX = 0;
              let translateY = 0;
              let rotate = 0;
              let scale = 1;
              let zIndex = 40;
              let opacity = 1;

              if (diff === 0) {
                translateX = 0;
                translateY = 0;
                rotate = 0;
                scale = 1;
                zIndex = 40;
                opacity = 1;
              } else if (diff === 1) {
                translateX = 44;
                translateY = 8;
                rotate = 6;
                scale = 0.94;
                zIndex = 30;
                opacity = 0.92;
              } else if (diff === 2) {
                translateX = 84;
                translateY = 16;
                rotate = 12;
                scale = 0.88;
                zIndex = 20;
                opacity = 0.8;
              } else if (diff === 3) {
                translateX = 118;
                translateY = 24;
                rotate = 18;
                scale = 0.82;
                zIndex = 10;
                opacity = 0.6;
              }

              return (
                <div
                  key={book.id}
                  onClick={() => setActiveIndex(idx)}
                  className="absolute cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    width: 195,
                    height: 280,
                    top: 0,
                    left: 0,
                    transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transformOrigin: 'bottom center',
                  }}
                  title={`Klik untuk melihat ${book.title}`}
                >
                  {/* Physical Book Realistic Mockup */}
                  <div
                    className={`relative w-full h-full rounded-r-[5px] rounded-l-[2px] bg-slate-900 overflow-visible transition-shadow duration-300 ${
                      isFront
                        ? 'shadow-[0_20px_40px_-10px_rgba(15,23,42,0.45),0_8px_18px_rgba(0,0,0,0.2)]'
                        : 'shadow-[0_12px_24px_-6px_rgba(15,23,42,0.35)] hover:opacity-100'
                    }`}
                  >
                    {/* Cover Container */}
                    <div className="relative w-full h-full rounded-r-[5px] rounded-l-[2px] overflow-hidden bg-slate-950">
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        sizes="220px"
                        className="object-cover"
                        priority={idx === 0}
                      />

                      {/* Spine Crease & Reflection */}
                      <div className="absolute inset-y-0 left-0 w-8 pointer-events-none z-10 bg-gradient-to-r from-black/55 via-white/18 to-transparent" />
                      <div className="absolute inset-y-0 left-[6px] w-[1px] bg-black/40 pointer-events-none z-10" />
                      <div className="absolute inset-y-0 left-[7.5px] w-[1px] bg-white/10 pointer-events-none z-10" />

                      {/* Satin Sheen */}
                      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-transparent via-white/12 to-white/5 opacity-70" />

                      {/* Front Card Active Subtle Ring */}
                      {isFront && (
                        <div className="absolute inset-0 rounded-r-[5px] rounded-l-[2px] ring-1 ring-white/25 pointer-events-none z-20" />
                      )}
                    </div>

                    {/* Paper Pages Block Edge (Ketebalan Kertas) */}
                    <div
                      className="absolute -right-[6px] top-[2px] bottom-[2px] w-[6px] rounded-r-[2px] pointer-events-none z-0 border-y border-r border-stone-300/70 dark:border-stone-700/70"
                      style={{
                        background: 'repeating-linear-gradient(to bottom, #fafaf9 0px, #e7e5e4 1px, #d6d3d1 2px)',
                        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.18)',
                      }}
                    />
                    <div
                      className="absolute -bottom-[5px] left-[3px] right-[2px] h-[5px] rounded-b-[2px] pointer-events-none z-0 border-x border-b border-stone-300/70 dark:border-stone-700/70"
                      style={{
                        background: 'repeating-linear-gradient(to right, #fafaf9 0px, #e7e5e4 1px, #d6d3d1 2px)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Live Interactive Info Card (Below Deck) ───────────── */}
        <div className="w-full mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all duration-300">
          {/* Top Metadata Row: Category & Stock Indicator */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{current.category}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{current.rating}</span>
              </span>
            </div>

            {/* Live Stock Pulse Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{current.availableStock} dari {current.totalStock} Tersedia</span>
            </div>
          </div>

          {/* Book Title & Description */}
          <div className="py-2.5">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
              {current.title}
            </h3>
            <p className="text-xs text-muted font-medium mt-0.5">
              {current.author} · {current.year}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {current.tagline}
            </p>
          </div>

          {/* Physical Location Strip */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs mb-3.5">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-[11px] text-muted font-medium">
              Lokasi Fisik: <strong className="text-foreground font-semibold">{current.floor} · {current.shelfLocation}</strong>
            </span>
          </div>

          {/* Action Row & Card Controls */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* Primary CTA Button */}
            <Link
              href={`/catalog?category=${current.categorySlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <span>Pinjam Buku Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Deck Controls (Prev, Indicators, Next) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                aria-label="Buku sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1 px-1">
                {DECK_BOOKS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'w-5 bg-primary'
                        : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                    }`}
                    aria-label={`Buka slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                aria-label="Buku berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Micro Hint */}
        <p className="text-[11px] text-muted/80 mt-2 text-center">
          💡 Klik salah satu buku di belakang atau tombol panah untuk menukar koleksi.
        </p>
      </div>
    </div>
  );
}
