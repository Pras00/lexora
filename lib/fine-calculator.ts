import { DamageLevel } from '@/types';

export const DAILY_FINE_RATE = 1000; // Rp 1.000 / buku / hari

/**
 * Menghitung denda keterlambatan buku.
 * Denda mulai berlaku H+1 setelah due date.
 */
export function calculateOverdueFine(dueDateInput: string | Date, returnDateInput: string | Date = new Date()): {
  daysOverdue: number;
  fineAmount: number;
} {
  const dueDate = new Date(dueDateInput);
  const returnDate = new Date(returnDateInput);

  // Normalisasi ke awal hari untuk perbandingan hari yang adil
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).getTime();
  const current = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate()).getTime();

  const diffTime = current - due;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { daysOverdue: 0, fineAmount: 0 };
  }

  return {
    daysOverdue: diffDays,
    fineAmount: diffDays * DAILY_FINE_RATE,
  };
}

/**
 * Menghitung biaya ganti rugi fisik buku berdasarkan tingkat kerusakan.
 * - Hilang: Harga buku x 2.0
 * - Rusak Berat: Harga buku x 1.5
 * - Rusak Ringan: Harga buku x 0.5
 */
export function calculateDamageReplacementCost(bookPrice: number, level: DamageLevel): number {
  switch (level) {
    case 'lost':
      return Math.round(bookPrice * 2.0);
    case 'major':
      return Math.round(bookPrice * 1.5);
    case 'minor':
      return Math.round(bookPrice * 0.5);
    case 'none':
    default:
      return 0;
  }
}
