import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { BookDetailClient } from '@/components/books/BookDetailClient';
import { BookWithCategory } from '@/types';

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let book: BookWithCategory | null = null;

  try {
    const rows = await sql`
      SELECT b.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id::text = ${id}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      book = rows[0] as unknown as BookWithCategory;
    }
  } catch (err) {
    console.warn('Error fetching book detail from NeonDB:', err);
  }

  // Fallback demo mock jika id book-1
  if (!book) {
    const mockBooks: Record<string, BookWithCategory> = {
      'book-1': {
        id: 'book-1',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category_id: 'cat-1',
        publisher: 'Prentice Hall',
        published_year: 2008,
        description: 'Buku wajib untuk software engineer yang ingin menghasilkan kode berkualitas tinggi, mudah dibaca, dan mudah dirawat.',
        cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
        price: 250000,
        total_stock: 5,
        available_stock: 5,
        status: 'active',
        created_at: '',
        updated_at: '',
        category: { id: 'cat-1', name: 'Teknologi & Pemrograman', slug: 'teknologi-pemrograman', description: null, created_at: '' },
      },
    };

    if (mockBooks[id]) {
      book = mockBooks[id];
    }
  }

  if (!book) {
    notFound();
  }

  return <BookDetailClient book={book} />;
}
