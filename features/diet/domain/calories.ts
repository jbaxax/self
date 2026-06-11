import { Enums } from "@/lib/supabase/types"
import { CalorieInput, CalorieResult } from "./types"

// Lookup table: the sex-based offset in the Mifflin-St Jeor formula
const BMR_SEX_OFFSET: Record<Enums<"sex_type">, number> = {
  male: 5,
  female: -161,
}

// Assumes weight in kg, height in cm, age in years
function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: Enums<"sex_type">
): number {
  const bmr = 10 * weight + 6.25 * height - 5 * age + BMR_SEX_OFFSET[sex]
  return bmr
}

const TDEE_ACTIVITY: Record<Enums<"activity_level_type">, number> = {
  active: 1.725,
  light: 1.375,
  moderate: 1.55,
  sedentary: 1.2,
}

function calculateTDEE(
  activity: Enums<"activity_level_type">,
  bmr: number
): number {
  const tdee = TDEE_ACTIVITY[activity] * bmr
  return tdee
}

const GOAL_ADJUSTMENT: Record<Enums<"goal_type">, number> = {
  lose_weight: 0.8,
  maintain: 1.0,
  gain_muscle: 1.1,
}

function calculateTarget(goal: Enums<"goal_type">, tdee: number): number {
  const meta = GOAL_ADJUSTMENT[goal] * tdee
  return meta
}

export function calculateCalorieResult({
  weight,
  height,
  age,
  sex,
  activityLevel,
  goal,
}: CalorieInput): CalorieResult {
  const bmr = calculateBMR(weight, height, age, sex)
  const tdee = calculateTDEE(activityLevel, bmr)
  const target = calculateTarget(goal, tdee)
  return { bmr, tdee, target }
}
