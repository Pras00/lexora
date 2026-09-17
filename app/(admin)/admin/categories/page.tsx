import { createClient } from '@/lib/supabase/server';
import { AdminCategoriesClient } from './AdminCategoriesClient';

export default async function AdminCategoriesPage() {
  let categoriesWithCount: any[] = [];

  try {
    const supabase = await createClient();
    const [catRes, booksRes] = await Promise.all([
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('books').select('category_id'),
    ]);

    if (catRes.data) {
      const books = booksRes.data || [];
      categoriesWithCount = catRes.data.map((cat) => {
        const count = books.filter((b) => b.category_id === cat.id).length;
        return {
          ...cat,
          booksCount: count,
        };
      });
    }
  } catch (err) {
    console.warn('Error fetching categories:', err);
  }

  return <AdminCategoriesClient categories={categoriesWithCount} />;
}
