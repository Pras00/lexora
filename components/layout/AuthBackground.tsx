import { BookOpen } from 'lucide-react';

export function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Subtle Micro-Dot Grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-35 dark:opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="auth-dots-pattern"
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
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-dots-pattern)" />
      </svg>

      {/* Ambient soft glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[580px] h-[380px] rounded-full bg-gradient-to-tr from-indigo-400/15 via-violet-400/10 to-transparent blur-3xl dark:from-indigo-600/18 dark:via-purple-600/10" />
      <div className="absolute -bottom-16 -right-16 w-[380px] h-[380px] rounded-full bg-gradient-to-tl from-amber-300/12 via-rose-300/6 to-transparent blur-3xl dark:from-amber-500/10" />

      {/* Faint side watermark */}
      <div className="absolute bottom-12 left-12 w-44 h-44 text-indigo-500/[0.05] dark:text-indigo-400/[0.04] -rotate-12 pointer-events-none hidden md:block">
        <BookOpen className="w-full h-full stroke-[0.8]" />
      </div>
    </div>
  );
}
