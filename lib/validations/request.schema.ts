import { z } from 'zod';

export const createRequestSchema = z.object({
  bookIds: z
    .array(z.string().uuid())
    .min(1, 'Pilih minimal 1 buku untuk dipinjam')
    .max(5, 'Maksimal peminjaman adalah 5 buku'),
});

export const approveRequestItemSchema = z.object({
  bookId: z.string().uuid(),
  approved: z.boolean(),
  rejectionReason: z.string().optional(),
});

export const processRequestSchema = z.object({
  requestId: z.string().uuid(),
  items: z.array(approveRequestItemSchema).min(1),
  adminNotes: z.string().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ProcessRequestInput = z.infer<typeof processRequestSchema>;
