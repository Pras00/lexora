import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  // Verifikasi Bearer Token Cron Secret
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // 1. Cari request yang pending dan sudah melewati expires_at (> 24 jam)
    const { data: expiredRequests, error: findError } = await supabase
      .from('loan_requests')
      .select('id')
      .eq('status', 'pending')
      .lt('expires_at', now);

    if (findError) throw findError;

    if (expiredRequests && expiredRequests.length > 0) {
      const ids = expiredRequests.map((r) => r.id);

      await supabase
        .from('loan_requests')
        .update({ status: 'expired' })
        .in('id', ids);

      await supabase
        .from('loan_request_items')
        .update({ status: 'rejected', rejection_reason: 'Kedaluwarsa otomatis (melewati 24 jam).' })
        .in('request_id', ids);
    }

    // 2. Cari request yang approved tapi melewati pickup_deadline (not_picked_up)
    const { data: notPickedUpRequests } = await supabase
      .from('loan_requests')
      .select('id, user_id, items:loan_request_items(book_id)')
      .eq('status', 'approved')
      .lt('pickup_deadline', now);

    if (notPickedUpRequests && notPickedUpRequests.length > 0) {
      for (const req of notPickedUpRequests) {
        // Update request status
        await supabase
          .from('loan_requests')
          .update({ status: 'not_picked_up' })
          .eq('id', req.id);

        // Update pickup pass status
        await supabase
          .from('pickup_passes')
          .update({ status: 'expired' })
          .eq('request_id', req.id);

        // Kembalikan stok buku yang sempat di-hold
        for (const item of ((req as any).items || [])) {
          const { data: book } = await supabase
            .from('books')
            .select('available_stock')
            .eq('id', item.book_id)
            .single();

          if (book) {
            await supabase
              .from('books')
              .update({ available_stock: book.available_stock + 1 })
              .eq('id', item.book_id);
          }
        }

        // Tambah no_show_count user
        const { data: profile } = await supabase
          .from('profiles')
          .select('no_show_count')
          .eq('id', req.user_id)
          .single();

        if (profile) {
          const newCount = profile.no_show_count + 1;
          const updateData: any = { no_show_count: newCount };

          if (newCount >= 3) {
            const suspendUntil = new Date();
            suspendUntil.setDate(suspendUntil.getDate() + 7);
            updateData.status = 'suspended';
            updateData.suspended_until = suspendUntil.toISOString();
          }

          await supabase.from('profiles').update(updateData).eq('id', req.user_id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredRequests?.length || 0,
      notPickedUpCount: notPickedUpRequests?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
