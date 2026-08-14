import z from "zod";

export const foodSchema = z.object({
  name: z.string().min(1),
  portion_desc: z.string().min(1),
  calories: z.number().positive(),
  protein: z.number().positive().optional(),
  carbs: z.number().positive().optional(),
  fat: z.number().positive().optional()
})

