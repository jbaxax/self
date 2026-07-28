"use server"

import { createClient } from "@/lib/supabase/server"
import { Tables } from "@/lib/supabase/types"
import { FoodInput, MealEntryInput } from "../domain/types"
import { me } from "@/features/auth/infrastructure/authService.server"

export async function searchFoods(query: string): Promise<Tables<"foods">[]> {
  const client = await createClient()
  const response = await client
    .from("foods")
    .select()
    .ilike("name", `%${query}%`)
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

export async function getDailyLog(logDate: string): Promise<Tables<"meal_entries">[]> {
  const client = await createClient()
  const response = await client
    .from("meal_entries")
    .select()
    .eq("log_date", logDate)
  return response.data ?? []
}