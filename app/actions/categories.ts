'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string, description?: string) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat menambah kategori.' };
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: 'Nama kategori wajib diisi.' };
  }

  const slug = trimmedName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  try {
    await sql`
      INSERT INTO public.categories (name, slug, description, created_at)
      VALUES (${trimmedName}, ${slug}, ${description?.trim() || null}, now())
    `;

    revalidatePath('/admin/categories');
    revalidatePath('/admin/books');
    revalidatePath('/catalog');
    return { success: true };
  } catch (err: any) {
    console.error('Error creating category:', err);
    return { success: false, error: err.message || 'Gagal menambahkan kategori.' };
  }
}

export async function deleteCategory(id: string) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat menghapus kategori.' };
  }

  try {
    await sql`
      DELETE FROM public.categories
      WHERE id = ${id}
    `;

    revalidatePath('/admin/categories');
    revalidatePath('/admin/books');
    revalidatePath('/catalog');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return {
      success: false,
      error: 'Kategori ini sedang memiliki buku terkait dan tidak dapat dihapus.',
    };
  }
}

