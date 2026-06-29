import z from "zod"

export const profileSchema = z.object({
  weight: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  age: z.coerce.number().positive(),
  sex: z.enum(["male", "female"]),
  activity_level: z.enum(["sedentary", "light", "moderate", "active"]),
  goal: z.enum(["lose_weight", "maintain", "gain_muscle"]),
})

export type UpdateUserInput = z.infer<typeof profileSchema>
