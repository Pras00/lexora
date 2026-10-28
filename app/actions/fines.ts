'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function confirmFinePayment(fineId: string) {
  const { user, profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat mengonfirmasi pembayaran denda.' };
  }

  try {
    await sql`
      UPDATE public.fines
      SET status = 'paid',
          paid_at = now(),
          confirmed_by = ${user?.id || profile.id}
      WHERE id = ${fineId}
    `;

    revalidatePath('/admin/fines');
    revalidatePath('/admin/reports');
    revalidatePath('/fines');
    return { success: true };
  } catch (err: any) {
    console.error('Error confirming fine payment:', err);
    return { success: false, error: err.message || 'Gagal mengonfirmasi pelunasan denda.' };
  }
}

