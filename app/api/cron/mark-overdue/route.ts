import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { calculateOverdueFine } from '@/lib/fine-calculator';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date();

    // Cari semua loan_item yang masih borrowed dan due_date < now
    const { data: overdueItems, error } = await supabase
      .from('loan_items')
      .select('*, loan:loans(user_id)')
      .eq('status', 'borrowed')
      .lt('due_date', now.toISOString());

    if (error) throw error;

    let updatedCount = 0;

    if (overdueItems && overdueItems.length > 0) {
      for (const item of overdueItems) {
        // Tandai status jadi overdue
        await supabase
          .from('loan_items')
          .update({ status: 'overdue' })
          .eq('id', item.id);

        // Hitung denda keterlambatan
        const { daysOverdue, fineAmount } = calculateOverdueFine(item.due_date, now);

        if (fineAmount > 0) {
          // Cek apakah sudah ada record fine overdue untuk item ini
          const { data: existingFine } = await supabase
            .from('fines')
            .select('id')
            .eq('loan_item_id', item.id)
            .eq('type', 'overdue')
            .single();

          if (existingFine) {
            // Update nominal denda harian
            await supabase
              .from('fines')
              .update({
                amount: fineAmount,
                days_overdue: daysOverdue,
              })
              .eq('id', existingFine.id);
          } else {
            // Buat denda baru
            await supabase.from('fines').insert({
              loan_item_id: item.id,
              user_id: (item.loan as any)?.user_id,
              type: 'overdue',
              amount: fineAmount,
              days_overdue: daysOverdue,
              status: 'unpaid',
            });
          }
        }
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      markedOverdueCount: updatedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
