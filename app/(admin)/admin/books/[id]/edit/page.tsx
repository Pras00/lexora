import { notFound } from 'next/navigation';
import { sql } from '@/lib/db/neon';
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
    const [bookRows, catRows] = await Promise.all([
      sql`SELECT * FROM books WHERE id::text = ${id} LIMIT 1`,
      sql`SELECT * FROM categories ORDER BY name ASC`,
    ]);

    if (bookRows && bookRows.length > 0) book = bookRows[0] as unknown as Book;
    if (catRows) categories = catRows as unknown as Category[];
  } catch (err) {
    console.warn('Error fetching book for edit from NeonDB:', err);
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
