'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { calculatePickupDeadline } from '@/lib/working-days';
import { generatePickupCode } from '@/lib/pickup-code';
import { revalidatePath } from 'next/cache';

export async function createLoanRequest(bookIds: string[]) {
  const { user, profile } = await getCurrentUser();
  if (!user || !profile) {
    return { success: false, error: 'Silakan masuk terlebih dahulu untuk mengajukan pinjaman.' };
  }

  if (!bookIds || bookIds.length === 0) {
    return { success: false, error: 'Keranjang pinjaman kosong.' };
  }

  try {
    // 1. Cek apakah ada denda yang belum dibayar
    const unpaidFines = await sql`
      SELECT id FROM public.fines WHERE user_id = ${user.id} AND status = 'unpaid' LIMIT 1
    `;

    if (unpaidFines.length > 0) {
      return {
        success: false,
        error: 'Anda memiliki denda yang belum diselesaikan. Harap lunasi denda sebelum mengajukan peminjaman baru.',
      };
    }

    // 2. Cek apakah user sedang ditangguhkan
    if (profile.status === 'suspended') {
      const until = profile.suspended_until
        ? new Date(profile.suspended_until).toLocaleDateString('id-ID')
        : 'beberapa hari ke depan';
      return {
        success: false,
        error: `Akun Anda sedang ditangguhkan hingga ${until} karena riwayat no-show 3x.`,
      };
    }

    if (profile.status === 'blocked') {
      return {
        success: false,
        error: 'Akun Anda sedang diblokir oleh pihak perpustakaan.',
      };
    }

    // 3. Simpan Loan Request
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Auto-expire 24 jam

    const reqRows = await sql`
      INSERT INTO public.loan_requests (
        user_id,
        status,
        expires_at,
        created_at,
        updated_at
      ) VALUES (
        ${user.id},
        'pending',
        ${expiresAt.toISOString()},
        now(),
        now()
      )
      RETURNING id, request_number
    `;

    const request = reqRows[0];

    // 4. Masukkan item-item buku
    for (const bookId of bookIds) {
      await sql`
        INSERT INTO public.loan_request_items (
          request_id,
          book_id,
          status,
          created_at
        ) VALUES (
          ${request.id},
          ${bookId},
          'pending',
          now()
        )
      `;
    }

    revalidatePath('/requests');
    revalidatePath('/dashboard');
    revalidatePath('/admin/requests');

    return { success: true, requestId: request.id };
  } catch (err: any) {
    console.error('Error creating loan request:', err);
    return { success: false, error: err.message || 'Gagal membuat pengajuan peminjaman.' };
  }
}

export async function reviewLoanRequest(
  requestId: string,
  decisions: Record<string, { approved: boolean; reason: string }>
) {
  const { user, profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat memverifikasi pengajuan.' };
  }

  try {
    const approvedBookIds = Object.entries(decisions)
      .filter(([_, d]) => d.approved)
      .map(([bookId]) => bookId);

    // Skenario A: Semua Ditolak
    if (approvedBookIds.length === 0) {
      await sql`
        UPDATE public.loan_requests
        SET status = 'rejected',
            admin_id = ${user?.id || profile.id},
            processed_at = now(),
            updated_at = now()
        WHERE id = ${requestId}
      `;

      for (const [bookId, d] of Object.entries(decisions)) {
        await sql`
          UPDATE public.loan_request_items
          SET status = 'rejected',
              rejection_reason = ${d.reason || 'Ditolak oleh petugas perpustakaan.'}
          WHERE request_id = ${requestId} AND book_id = ${bookId}
        `;
      }

      revalidatePath(`/admin/requests/${requestId}`);
      revalidatePath('/admin/requests');
      revalidatePath(`/requests/${requestId}`);
      revalidatePath('/requests');
      return { success: true };
    }

    // Skenario B: Ada yang Disetujui
    const pickupDeadline = calculatePickupDeadline(new Date(), 2);
    const pickupCode = generatePickupCode();

    // Panggil atomic stored function di PostgreSQL
    await sql`
      SELECT public.approve_loan_request(
        ${requestId}::uuid,
        ${user?.id || profile.id}::uuid,
        ${approvedBookIds}::uuid[],
        ${pickupDeadline.toISOString()}::timestamptz,
        ${pickupCode}::text
      )
    `;

    // Update alasan penolakan jika ada item yang tidak disetujui
    for (const [bookId, d] of Object.entries(decisions)) {
      if (!d.approved) {
        await sql`
          UPDATE public.loan_request_items
          SET rejection_reason = ${d.reason || 'Stok tidak mencukupi.'}
          WHERE request_id = ${requestId} AND book_id = ${bookId}
        `;
      }
    }

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath('/admin/requests');
    revalidatePath(`/requests/${requestId}`);
    revalidatePath('/requests');
    revalidatePath('/catalog');

    return { success: true };
  } catch (err: any) {
    console.error('Error reviewing loan request:', err);
    return { success: false, error: err.message || 'Gagal memproses persetujuan pengajuan.' };
  }
}

export async function cancelLoanRequest(requestId: string) {
  const { user, profile } = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu.' };
  }

  try {
    const reqRows = await sql`
      SELECT id, user_id, status FROM public.loan_requests WHERE id = ${requestId} LIMIT 1
    `;

    if (!reqRows || reqRows.length === 0) {
      return { success: false, error: 'Pengajuan tidak ditemukan.' };
    }

    const req = reqRows[0];

    if (req.user_id !== user.id && profile?.role !== 'admin') {
      return { success: false, error: 'Anda tidak memiliki hak akses membatalkan pengajuan ini.' };
    }

    // Jika sebelumnya status approved, kembalikan stok buku yang di-hold
    if (req.status === 'approved') {
      const approvedItems = await sql`
        SELECT book_id FROM public.loan_request_items
        WHERE request_id = ${requestId} AND status = 'approved'
      `;

      for (const item of approvedItems as { book_id: string }[]) {
        await sql`
          UPDATE public.books
          SET available_stock = available_stock + 1
          WHERE id = ${item.book_id}
        `;
      }

      await sql`
        UPDATE public.pickup_passes
        SET status = 'cancelled'
        WHERE request_id = ${requestId}
      `;
    }

    await sql`
      UPDATE public.loan_requests
      SET status = 'cancelled', updated_at = now()
      WHERE id = ${requestId}
    `;

    revalidatePath(`/requests/${requestId}`);
    revalidatePath('/requests');
    revalidatePath('/admin/requests');
    revalidatePath(`/admin/requests/${requestId}`);

    return { success: true };
  } catch (err: any) {
    console.error('Error cancelling loan request:', err);
    return { success: false, error: err.message || 'Gagal membatalkan pengajuan.' };
  }
}

