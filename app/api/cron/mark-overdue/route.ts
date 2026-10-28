import { NextResponse, type NextRequest } from 'next/server';
import { sql } from '@/lib/db/neon';
import { calculateOverdueFine } from '@/lib/fine-calculator';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Cari semua loan_item yang masih borrowed dan due_date < now
    const overdueItems = await sql`
      SELECT li.id, li.due_date, l.user_id
      FROM public.loan_items li
      JOIN public.loans l ON l.id = li.loan_id
      WHERE li.status = 'borrowed' AND li.due_date < ${now.toISOString()}
    `;

    let updatedCount = 0;

    for (const item of overdueItems as { id: string; due_date: string; user_id: string }[]) {
      // Tandai status jadi overdue
      await sql`
        UPDATE public.loan_items
        SET status = 'overdue'
        WHERE id = ${item.id}
      `;

      // Hitung denda keterlambatan
      const { daysOverdue, fineAmount } = calculateOverdueFine(item.due_date, now);

      if (fineAmount > 0) {
        // Cek apakah sudah ada record fine overdue untuk item ini
        const existingFines = await sql`
          SELECT id
          FROM public.fines
          WHERE loan_item_id = ${item.id} AND type = 'overdue'
          LIMIT 1
        `;

        if (existingFines.length > 0) {
          // Update nominal denda harian
          await sql`
            UPDATE public.fines
            SET amount = ${fineAmount},
                days_overdue = ${daysOverdue}
            WHERE id = ${existingFines[0].id}
          `;
        } else {
          // Buat denda baru
          await sql`
            INSERT INTO public.fines (
              loan_item_id,
              user_id,
              type,
              amount,
              days_overdue,
              status
            ) VALUES (
              ${item.id},
              ${item.user_id},
              'overdue',
              ${fineAmount},
              ${daysOverdue},
              'unpaid'
            )
          `;
        }
      }
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      markedOverdueCount: updatedCount,
    });
  } catch (err: any) {
    console.error('Cron mark-overdue error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
