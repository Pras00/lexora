/**
 * Menghitung tenggat waktu pengambilan (pickup deadline) berdasarkan hari kerja.
 * Secara default, hari kerja adalah Senin - Jumat (Sabtu dan Minggu dilewati).
 * 
 * @param startDate Tanggal awal persetujuan (default: sekarang)
 * @param workingDaysCount Jumlah hari kerja (default: 2 hari kerja)
 * @returns Date object tenggat pengambilan
 */
export function calculatePickupDeadline(
  startDate: Date = new Date(),
  workingDaysCount: number = 2
): Date {
  const result = new Date(startDate);
  let addedDays = 0;

  while (addedDays < workingDaysCount) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay(); // 0 = Minggu, 6 = Sabtu

    // Lewati akhir pekan
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }

  // Set jam tenggat ke akhir jam operasional (17:00 WIB)
  result.setHours(17, 0, 0, 0);
  return result;
}
