import { sql } from '@/lib/db/neon';
import { BookForm } from '@/components/books/BookForm';
import { PageHeader } from '@/components/shared/PageHeader';
import { Category } from '@/types';

export default async function NewBookPage() {
  let categories: Category[] = [];

  try {
    const rows = await sql`SELECT * FROM categories ORDER BY name ASC`;
    if (rows) categories = rows as unknown as Category[];
  } catch (err) {
    console.warn('Error fetching categories from NeonDB:', err);
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
