'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(fullName: string, phone: string | null) {
  const { user } = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu.' };
  }

  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return { success: false, error: 'Nama lengkap tidak boleh kosong.' };
  }

  try {
    await sql`
      UPDATE public.profiles
      SET full_name = ${trimmedName},
          phone = ${phone?.trim() || null},
          updated_at = now()
      WHERE id = ${user.id}
    `;

    revalidatePath('/profile');
    revalidatePath('/admin/profile');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating profile:', err);
    return { success: false, error: err.message || 'Gagal memperbarui profil.' };
  }
}

export async function updatePassword(password: string) {
  const { user } = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu.' };
  }

  if (!password || password.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' };
  }

  try {
    await sql`
      UPDATE public.profiles
      SET password_hash = crypt(${password}, gen_salt('bf')),
          updated_at = now()
      WHERE id = ${user.id}
    `;

    return { success: true };
  } catch (err: any) {
    console.error('Error updating password:', err);
    return { success: false, error: err.message || 'Gagal memperbarui kata sandi.' };
  }
}

