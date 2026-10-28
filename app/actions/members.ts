'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateMemberStatus(
  id: string,
  newStatus: 'active' | 'suspended' | 'blocked'
) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat mengubah status anggota.' };
  }

  try {
    if (newStatus === 'suspended') {
      const suspendedUntil = new Date();
      suspendedUntil.setDate(suspendedUntil.getDate() + 7);
      await sql`
        UPDATE public.profiles
        SET status = ${newStatus},
            suspended_until = ${suspendedUntil.toISOString()},
            updated_at = now()
        WHERE id = ${id}
      `;
    } else {
      const resetNoShow = newStatus === 'active';
      if (resetNoShow) {
        await sql`
          UPDATE public.profiles
          SET status = ${newStatus},
              suspended_until = NULL,
              no_show_count = 0,
              updated_at = now()
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE public.profiles
          SET status = ${newStatus},
              suspended_until = NULL,
              updated_at = now()
          WHERE id = ${id}
        `;
      }
    }

    revalidatePath('/admin/members');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating member status:', err);
    return { success: false, error: err.message || 'Gagal memperbarui status anggota.' };
  }
}

