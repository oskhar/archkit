import { z } from 'zod';

export const CreateSaleSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ).min(1),
});

export type CreateSaleDto = z.infer<typeof CreateSaleSchema>;
