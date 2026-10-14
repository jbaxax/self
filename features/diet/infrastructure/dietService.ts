"use server"

import { createClient } from "@/lib/supabase/server"
import { Tables } from "@/lib/supabase/types"
import { FoodInput, MealEntryInput, MealEntryWithFood, MealGroup } from "../domain/types"
import { me } from "@/features/auth/infrastructure/authService.server"
import { ParsedMeals, parsedMealsSchema } from "../domain/parsedMeals"

export async function searchFoods(query: string): Promise<Tables<"foods">[]> {
  const client = await createClient()
  const response = await client
    .from("foods")
    .select()
    .ilike("name", `%${query}%`)
  return response.data ?? []
}

export async function getMealTypes(): Promise<Tables<"meal_types">[]> {
  const client = await createClient()
  const response = await client
    .from("meal_types")
    .select()
  return response.data ?? []
}

export async function createFood(body: FoodInput): Promise<Tables<"foods">> {
  const client = await createClient()
  const user = await me()
  const response = await client
    .from("foods")
    .insert({ ...body, user_id: user!.id })
    .select()
    .single()

  if (!response.data) throw new Error("Failed to create food")
  return response.data

}
export async function createMealEntry(body: MealEntryInput): Promise<Tables<"meal_entries">> {
  const client = await createClient();
  const user = await me()
  const response = await client
    .from("meal_entries")
    .insert({ ...body, user_id: user!.id })
    .select()
    .single()

  if (!response.data) throw new Error("Failed to create meal entry")
  return response.data
}

export async function logMeals(logDate: string, meals: ParsedMeals): Promise<void> {
  const validMeals = parsedMealsSchema.parse(meals)
  const client = await createClient()
  const response = await client.rpc("log_meals", {
    p_log_date: logDate,
    p_meals: validMeals,
  })

  if (response.error) throw new Error("Failed to log meals")
}

export async function deleteMealEntry(id: string): Promise<void> {
  const client = await createClient()
  const response = await client
    .from("meal_entries")
    .delete()
    .eq("id", id)
    .select("id")

  if (response.error || !response.data?.length) throw new Error("Failed to delete meal entry")
}

export async function getDailyLog(logDate: string): Promise<MealEntryWithFood[]> {
  const client = await createClient()
  const response = await client
    .from("meal_entries")
    .select("*, foods(name)")
    .eq("log_date", logDate)
  return response.data ?? []
}