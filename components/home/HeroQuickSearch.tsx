'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

const TRENDING_TOPICS = [
  { label: 'Teknologi', query: 'Teknologi' },
  { label: 'Fiksi', query: 'Fiksi' },
  { label: 'Bisnis', query: 'Bisnis' },
  { label: 'Sains', query: 'Sains' },
] as const;

interface HeroQuickSearchProps {
  isAuthenticated?: boolean;
}

export function HeroQuickSearch({ isAuthenticated = false }: HeroQuickSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    const targetUrl = trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : '/catalog';

    if (!isAuthenticated) {
      // Alur usecase aman: user yang belum login diarahkan ke login dulu bersama tujuan pencarian
      router.push(`/login?redirectTo=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  const handleTopicClick = (topicQuery: string) => {
    const targetUrl = `/catalog?q=${encodeURIComponent(topicQuery)}`;

    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <div className="w-full max-w-lg mt-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-1.5 bg-surface border border-border rounded-2xl shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <div className="pl-3 text-muted shrink-0">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul buku, penulis, atau topik..."
          className="w-full bg-transparent border-0 text-sm text-foreground placeholder:text-muted focus:outline-none px-2 py-1.5"
          aria-label="Pencarian cepat katalog buku"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors shrink-0 cursor-pointer"
        >
          <span>Cari</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Trending / Recommended Quick Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted">
        <span className="font-semibold text-foreground/80 text-xs">Topik Populer:</span>
        {TRENDING_TOPICS.map((topic) => (
          <button
            key={topic.label}
            type="button"
            onClick={() => handleTopicClick(topic.query)}
            className="px-2.5 py-1 rounded-lg bg-surface-secondary text-muted hover:text-foreground hover:bg-surface border border-border transition-colors text-xs font-medium cursor-pointer"
          >
            #{topic.label}
          </button>
        ))}
      </div>
    </div>
  );
}
