import { sql } from '@/lib/db/neon';
import { AdminCategoriesClient } from './AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categoriesWithCount: any[] = [];

  try {
    const rows = await sql`
      SELECT c.*, COUNT(b.id)::int as "booksCount"
      FROM categories c
      LEFT JOIN books b ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;

    if (rows) {
      categoriesWithCount = rows;
    }
  } catch (err) {
    console.warn('Error fetching categories from NeonDB:', err);
  }

  return <AdminCategoriesClient categories={categoriesWithCount} />;
}
