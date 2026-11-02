'use client';

import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  enableShortcut?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari berdasarkan judul, penulis, atau ISBN...',
  className = '',
  enableShortcut = true,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Tekan '/' untuk langsung fokus ke searchbar
  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika user sedang mengetik di input, textarea, atau modal lain
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcut]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 text-xs rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors duration-150 shadow-2xs"
      />

      {/* Tombol Bersihkan atau Petunjuk Shortcut */}
      <div className="absolute right-2.5 flex items-center">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-surface-secondary transition-colors cursor-pointer"
            title="Bersihkan pencarian (Esc)"
            aria-label="Bersihkan pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          enableShortcut && (
            <kbd
              onClick={() => inputRef.current?.focus()}
              className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-xs text-muted font-mono bg-surface-secondary border border-border rounded-md cursor-pointer select-none"
              title="Tekan tombol '/' untuk mencari cepat"
            >
              /
            </kbd>
          )
        )}
      </div>
    </div>
  );
}
