/**
 * Menghasilkan kode pickup unik format LIB-XXXXXX
 * Menggunakan karakter alfanumerik yang jelas dan mudah dibaca (menghindari 0, O, 1, I).
 */
export function generatePickupCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return `LIB-${result}`;
}
