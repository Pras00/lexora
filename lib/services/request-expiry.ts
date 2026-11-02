import { sql } from '@/lib/db/neon';

/**
 * Hasil pemrosesan pengajuan kedaluwarsa.
 */
export interface ProcessExpiredResult {
  expiredPendingCount: number;
  notPickedUpCount: number;
}

/**
 * Memeriksa dan memproses seluruh pengajuan yang telah melewati batas waktu (on-demand):
 * 1. Pengajuan pending yang melewati batas verifikasi pustakawan (expires_at < NOW())
 *    -> diubah menjadi 'expired', item ditandai 'rejected', dan stok fisik dikembalikan ke rak (soft-hold release).
 * 2. Pengajuan approved yang melewati batas waktu pengambilan loket (pickup_deadline < NOW())
 *    -> diubah menjadi 'not_picked_up', tiket pass kedaluwarsa, stok dikembalikan, dan menambah no-show count pemustaka.
 */
export async function processExpiredRequests(): Promise<ProcessExpiredResult> {
  try {
    const now = new Date().toISOString();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. TANGANI PENGAJUAN 'PENDING' YANG MELEWATI EXPIRES_AT
    // ──────────────────────────────────────────────────────────────────────────
    const expiredPendingRows = await sql`
      SELECT id, request_number, user_id
      FROM public.loan_requests
      WHERE status = 'pending' AND expires_at < ${now}
    `;

    let expiredPendingCount = 0;

    if (expiredPendingRows && expiredPendingRows.length > 0) {
      const expiredIds = expiredPendingRows.map((r: any) => r.id);

      // Cari buku-buku pada pengajuan yang berstatus pending untuk dilepas soft-hold-nya
      const itemsToRefund = await sql`
        SELECT book_id, COUNT(*) as qty
        FROM public.loan_request_items
        WHERE request_id = ANY(${expiredIds}::uuid[])
          AND status = 'pending'
        GROUP BY book_id
      `;

      // Kembalikan stok fisik untuk setiap buku (dijaga agar LEAST(total_stock) tidak overflow)
      for (const item of itemsToRefund as { book_id: string; qty: number }[]) {
        await sql`
          UPDATE public.books
          SET available_stock = LEAST(total_stock, available_stock + ${Number(item.qty)}),
              updated_at = NOW()
          WHERE id = ${item.book_id}
        `;
      }

      // Tandai item-itemnya sebagai rejected dengan alasan informatif
      await sql`
        UPDATE public.loan_request_items
        SET status = 'rejected',
            rejection_reason = 'Kedaluwarsa otomatis (melewati batas waktu verifikasi pustakawan).'
        WHERE request_id = ANY(${expiredIds}::uuid[])
          AND status = 'pending'
      `;

      // Ubah status loan_requests menjadi 'expired'
      await sql`
        UPDATE public.loan_requests
        SET status = 'expired'
        WHERE id = ANY(${expiredIds}::uuid[])
      `;

      expiredPendingCount = expiredPendingRows.length;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. TANGANI PENGAJUAN 'APPROVED' YANG MELEWATI PICKUP_DEADLINE (TIDAK DIAMBIL)
    // ──────────────────────────────────────────────────────────────────────────
    const notPickedUpRows = await sql`
      SELECT id, user_id
      FROM public.loan_requests
      WHERE status = 'approved' AND pickup_deadline < ${now}
    `;

    let notPickedUpCount = 0;

    if (notPickedUpRows && notPickedUpRows.length > 0) {
      for (const req of notPickedUpRows as { id: string; user_id: string }[]) {
        // Update status request
        await sql`
          UPDATE public.loan_requests
          SET status = 'not_picked_up'
          WHERE id = ${req.id}
        `;

        // Update status tiket pickup pass
        await sql`
          UPDATE public.pickup_passes
          SET status = 'expired'
          WHERE request_id = ${req.id}
        `;

        // Kembalikan stok fisik buku yang sempat disetujui
        const approvedItems = await sql`
          SELECT book_id, COUNT(*) as qty
          FROM public.loan_request_items
          WHERE request_id = ${req.id} AND status = 'approved'
          GROUP BY book_id
        `;

        for (const item of approvedItems as { book_id: string; qty: number }[]) {
          await sql`
            UPDATE public.books
            SET available_stock = LEAST(total_stock, available_stock + ${Number(item.qty)}),
                updated_at = NOW()
            WHERE id = ${item.book_id}
          `;
        }

        // Tambah no_show_count user (terapkan sanksi suspensi 7 hari jika >= 3 kali)
        const profileRows = await sql`
          SELECT no_show_count
          FROM public.profiles
          WHERE id = ${req.user_id}
          LIMIT 1
        `;

        if (profileRows && profileRows.length > 0) {
          const newCount = (profileRows[0].no_show_count || 0) + 1;
          if (newCount >= 3) {
            const suspendUntil = new Date();
            suspendUntil.setDate(suspendUntil.getDate() + 7);
            await sql`
              UPDATE public.profiles
              SET no_show_count = ${newCount},
                  status = 'suspended',
                  suspended_until = ${suspendUntil.toISOString()},
                  updated_at = NOW()
              WHERE id = ${req.user_id}
            `;
          } else {
            await sql`
              UPDATE public.profiles
              SET no_show_count = ${newCount},
                  updated_at = NOW()
              WHERE id = ${req.user_id}
            `;
          }
        }
      }

      notPickedUpCount = notPickedUpRows.length;
    }

    return { expiredPendingCount, notPickedUpCount };
  } catch (err) {
    console.warn('Error executing processExpiredRequests in NeonDB:', err);
    return { expiredPendingCount: 0, notPickedUpCount: 0 };
  }
}
