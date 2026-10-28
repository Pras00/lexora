import { sql } from '@/lib/db/neon';
import { AdminBooksClient } from './AdminBooksClient';
import { BookWithCategory, Category } from '@/types';

export default async function AdminBooksPage() {
  let books: BookWithCategory[] = [];
  let categories: Category[] = [];

  try {
    if (process.env.DATABASE_URL) {
      const [booksData, catData] = await Promise.all([
        sql`
          SELECT b.*, json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
          FROM books b
          LEFT JOIN categories c ON b.category_id = c.id
          ORDER BY b.created_at DESC
        `,
        sql`SELECT * FROM categories ORDER BY name ASC`,
      ]);

      if (booksData) books = booksData as unknown as BookWithCategory[];
      if (catData) categories = catData as unknown as Category[];
    }
  } catch (err) {
    console.warn('Error fetching admin books from NeonDB:', err);
  }

  return <AdminBooksClient initialBooks={books} categories={categories} />;
}
