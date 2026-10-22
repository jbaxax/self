import { z } from "zod"

export const MAX_CALORIES_PER_PORTION = 2000
export const MAX_MEAL_TEXT_LENGTH = 1000
export const MEAL_TYPE_NAMES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const

export const parsedFoodSchema = z.object({
  name: z.string().min(1),
  existing_id: z.string().nullable(),
  quantity: z.number().positive(),
  portion_desc: z.string().min(1),
  calories: z.number().positive().max(MAX_CALORIES_PER_PORTION),
})

export const parsedMealsSchema = z.object({
  meals: z.array(
    z.object({
      meal_type: z.enum(MEAL_TYPE_NAMES),
      items: z.array(parsedFoodSchema),
    })
  ),
})

export type ParsedFood = z.infer<typeof parsedFoodSchema>
export type ParsedMeals = z.infer<typeof parsedMealsSchema>

export type KnownFood = {
  id: string
  name: string
  calories: number
  portion_desc: string
}

export function reconcileWithKnownFoods(
  parsed: ParsedMeals,
  knownFoods: KnownFood[]
): ParsedMeals {
  const byId = new Map(knownFoods.map((food) => [food.id, food]))
  return {
    meals: parsed.meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) => {
        const known =
          item.existing_id === null ? undefined : byId.get(item.existing_id)
        if (!known) return { ...item, existing_id: null }
        return {
          ...item,
          existing_id: known.id,
          name: known.name,
          calories: known.calories,
          portion_desc: known.portion_desc,
        }
      }),
    })),
  }
}

export function itemCalories(item: ParsedFood): number {
  return item.calories * item.quantity
}

export function mealCalories(items: ParsedFood[]): number {
  return items.reduce((sum, item) => sum + itemCalories(item), 0)
}

export function totalCalories(parsed: ParsedMeals): number {
  return parsed.meals.reduce((sum, meal) => sum + mealCalories(meal.items), 0)
}

export function removeItem(
  parsed: ParsedMeals,
  mealIndex: number,
  itemIndex: number
): ParsedMeals {
  return {
    meals: parsed.meals
      .map((meal, m) =>
        m === mealIndex
          ? { ...meal, items: meal.items.filter((_, i) => i !== itemIndex) }
          : meal
      )
      .filter((meal) => meal.items.length > 0),
  }
}

export function updateItem(
  parsed: ParsedMeals,
  mealIndex: number,
  itemIndex: number,
  patch: Partial<ParsedFood>
): ParsedMeals {
  return {
    meals: parsed.meals.map((meal, m) =>
      m !== mealIndex
        ? meal
        : {
            ...meal,
            items: meal.items.map((item, i) =>
              i === itemIndex ? { ...item, ...patch } : item
            ),
          }
    ),
  }
}

export function setItemQuantity(
  parsed: ParsedMeals,
  mealIndex: number,
  itemIndex: number,
  quantity: number
): ParsedMeals {
  return updateItem(parsed, mealIndex, itemIndex, { quantity })
}

const MIN_QUANTITY = 0.5

export function stepQuantity(quantity: number, direction: 1 | -1): number {
  if (direction === 1) return quantity < 1 ? 1 : quantity + 1
  if (quantity > 1) return quantity - 1
  return MIN_QUANTITY
}

export type MealTypeName = (typeof MEAL_TYPE_NAMES)[number]

export function addItem(
  parsed: ParsedMeals,
  mealType: MealTypeName,
  item: ParsedFood
): ParsedMeals {
  const hasMeal = parsed.meals.some((meal) => meal.meal_type === mealType)
  if (!hasMeal) {
    return { meals: [...parsed.meals, { meal_type: mealType, items: [item] }] }
  }
  return {
    meals: parsed.meals.map((meal) =>
      meal.meal_type === mealType
        ? { ...meal, items: [...meal.items, item] }
        : meal
    ),
  }
}

export function isItemValid(item: ParsedFood): boolean {
  if (item.existing_id !== null) return item.quantity > 0
  return parsedFoodSchema.safeParse(item).success
}

export function isReadyToSave(parsed: ParsedMeals): boolean {
  return (
    parsed.meals.length > 0 &&
    parsed.meals.every((meal) => meal.items.every(isItemValid))
  )
}
