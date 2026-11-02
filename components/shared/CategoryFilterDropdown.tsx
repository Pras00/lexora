'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { Category } from '@/types';

interface CategoryFilterDropdownProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts?: Record<string, number>;
  className?: string;
}

export function CategoryFilterDropdown({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  className = '',
}: CategoryFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika pengguna mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tutup dropdown jika pengguna menekan tombol Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const activeCategory = categories.find((c) => c.id === selectedCategory);
  const activeLabel = selectedCategory === 'all' ? 'Semua Kategori' : activeCategory?.name || 'Kategori';
  const isFiltered = selectedCategory !== 'all';
  const currentCount = categoryCounts ? categoryCounts[selectedCategory] : undefined;

  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Tombol Pemicu Popover */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between gap-3 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer select-none ${
          isOpen
            ? 'border-primary ring-2 ring-primary/25 bg-surface text-foreground shadow-xs'
            : isFiltered
              ? 'border-primary/50 bg-primary/5 text-primary shadow-2xs hover:bg-primary/10'
              : 'border-border bg-surface text-foreground hover:bg-surface-secondary/70 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal
            className={`w-3.5 h-3.5 shrink-0 transition-colors ${
              isFiltered ? 'text-primary' : 'text-muted'
            }`}
          />
          <span className="truncate max-w-44 text-left">{activeLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentCount !== undefined && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                isFiltered
                  ? 'bg-primary/15 text-primary'
                  : 'bg-surface-secondary text-muted'
              }`}
            >
              {currentCount}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-foreground' : ''
            }`}
          />
        </div>
      </button>

      {/* Menu Popover Floating Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface shadow-xl p-1.5 z-50 text-xs focus:outline-none"
          >
            {/* Header / Sub-label Popover */}
            <div className="px-2.5 py-1.5 text-xs font-semibold text-muted tracking-wide flex items-center justify-between border-b border-border/50 mb-1">
              <span>Filter Kategori</span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => handleSelect('all')}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="space-y-0.5">
              {/* Opsi: Semua Kategori */}
              <button
                type="button"
                role="option"
                aria-selected={selectedCategory === 'all'}
                onClick={() => handleSelect('all')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-surface-secondary'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    {selectedCategory === 'all' && (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <span className="truncate">Semua Kategori</span>
                </div>
                {categoryCounts?.all !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-secondary text-muted'
                    }`}
                  >
                    {categoryCounts.all}
                  </span>
                )}
              </button>

              {/* Opsi: Masing-masing Kategori */}
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = categoryCounts ? categoryCounts[cat.id] ?? 0 : undefined;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        )}
                      </div>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {count !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-primary/20 text-primary'
                            : 'bg-surface-secondary text-muted'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

