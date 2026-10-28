'use server';

import { sql } from '@/lib/db/neon';
import { getCurrentUser } from '@/lib/auth';
import { calculateOverdueFine, calculateDamageReplacementCost } from '@/lib/fine-calculator';
import { DamageLevel } from '@/types';
import { revalidatePath } from 'next/cache';

export async function verifyPickupAndCreateLoan(pickupCode: string) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat memverifikasi pengambilan buku.' };
  }

  const code = pickupCode.trim().toUpperCase();
  if (!code) {
    return { success: false, error: 'Kode pickup tidak boleh kosong.' };
  }

  try {
    // 1. Cari pickup pass
    const passRows = await sql`
      SELECT p.*, r.user_id, r.request_number, prof.full_name as user_full_name
      FROM public.pickup_passes p
      JOIN public.loan_requests r ON r.id = p.request_id
      JOIN public.profiles prof ON prof.id = r.user_id
      WHERE p.pickup_code = ${code}
      LIMIT 1
    `;

    if (!passRows || passRows.length === 0) {
      return { success: false, error: 'Kode pickup tidak ditemukan. Harap periksa kembali 6 digit kode peminjam.' };
    }

    const pass = passRows[0];

    if (pass.status !== 'active') {
      return { success: false, error: `Kode pickup ini sudah tidak aktif (Status: ${pass.status}).` };
    }

    if (new Date(pass.expires_at) < new Date()) {
      return { success: false, error: 'Batas waktu pengambilan untuk pass ini telah kedaluwarsa.' };
    }

    // 2. Buat record Loans
    const loanRows = await sql`
      INSERT INTO public.loans (request_id, user_id, status, created_at, updated_at)
      VALUES (${pass.request_id}, ${pass.user_id}, 'active', now(), now())
      RETURNING id
    `;

    const newLoan = loanRows[0];

    // 3. Masukkan item-item yang approved ke loan_items (due_date default H+14)
    const approvedItems = await sql`
      SELECT book_id
      FROM public.loan_request_items
      WHERE request_id = ${pass.request_id} AND status = 'approved'
    `;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    for (const item of approvedItems as { book_id: string }[]) {
      await sql`
        INSERT INTO public.loan_items (
          loan_id,
          book_id,
          due_date,
          status,
          damage_level,
          replacement_cost,
          extension_count,
          created_at,
          updated_at
        ) VALUES (
          ${newLoan.id},
          ${item.book_id},
          ${dueDate.toISOString()},
          'borrowed',
          'none',
          0,
          0,
          now(),
          now()
        )
      `;
    }

    // 4. Update status pass menjadi 'used' dan request menjadi 'completed'
    await sql`
      UPDATE public.pickup_passes
      SET status = 'used', used_at = now()
      WHERE id = ${pass.id}
    `;

    await sql`
      UPDATE public.loan_requests
      SET status = 'completed'
      WHERE id = ${pass.request_id}
    `;

    revalidatePath('/admin/loans');
    revalidatePath('/admin/requests');
    revalidatePath('/loans');
    revalidatePath('/requests');
    revalidatePath('/dashboard');

    return {
      success: true,
      text: `Pengambilan ${pass.request_number} atas nama ${pass.user_full_name} berhasil dikonfirmasi! Peminjaman aktif telah dibuat.`,
      loanId: newLoan.id,
    };
  } catch (err: any) {
    console.error('Error verifying pickup pass:', err);
    return { success: false, error: err.message || 'Gagal memproses verifikasi kode pickup.' };
  }
}

