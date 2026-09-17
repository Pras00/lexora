import { createClient } from '@/lib/supabase/server';
import { AdminBooksClient } from './AdminBooksClient';
import { BookWithCategory, Category } from '@/types';

export default async function AdminBooksPage() {
  let books: BookWithCategory[] = [];
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const [booksRes, catRes] = await Promise.all([
      supabase
        .from('books')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true }),
    ]);

    if (booksRes.data) books = booksRes.data as unknown as BookWithCategory[];
    if (catRes.data) categories = catRes.data as Category[];
  } catch (err) {
    console.warn('Error fetching admin books:', err);
  }

  return <AdminBooksClient initialBooks={books} categories={categories} />;
}
