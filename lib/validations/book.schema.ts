import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(2, 'Judul buku wajib diisi minimal 2 karakter'),
  author: z.string().min(2, 'Nama penulis wajib diisi'),
  isbn: z.string().min(10, 'ISBN minimal 10 karakter'),
  categoryId: z.string().uuid('Kategori buku wajib dipilih'),
  publisher: z.string().optional().or(z.literal('')),
  publishedYear: z.coerce.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  description: z.string().optional().or(z.literal('')),
  coverUrl: z.string().url('Format URL cover tidak valid').optional().or(z.literal('')),
  price: z.coerce.number().min(0, 'Harga buku tidak boleh negatif'),
  totalStock: z.coerce.number().int().min(1, 'Total stok minimal 1'),
  status: z.enum(['active', 'inactive']),
});

export type BookInput = z.infer<typeof bookSchema>;
