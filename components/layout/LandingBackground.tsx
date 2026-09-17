import { BookOpen, BookMarked, Library, Compass } from 'lucide-react';

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Subtle Micro-Dot Grid Pattern across entire viewport */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40 dark:opacity-25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="landing-dot-matrix"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              className="fill-slate-400 dark:fill-slate-500"
            />
          </pattern>
          {/* Radial mask to keep dots softer at edges and center */}
          <radialGradient id="grid-fade" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </radialGradient>
          <mask id="fade-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#landing-dot-matrix)"
          mask="url(#fade-mask)"
        />
      </svg>

      {/* 2. Ambient Aurora Glows (Multi-layer soft lighting) */}
      {/* Top-Center Glow: Indigo / Violet aura behind Hero */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-400/18 via-violet-400/12 to-transparent blur-3xl dark:from-indigo-600/22 dark:via-purple-600/14" />

      {/* Top-Right Glow: Warm Amber / Sunset aura (like warm library reading lamp) */}
      <div className="absolute top-10 -right-24 sm:right-0 w-[380px] sm:w-[480px] h-[380px] rounded-full bg-gradient-to-bl from-amber-300/14 via-rose-300/8 to-transparent blur-3xl dark:from-amber-500/12 dark:via-rose-500/6" />

      {/* Mid-Left Glow: Sky / Cyan aura near Featured Collection */}
      <div className="absolute top-[42%] -left-32 sm:-left-16 w-[440px] sm:w-[560px] h-[440px] rounded-full bg-gradient-to-br from-sky-400/12 via-indigo-300/10 to-transparent blur-3xl dark:from-sky-600/14 dark:via-indigo-600/10" />

      {/* Mid-Right Glow: Violet / Purple aura near 3 Steps section */}
      <div className="absolute top-[68%] -right-28 sm:right-[-5%] w-[420px] sm:w-[540px] h-[420px] rounded-full bg-gradient-to-tl from-violet-400/12 via-purple-300/8 to-transparent blur-3xl dark:from-violet-600/14 dark:via-purple-600/8" />

      {/* 3. Subtle Faint Geometric Watermarks in Margins (Non-intrusive, 4-8% opacity) */}
      {/* Left Margin Accent: Floating Open Book Wireframe + Dashed Orbital Ring */}
      <div className="absolute top-[16%] left-[-20px] lg:left-[3%] xl:left-[6%] pointer-events-none hidden md:block">
        <div className="relative w-48 h-48 lg:w-60 lg:h-60 text-indigo-500/[0.07] dark:text-indigo-400/[0.06] -rotate-12 transition-transform">
          <BookOpen className="w-full h-full stroke-[0.8]" />
        </div>
        {/* Faint dashed orbit ring */}
        <div className="absolute -top-10 -left-10 w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-dashed border-indigo-300/20 dark:border-indigo-600/15" />
      </div>

      {/* Right Margin Accent: Floating Bookmarked Wireframe + Dashed Orbital Ring */}
      <div className="absolute top-[28%] right-[-15px] lg:right-[3%] xl:right-[6%] pointer-events-none hidden md:block">
        <div className="relative w-44 h-44 lg:w-56 lg:h-56 text-violet-500/[0.07] dark:text-violet-400/[0.06] rotate-12">
          <BookMarked className="w-full h-full stroke-[0.8]" />
        </div>
        {/* Faint dashed orbit ring */}
        <div className="absolute -top-12 -right-12 w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-dashed border-violet-300/20 dark:border-violet-600/15" />
      </div>

      {/* Lower Left Accent: Faint Library Pill / Column Wireframe */}
      <div className="absolute top-[75%] left-[-10px] lg:left-[4%] pointer-events-none hidden lg:block">
        <div className="w-40 h-40 text-amber-500/[0.06] dark:text-amber-400/[0.05] -rotate-6">
          <Library className="w-full h-full stroke-[0.8]" />
        </div>
      </div>

      {/* Lower Right Accent: Faint Compass / Exploration Motif */}
      <div className="absolute top-[82%] right-[-10px] lg:right-[4%] pointer-events-none hidden lg:block">
        <div className="w-40 h-40 text-sky-500/[0.06] dark:text-sky-400/[0.05] rotate-12">
          <Compass className="w-full h-full stroke-[0.8]" />
        </div>
      </div>
    </div>
  );
}