export async function returnLoanItem(
  loanId: string,
  itemId: string,
  condition: DamageLevel
) {
  const { profile } = await getCurrentUser();
  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Hanya pustakawan/admin yang dapat memproses pengembalian buku.' };
  }

  try {
    // 1. Ambil detail loan_item, buku, dan peminjam
    const rows = await sql`
      SELECT 
        li.id,
        li.due_date,
        li.book_id,
        li.loan_id,
        l.user_id,
        b.price as book_price,
        b.title as book_title,
        b.available_stock,
        b.total_stock
      FROM public.loan_items li
      JOIN public.loans l ON l.id = li.loan_id
      JOIN public.books b ON b.id = li.book_id
      WHERE li.id = ${itemId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return { success: false, error: 'Item peminjaman tidak ditemukan.' };
    }

    const item = rows[0];
    const now = new Date();

    // 2. Hitung Denda Keterlambatan
    const { daysOverdue, fineAmount: overdueFine } = calculateOverdueFine(item.due_date, now);

    // 3. Hitung Biaya Kerusakan / Kehilangan
    const replacementCost = calculateDamageReplacementCost(item.book_price, condition);

    // 4. Tentukan status baru item
    let newStatus: 'returned' | 'damaged' | 'lost' = 'returned';
    if (condition === 'lost') newStatus = 'lost';
    else if (condition === 'minor' || condition === 'major') newStatus = 'damaged';

    // 5. Update data loan_items
    await sql`
      UPDATE public.loan_items
      SET status = ${newStatus},
          returned_at = now(),
          damage_level = ${condition},
          replacement_cost = ${replacementCost},
          updated_at = now()
      WHERE id = ${itemId}
    `;

    // 6. Buat tagihan Denda Keterlambatan jika ada
    if (overdueFine > 0) {
      await sql`
        INSERT INTO public.fines (loan_item_id, user_id, type, amount, days_overdue, status, created_at)
        VALUES (${itemId}, ${item.user_id}, 'overdue', ${overdueFine}, ${daysOverdue}, 'unpaid', now())
      `;
    }

    // 7. Buat tagihan Biaya Fisik jika rusak/hilang
    if (replacementCost > 0) {
      const fineType =
        condition === 'lost'
          ? 'lost'
          : condition === 'major'
          ? 'damage_major'
          : 'damage_minor';

      await sql`
        INSERT INTO public.fines (loan_item_id, user_id, type, amount, status, created_at)
        VALUES (${itemId}, ${item.user_id}, ${fineType}, ${replacementCost}, 'unpaid', now())
      `;
    }

    // 8. Update stok inventori buku
    if (condition === 'lost' || condition === 'major') {
      await sql`
        UPDATE public.books
        SET total_stock = GREATEST(0, total_stock - 1),
            updated_at = now()
        WHERE id = ${item.book_id}
      `;
    } else {
      await sql`
        UPDATE public.books
        SET available_stock = available_stock + 1,
            updated_at = now()
        WHERE id = ${item.book_id}
      `;
    }

    // 9. Cek Waitlist Antrean
    const waitlist = await sql`
      SELECT id, user_id
      FROM public.waitlist
      WHERE book_id = ${item.book_id} AND status = 'waiting'
      ORDER BY position ASC
      LIMIT 1
    `;

    if (waitlist.length > 0) {
      await sql`
        UPDATE public.waitlist
        SET status = 'notified', updated_at = now()
        WHERE id = ${waitlist[0].id}
      `;

      await sql`
        INSERT INTO public.notifications (user_id, type, title, message, related_id, related_type, created_at)
        VALUES (
          ${waitlist[0].user_id},
          'waitlist_available',
          'Buku Dalam Antrean Anda Tersedia!',
          ${'Buku "' + item.book_title + '" yang Anda tunggu telah tersedia kembali di perpustakaan.'},
          ${item.book_id},
          'book',
          now()
        )
      `;
    }

    // 10. Cek apakah seluruh item dalam pinjaman ini sudah selesai
    const remaining = await sql`
      SELECT id
      FROM public.loan_items
      WHERE loan_id = ${loanId} AND status = 'borrowed'
    `;

    if (remaining.length === 0) {
      await sql`
        UPDATE public.loans
        SET status = 'completed', updated_at = now()
        WHERE id = ${loanId}
      `;
    }

    revalidatePath(`/admin/loans/${loanId}`);
    revalidatePath('/admin/loans');
    revalidatePath('/admin/fines');
    revalidatePath('/admin/reports');
    revalidatePath('/loans');
    revalidatePath('/history');
    revalidatePath('/catalog');

    return { success: true };
  } catch (err: any) {
    console.error('Error returning loan item:', err);
    return { success: false, error: err.message || 'Gagal memproses pengembalian buku.' };
  }
}

export async function extendLoanItem(itemId: string) {
  const { user, profile } = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Silakan masuk terlebih dahulu.' };
  }

  try {
    const rows = await sql`
      SELECT li.*, l.user_id as loan_user_id
      FROM public.loan_items li
      JOIN public.loans l ON l.id = li.loan_id
      WHERE li.id = ${itemId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return { success: false, error: 'Item peminjaman tidak ditemukan.' };
    }

    const item = rows[0];

    if (item.loan_user_id !== user.id && profile?.role !== 'admin') {
      return { success: false, error: 'Anda tidak memiliki akses untuk memperpanjang buku ini.' };
    }

    // 1. Validasi batas maksimal perpanjangan (maks 1x)
    if (item.extension_count >= 1) {
      return {
        success: false,
        error: 'Buku ini sudah pernah diperpanjang 1 kali (batas maksimal perpanjangan).',
      };
    }

    // 2. Validasi apakah sudah overdue
    const isOverdue = new Date(item.due_date) < new Date();
    if (isOverdue) {
      return {
        success: false,
        error: 'Buku yang sudah melewati batas waktu (overdue) tidak dapat diperpanjang secara mandiri. Harap kembalikan ke loket.',
      };
    }

    // 3. Cek waitlist
    const waitlist = await sql`
      SELECT id FROM public.waitlist WHERE book_id = ${item.book_id} AND status = 'waiting' LIMIT 1
    `;

    if (waitlist.length > 0) {
      return {
        success: false,
        error: 'Perpanjangan tidak dapat dilakukan karena terdapat anggota lain dalam daftar antrean buku ini.',
      };
    }

    // 4. Auto-approve: Tambah 7 hari dari due_date saat ini
    const oldDue = new Date(item.due_date);
    const newDue = new Date(oldDue);
    newDue.setDate(newDue.getDate() + 7);

    await sql`
      UPDATE public.loan_items
      SET due_date = ${newDue.toISOString()},
          extension_count = ${item.extension_count + 1},
          updated_at = now()
      WHERE id = ${itemId}
    `;

    await sql`
      INSERT INTO public.loan_extensions (
        loan_item_id,
        user_id,
        status,
        old_due_date,
        new_due_date,
        processed_at,
        created_at
      ) VALUES (
        ${itemId},
        ${item.loan_user_id},
        'auto_approved',
        ${oldDue.toISOString()},
        ${newDue.toISOString()},
        now(),
        now()
      )
    `;

    revalidatePath(`/loans/${item.loan_id}`);
    revalidatePath('/loans');
    revalidatePath('/admin/loans');

    return {
      success: true,
      newDueDate: newDue.toISOString(),
    };
  } catch (err: any) {
    console.error('Error extending loan item:', err);
    return { success: false, error: err.message || 'Gagal memproses perpanjangan buku.' };
  }
}

