import { BookOpen, BookMarked, Library, Compass } from 'lucide-react';

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Crisp Geometric Grid Lines (Architectural Blueprint) */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #6366f1 1px, transparent 1px),
            linear-gradient(to bottom, #6366f1 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* 2. Micro-Dot Matrix (Subtle, clear digital texture) */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-35"
        style={{
          backgroundImage: `radial-gradient(#818cf8 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 20%, black 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 20%, black 60%, transparent 100%)',
        }}
      />

      {/* 3. Multi-layer Vibrant Ambient Glows (Aurora Mesh) */}
      {/* Top Center Glow (Behind Hero Title) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full bg-gradient-to-b from-indigo-500/25 via-violet-600/20 to-transparent blur-[120px] dark:from-indigo-600/35 dark:via-purple-600/25" />

      {/* Top Right Glow (Warm Violet/Purple) */}
      <div className="absolute top-12 -right-20 sm:right-[-5%] w-[450px] sm:w-[550px] h-[450px] rounded-full bg-gradient-to-bl from-purple-500/20 via-pink-500/10 to-transparent blur-[130px] dark:from-purple-600/25 dark:via-indigo-600/15" />

      {/* Top Left Glow (Cyan / Sky) */}
      <div className="absolute top-48 -left-28 sm:left-[-5%] w-[450px] sm:w-[550px] h-[450px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-transparent blur-[120px] dark:from-cyan-600/25 dark:via-blue-600/15" />

      {/* Mid Page Glow (Behind Koleksi Pilihan Catalog) */}
      <div className="absolute top-[900px] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/18 via-violet-600/15 to-transparent blur-[140px] dark:from-indigo-600/25 dark:via-purple-600/20" />

      {/* Lower Section Glow (Behind 3-Steps & CTA) */}
      <div className="absolute top-[1700px] right-[-100px] w-[600px] sm:w-[750px] h-[600px] rounded-full bg-gradient-to-tl from-violet-600/20 via-indigo-600/15 to-transparent blur-[140px] dark:from-violet-600/25 dark:via-purple-600/20" />

      {/* 4. Elegant Wireframe Watermarks in the Margins (Non-intrusive, 15-20% opacity) */}
      {/* Left Margin: Floating Open Book Wireframe + Dashed Orbit */}
      <div className="absolute top-[180px] -left-8 lg:left-4 xl:left-12 pointer-events-none hidden md:block">
        <div className="relative w-48 h-48 lg:w-64 lg:h-64 text-indigo-400/20 dark:text-indigo-400/25 -rotate-12 transition-transform">
          <BookOpen className="w-full h-full stroke-[0.9]" />
        </div>
        {/* Dashed Orbit Ring */}
        <div className="absolute -top-12 -left-12 w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-dashed border-indigo-400/30 dark:border-indigo-400/25 animate-[spin_120s_linear_infinite]" />
        {/* Subtle Tech Badge */}
        <div className="absolute -bottom-4 left-10 px-2 py-0.5 rounded border border-indigo-400/20 dark:border-indigo-400/30 bg-indigo-950/20 text-[9px] font-mono tracking-widest text-indigo-400/40 dark:text-indigo-300/40 uppercase">
          DIGITAL ARCHIVE // 01
        </div>
      </div>

      {/* Right Margin: Floating BookMarked Wireframe + Dashed Orbit */}
      <div className="absolute top-[280px] -right-8 lg:right-4 xl:right-12 pointer-events-none hidden md:block">
        <div className="relative w-44 h-44 lg:w-60 lg:h-60 text-violet-400/20 dark:text-violet-400/25 rotate-12 transition-transform">
          <BookMarked className="w-full h-full stroke-[0.9]" />
        </div>
        {/* Dashed Orbit Ring */}
        <div className="absolute -top-12 -right-12 w-64 h-64 lg:w-80 lg:h-80 rounded-full border border-dashed border-violet-400/30 dark:border-violet-400/25 animate-[spin_100s_linear_infinite_reverse]" />
        {/* Subtle Tech Badge */}
        <div className="absolute -bottom-4 right-10 px-2 py-0.5 rounded border border-violet-400/20 dark:border-violet-400/30 bg-violet-950/20 text-[9px] font-mono tracking-widest text-violet-400/40 dark:text-violet-300/40 uppercase">
          CATALOG REF // LIVE
        </div>
      </div>

      {/* Middle Margin Left: Library Column Icon Accent */}
      <div className="absolute top-[1050px] -left-6 lg:left-6 xl:left-14 pointer-events-none hidden lg:block">
        <div className="relative w-40 h-40 text-sky-400/15 dark:text-sky-400/20 -rotate-6">
          <Library className="w-full h-full stroke-[0.85]" />
        </div>
        <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full border border-dashed border-sky-400/25 dark:border-sky-400/20" />
      </div>

      {/* Middle Margin Right: Compass / Navigation Icon Accent */}
      <div className="absolute top-[1250px] -right-6 lg:right-6 xl:right-14 pointer-events-none hidden lg:block">
        <div className="relative w-40 h-40 text-amber-400/15 dark:text-amber-400/20 rotate-12">
          <Compass className="w-full h-full stroke-[0.85]" />
        </div>
        <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full border border-dashed border-amber-400/25 dark:border-amber-400/20" />
      </div>
    </div>
  );
}
