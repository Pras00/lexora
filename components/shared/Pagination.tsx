'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className = '',
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination items with ellipses
  const pageNumbers = useMemo<(number | 'ellipsis')[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalItems === 0) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-surface ${className}`}
    >
      {/* Keterangan Rentang Item & Pengaturan Jumlah per Halaman */}
      <div className="flex items-center gap-3 text-xs text-muted">
        <span>
          Menampilkan{' '}
          <strong className="font-semibold text-foreground">
            {startItem}–{endItem}
          </strong>{' '}
          dari{' '}
          <strong className="font-semibold text-foreground">{totalItems}</strong>{' '}
          data
        </span>

        {onPageSizeChange && totalItems > 10 && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-border">
            <span>Baris:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 text-xs font-medium rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigasi Tombol Halaman */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Tombol Sebelumnya */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Halaman sebelumnya"
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-surface text-foreground hover:bg-surface-secondary disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Nomor Halaman */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, idx) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs text-muted select-none"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-white shadow-2xs'
                      : 'border border-border bg-surface text-foreground hover:bg-surface-secondary'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Tombol Selanjutnya */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Halaman selanjutnya"
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-surface text-foreground hover:bg-surface-secondary disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

