import { createClient } from '@/lib/supabase/server';
import { BookForm } from '@/components/books/BookForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Category } from '@/types';

export default async function NewBookPage() {
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (data) categories = data;
  } catch (err) {
    console.warn('Error fetching categories:', err);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Koleksi Buku Baru"
        description="Masukkan data detail buku ke inventori perpustakaan Lexora."
      />
      <BookForm categories={categories} />
    </div>
  );
}
