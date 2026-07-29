import { z } from 'zod';

export interface BetConstraints {
  min?: number | null;
  max?: number | null;
  step?: number | null;
}

// Собирает Zod-схему ставки динамически из min/max/step, если они заданы в detail DTO.
export function buildSetBetSchema(constraints: BetConstraints) {
  return z
    .object({
      price: z.coerce
        .number({ invalid_type_error: 'Введите цену' })
        .positive('Цена должна быть больше 0'),
    })
    .superRefine((data, ctx) => {
      const { min, max, step } = constraints;
      if (min != null && data.price < min) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['price'], message: `Цена не может быть меньше ${min}` });
      }
      if (max != null && data.price > max) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['price'], message: `Цена не может быть больше ${max}` });
      }
      if (step != null && step > 0 && min != null) {
        const diff = (data.price - min) / step;
        if (Math.abs(diff - Math.round(diff)) > 1e-6) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['price'], message: `Цена должна соответствовать шагу ${step}` });
        }
      }
    });
}

export type SetBetFormValues = { price: number };
