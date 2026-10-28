import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
import { BookDetailClient } from '@/components/books/BookDetailClient';
import { BookWithCategory } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let book: BookWithCategory | null = null;

  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT b.id, b.title, b.author, b.isbn, b.category_id, b.publisher, b.published_year,
               b.description, b.cover_url, b.price::float as price, b.total_stock, b.available_stock,
               b.status, b.created_at, b.updated_at,
               json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.id::text = ${id}
        LIMIT 1
      `;

      if (rows && rows.length > 0) {
        book = rows[0] as unknown as BookWithCategory;
      }
    }
  } catch (err) {
    console.warn('Error fetching book detail from NeonDB:', err);
  }

  // Fallback demo mock
  if (!book) {
    const mockBooks: Record<string, BookWithCategory> = {
      'a5e18e45-08ae-414f-b1a4-8a8c3931f2fe': {
        id: 'a5e18e45-08ae-414f-b1a4-8a8c3931f2fe',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category_id: 'a0000000-0000-0000-0000-000000000001',
        publisher: 'Prentice Hall',
        published_year: 2008,
        description: 'Buku wajib untuk software engineer yang ingin menghasilkan kode berkualitas tinggi, mudah dibaca, dan mudah dirawat.',
        cover_url: '/covers/clean-code.jpg',
        price: 250000,
        total_stock: 5,
        available_stock: 5,
        status: 'active',
        created_at: '2026-10-28T04:09:27.974Z',
        updated_at: '2026-10-28T04:09:27.974Z',
        category: {
          id: 'a0000000-0000-0000-0000-000000000001',
          name: 'Teknologi & Pemrograman',
          slug: 'teknologi-pemrograman',
          description: null,
          created_at: '2026-10-28T04:09:27.974Z',
        },
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
