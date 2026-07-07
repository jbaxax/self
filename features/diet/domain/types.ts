import { Enums } from "@/lib/supabase/types"

export type CalorieInput = {
  weight: number
  height: number
  age: number
  sex: Enums<"sex_type">
  activityLevel: Enums<"activity_level_type">
  goal: Enums<"goal_type">
}

export type CalorieResult = {
  bmr: number
  tdee: number
  target: number
}

export type FoodInput = {
  name: string
  portion_desc: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}
