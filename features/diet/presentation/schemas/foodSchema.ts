import z from "zod";

export const foodSchema = z.object({
  name: z.string().min(1),
  portion_desc: z.string().min(1),
  calories: z.coerce.number().positive(),
  protein: z.coerce.number().positive().optional(),
  carbs: z.coerce.number().positive().optional(),
  fat: z.coerce.number().positive().optional()
})

