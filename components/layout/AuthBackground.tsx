export function AuthBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Soft atmospheric radial glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />

      {/* Architectural micro-dot pattern with radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_50%_40%,black_40%,transparent_75%)]" />
    </div>
  );
}
