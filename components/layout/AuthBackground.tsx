import { BookOpen } from 'lucide-react';

export function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle Micro-Dot Grid */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(#818cf8 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient soft glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-transparent blur-[120px] dark:from-indigo-600/30 dark:via-purple-600/20" />
      <div className="absolute -bottom-16 -right-16 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-purple-500/15 via-pink-500/10 to-transparent blur-[120px] dark:from-purple-600/20" />

      {/* Faint side watermark */}
      <div className="absolute bottom-12 left-12 w-48 h-48 text-indigo-400/15 dark:text-indigo-400/20 -rotate-12 pointer-events-none hidden md:block">
        <BookOpen className="w-full h-full stroke-[0.8]" />
      </div>
    </div>
  );
}
