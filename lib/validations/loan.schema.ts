import { z } from 'zod';

export const pickupPassSchema = z.object({
  pickupCode: z
    .string()
    .min(6, 'Kode pickup minimal 6 karakter')
    .transform((val) => val.trim().toUpperCase()),
});

export const returnItemSchema = z.object({
  loanItemId: z.string().uuid(),
  damageLevel: z.enum(['none', 'minor', 'major', 'lost']),
  adminNotes: z.string().optional(),
});

export const returnLoanSchema = z.object({
  items: z.array(returnItemSchema).min(1, 'Pilih minimal satu buku yang dikembalikan'),
});

export const extendLoanSchema = z.object({
  loanItemId: z.string().uuid(),
});

export type PickupPassInput = z.infer<typeof pickupPassSchema>;
export type ReturnLoanInput = z.infer<typeof returnLoanSchema>;
export type ExtendLoanInput = z.infer<typeof extendLoanSchema>;
