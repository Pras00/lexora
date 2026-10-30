'use server';

import { sql } from '@/lib/db/neon';
import { bookSchema, BookInput } from '@/lib/validations/book.schema';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createBook(input: BookInput) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat menambah buku.' };
  }

  const validated = bookSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Data tidak valid' };
  }

  const values = validated.data;

  try {
    const rows = await sql`
      INSERT INTO public.books (
        title,
        author,
        isbn,
        category_id,
        publisher,
        published_year,
        description,
        cover_url,
        price,
        total_stock,
        available_stock,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${values.title},
        ${values.author},
        ${values.isbn},
        ${values.categoryId},
        ${values.publisher || null},
        ${values.publishedYear || null},
        ${values.description || null},
        ${values.coverUrl || null},
        ${values.price},
        ${values.totalStock},
        ${values.totalStock},
        ${values.status},
        now(),
        now()
      )
      RETURNING id
    `;

    revalidatePath('/admin/books');
    revalidatePath('/catalog');
    revalidatePath('/');
    return { success: true, id: rows[0]?.id };
  } catch (err: any) {
    console.error('Error creating book:', err);
    return { success: false, error: err.message || 'Gagal menambahkan buku.' };
  }
}

export async function updateBook(id: string, input: BookInput) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat mengubah data buku.' };
  }

  const validated = bookSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Data tidak valid' };
  }

  const values = validated.data;

  try {
    // Ambil data buku saat ini untuk kalkulasi selisih available_stock
    const current = await sql`
      SELECT total_stock, available_stock FROM public.books WHERE id = ${id} LIMIT 1
    `;

    if (!current || current.length === 0) {
      return { success: false, error: 'Buku tidak ditemukan.' };
    }

    const currentTotal = current[0].total_stock;
    const currentAvailable = current[0].available_stock;
    const stockDiff = values.totalStock - currentTotal;
    const newAvailableStock = Math.max(0, currentAvailable + stockDiff);

    await sql`
      UPDATE public.books
      SET title = ${values.title},
          author = ${values.author},
          isbn = ${values.isbn},
          category_id = ${values.categoryId},
          publisher = ${values.publisher || null},
          published_year = ${values.publishedYear || null},
          description = ${values.description || null},
          cover_url = ${values.coverUrl || null},
          price = ${values.price},
          total_stock = ${values.totalStock},
          available_stock = ${newAvailableStock},
          status = ${values.status},
          updated_at = now()
      WHERE id = ${id}
    `;

    revalidatePath('/admin/books');
    revalidatePath(`/admin/books/${id}/edit`);
    revalidatePath('/catalog');
    revalidatePath(`/catalog/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating book:', err);
    return { success: false, error: err.message || 'Gagal memperbarui data buku.' };
  }
}

export async function deleteBook(id: string) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat menghapus buku.' };
  }

  try {
    await sql`
      DELETE FROM public.books
      WHERE id = ${id}
    `;

    revalidatePath('/admin/books');
    revalidatePath('/catalog');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting book:', err);
    return { success: false, error: err.message || 'Buku sedang dipinjam atau terkait riwayat sirkulasi.' };
  }
}

export async function getLatestBooksStock(bookIds: string[]) {
  if (!bookIds || bookIds.length === 0) {
    return { success: true, books: [] };
  }

  try {
    const rows = await sql`
      SELECT 
        b.id,
        b.title,
        b.available_stock,
        b.total_stock,
        b.price,
        b.status,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        ) as category
      FROM public.books b
      LEFT JOIN public.categories c ON c.id = b.category_id
      WHERE b.id = ANY(${bookIds}::uuid[])
    `;

    return {
      success: true,
      books: rows as {
        id: string;
        title: string;
        available_stock: number;
        total_stock: number;
        price: number;
        status: string;
        category: { id: string; name: string; slug: string } | null;
      }[],
    };
  } catch (err: any) {
    console.error('Error fetching latest books stock:', err);
    return { success: false, error: err.message || 'Gagal memverifikasi stok buku terbaru.' };
  }
}


