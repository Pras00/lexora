import React from 'react';
import { cn } from '@/lib/utils';

export interface LexoraMarkProps {
  className?: string;
  variant?: 'default' | 'inverted';
}

/**
 * Lexora Bespoke Architectural Brand Mark
 * Menggabungkan monogram 'L' (punggung & sampul buku fisik), lembaran halaman terbuka,
 * dan pita pembatas buku (swallowtail bookmark) berwarna emas hangat.
 */
export function LexoraMark({
  className = 'w-9 h-9',
  variant = 'default',
}: LexoraMarkProps) {
  const isInverted = variant === 'inverted';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
      role="img"
      aria-label="Logo Lexora"
      className={cn(
        'shrink-0 select-none transition-transform duration-200 group-hover:scale-105',
        className
      )}
    >
      <title>Lexora</title>
      {/* Plinth Squircle */}
      <rect
        x="1.5"
        y="1.5"
        width="33"
        height="33"
        rx="9"
        fill={isInverted ? '#FFFFFF' : '#4338CA'}
      />
      <rect
        x="2"
        y="2"
        width="32"
        height="32"
        rx="8.5"
        stroke={isInverted ? '#4338CA' : '#FFFFFF'}
        strokeOpacity={isInverted ? '0.12' : '0.18'}
        strokeWidth="1"
      />

      {/* Inner Turning Folio Leaf */}
      <path
        d="M16.5 7.5H22.5C25.2614 7.5 27.5 9.73858 27.5 12.5V18.5C27.5 19.6046 26.6046 20.5 25.5 20.5H18.5C17.3954 20.5 16.5 19.6046 16.5 18.5V7.5Z"
        fill={isInverted ? '#C7D2FE' : '#E0E7FF'}
      />

      {/* Signature Swallowtail Bookmark Ribbon (Warm Amber Gold) */}
      <path
        d="M20.25 7.5H23.75V15.25L22 13.75L20.25 15.25V7.5Z"
        fill="#F59E0B"
      />

      {/* Structural Hardcover Spine & Base Folio ('L' Monogram) */}
      <path
        d="M8.5 9.5C8.5 8.39543 9.39543 7.5 10.5 7.5H14V21.5C14 22.3284 14.6716 23 15.5 23H25.5C26.6046 23 27.5 23.8954 27.5 25V26.5C27.5 27.6046 26.6046 28.5 25.5 28.5H11.5C9.84315 28.5 8.5 27.1569 8.5 25.5V9.5Z"
        fill={isInverted ? '#4338CA' : '#FFFFFF'}
      />

      {/* Library Catalog Spine Index Tag */}
      <rect
        x="10.25"
        y="10.25"
        width="2"
        height="4.5"
        rx="1"
        fill={isInverted ? '#FFFFFF' : '#4338CA'}
        fillOpacity="0.35"
      />
    </svg>
  );
}

export interface LexoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inverted';
  badge?: string;
  subtitle?: string;
  iconOnly?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    mark: 'w-8 h-8',
    text: 'text-base',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-2.5',
  },
  md: {
    mark: 'w-9 h-9',
    text: 'text-lg',
    dot: 'w-1.5 h-1.5',
    gap: 'gap-2.5',
  },
  lg: {
    mark: 'w-11 h-11',
    text: 'text-xl',
    dot: 'w-2 h-2',
    gap: 'gap-3',
  },
};

export function LexoraLogo({
  size = 'md',
  variant = 'default',
  badge,
  subtitle,
  iconOnly = false,
  className,
}: LexoraLogoProps) {
  const cfg = sizeConfig[size];
  const isInverted = variant === 'inverted';

  if (iconOnly) {
    return <LexoraMark className={cn(cfg.mark, className)} variant={variant} />;
  }

  return (
    <div className={cn('inline-flex items-center', cfg.gap, className)}>
      <LexoraMark className={cfg.mark} variant={variant} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              'font-extrabold tracking-tight font-sans inline-flex items-baseline',
              cfg.text,
              isInverted ? 'text-white' : 'text-foreground'
            )}
          >
            <span>Lexora</span>
            <span
              className={cn(
                'rounded-full bg-amber-500 ml-0.5 inline-block shrink-0',
                cfg.dot
              )}
              aria-hidden="true"
            />
          </span>

          {badge && (
            <span
              className={cn(
                'px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded',
                isInverted
                  ? 'bg-white/20 text-white'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <span
            className={cn(
              'block text-xs font-medium mt-0.5 leading-tight',
              isInverted ? 'text-indigo-200' : 'text-muted'
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

