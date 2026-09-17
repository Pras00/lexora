import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BookForm } from '@/components/books/BookForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Book, Category } from '@/types';

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  let book: Book | null = null;
  let categories: Category[] = [];

  try {
    const supabase = await createClient();
    const [bookRes, catRes] = await Promise.all([
      supabase.from('books').select('*').eq('id', id).single(),
      supabase.from('categories').select('*').order('name', { ascending: true }),
    ]);

    if (bookRes.data) book = bookRes.data;
    if (catRes.data) categories = catRes.data;
  } catch (err) {
    console.warn('Error fetching book for edit:', err);
  }

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Buku: ${book.title}`}
        description="Perbarui informasi koleksi dan jumlah stok fisik buku."
      />
      <BookForm categories={categories} initialData={book} isEditing />
    </div>
  );
}
