import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookCatalogClient } from '@/components/books/BookCatalogClient';
import { BookWithCategory, Category } from '@/types';

// Fallback data jika database belum terisi
const fallbackCategories: Category[] = [
  { id: 'cat-1', name: 'Teknologi & Pemrograman', slug: 'teknologi-pemrograman', description: null, created_at: '' },
  { id: 'cat-2', name: 'Sains & Matematika', slug: 'sains-matematika', description: null, created_at: '' },
  { id: 'cat-3', name: 'Fiksi & Sastra', slug: 'fiksi-sastra', description: null, created_at: '' },
  { id: 'cat-4', name: 'Bisnis & Manajemen', slug: 'bisnis-manajemen', description: null, created_at: '' },
];

const fallbackBooks: BookWithCategory[] = [
  {
    id: 'book-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category_id: 'cat-1',
    publisher: 'Prentice Hall',
    published_year: 2008,
    description: 'Panduan legendaris tentang penulisan kode bersih dan refactoring.',
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    price: 250000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: fallbackCategories[0],
  },
  {
    id: 'book-2',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category_id: 'cat-1',
    publisher: 'OReilly Media',
    published_year: 2017,
    description: 'Prinsip di balik arsitektur sistem penyimpanan data dan reliabilitas.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    price: 380000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: fallbackCategories[0],
  },
  {
    id: 'book-3',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    isbn: '978-9799731234',
    category_id: 'cat-3',
    publisher: 'Lentera Dipantara',
    published_year: 1980,
    description: 'Roman sejarah kisah Minke di era kolonial Hindia Belanda.',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    price: 115000,
    total_stock: 6,
    available_stock: 6,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: fallbackCategories[2],
  },
  {
    id: 'book-4',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '978-0307887894',
    category_id: 'cat-4',
    publisher: 'Crown Business',
    published_year: 2011,
    description: 'Inovasi berkelanjutan dengan metodologi Build-Measure-Learn.',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    price: 220000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '',
    updated_at: '',
    category: fallbackCategories[3],
  },
];

interface CatalogPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    cat?: string | string[];
    category?: string | string[];
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  let books: BookWithCategory[] = fallbackBooks;
  let categories: Category[] = fallbackCategories;

  const resolvedParams = searchParams ? await searchParams : {};
  const rawQ = resolvedParams.q;
  const rawCat = resolvedParams.cat || resolvedParams.category;

  const initialQuery = typeof rawQ === 'string' ? rawQ : Array.isArray(rawQ) ? rawQ[0] || '' : '';
  const initialCategory = typeof rawCat === 'string' ? rawCat : Array.isArray(rawCat) ? rawCat[0] || 'all' : 'all';

  try {
    if (process.env.DATABASE_URL) {
      const [dbBooks, dbCats] = await Promise.all([
        sql`
          SELECT b.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
          FROM books b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.status = 'active'
          ORDER BY b.created_at DESC
        `,
        sql`SELECT * FROM categories ORDER BY name ASC`,
      ]);

      if (dbBooks && dbBooks.length > 0) {
        books = dbBooks as unknown as BookWithCategory[];
      }
      if (dbCats && dbCats.length > 0) {
        categories = dbCats as unknown as Category[];
      }
    }
  } catch (error) {
    console.warn('Menggunakan data fallback untuk katalog:', error);
  }

  return (
    <div>
      <PageHeader
        title="Katalog Koleksi Buku"
        description="Jelajahi dan pilih buku yang ingin Anda pinjam dari perpustakaan Lexora."
      />
      <BookCatalogClient
        initialBooks={books}
        categories={categories}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
      />
    </div>
  );
}
