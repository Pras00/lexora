import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 pb-5 border-b border-[var(--border)]">
      {/* Breadcrumbs jika ada */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[var(--muted)] mb-2">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.name}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-[var(--foreground)] font-medium' : ''}>
                    {item.name}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Title + Description + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
