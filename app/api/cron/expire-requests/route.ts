import { NextResponse, type NextRequest } from 'next/server';
import { sql } from '@/lib/db/neon';

export async function GET(request: NextRequest) {
  // Verifikasi Bearer Token Cron Secret jika dikonfigurasi
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // 1. Update loan_requests yang pending dan sudah melewati expires_at (> 24 jam)
    const expiredRequests = await sql`
      UPDATE public.loan_requests
      SET status = 'expired'
      WHERE status = 'pending' AND expires_at < ${now}
      RETURNING id
    `;

    if (expiredRequests.length > 0) {
      const expiredIds = expiredRequests.map((r: any) => r.id);
      await sql`
        UPDATE public.loan_request_items
        SET status = 'rejected',
            rejection_reason = 'Kedaluwarsa otomatis (melewati 24 jam).'
        WHERE request_id = ANY(${expiredIds})
      `;
    }

    // 2. Cari request yang approved tapi melewati pickup_deadline (not_picked_up)
    const notPickedUpRequests = await sql`
      SELECT id, user_id
      FROM public.loan_requests
      WHERE status = 'approved' AND pickup_deadline < ${now}
    `;

    if (notPickedUpRequests.length > 0) {
      for (const req of notPickedUpRequests as { id: string; user_id: string }[]) {
        // Update request status
        await sql`
          UPDATE public.loan_requests
          SET status = 'not_picked_up'
          WHERE id = ${req.id}
        `;

        // Update pickup pass status
        await sql`
          UPDATE public.pickup_passes
          SET status = 'expired'
          WHERE request_id = ${req.id}
        `;

        // Kembalikan stok buku yang sempat di-hold
        const items = await sql`
          SELECT book_id
          FROM public.loan_request_items
          WHERE request_id = ${req.id} AND status = 'approved'
        `;

        for (const item of items as { book_id: string }[]) {
          await sql`
            UPDATE public.books
            SET available_stock = available_stock + 1
            WHERE id = ${item.book_id}
          `;
        }

        // Tambah no_show_count user
        const profiles = await sql`
          SELECT no_show_count
          FROM public.profiles
          WHERE id = ${req.user_id}
          LIMIT 1
        `;

        if (profiles.length > 0) {
          const newCount = (profiles[0].no_show_count || 0) + 1;
          if (newCount >= 3) {
            const suspendUntil = new Date();
            suspendUntil.setDate(suspendUntil.getDate() + 7);
            await sql`
              UPDATE public.profiles
              SET no_show_count = ${newCount},
                  status = 'suspended',
                  suspended_until = ${suspendUntil.toISOString()}
              WHERE id = ${req.user_id}
            `;
          } else {
            await sql`
              UPDATE public.profiles
              SET no_show_count = ${newCount}
              WHERE id = ${req.user_id}
            `;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredRequests.length,
      notPickedUpCount: notPickedUpRequests.length,
    });
  } catch (err: any) {
    console.error('Cron expire-requests error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
