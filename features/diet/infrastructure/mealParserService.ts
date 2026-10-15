"use server"

import { GoogleGenAI } from "@google/genai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { me } from "@/features/auth/infrastructure/authService.server"
import {
  MAX_MEAL_TEXT_LENGTH,
  ParsedMeals,
  parsedMealsSchema,
  reconcileWithKnownFoods,
} from "../domain/parsedMeals"

const MODEL = "gemini-3.1-flash-lite"
const MAX_KNOWN_FOODS = 500

const INSTRUCTIONS = [
  "Extract the foods the user ate, grouped by meal.",
  "Reuse an existing food (set existing_id to its id) only when it is exactly the same food. A related, similar or composite food is NOT the same food: 'cheese' is not 'cheesy sandwich', and a fried wonton is not a tequeño. When in doubt, set existing_id to null and create it as a new food.",
  "Do not add items the user did not mention. List each thing the user named as its own item.",
  "When several existing foods could match, choose the one whose name is the plainest, closest to the generic word the user said (for example 'eggs' matches 'Egg', not a cooked variant), unless the user named the preparation.",
  "Use English names unless it is a local dish with no common English name.",
  "quantity is the number of portions. calories is for ONE portion.",
].join(" ")

export async function parseMealText(text: string): Promise<ParsedMeals> {
  const user = await me()
  if (!user) throw new Error("Unauthorized")

  const trimmed = text.trim()
  if (trimmed.length === 0 || trimmed.length > MAX_MEAL_TEXT_LENGTH) {
    throw new Error("Invalid meal text")
  }

  const client = await createClient()
  const { data } = await client
    .from("foods")
    .select("id, name, calories, portion_desc")
    .limit(MAX_KNOWN_FOODS)
  const knownFoods = data ?? []

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Existing foods: ${JSON.stringify(knownFoods.map(({ id, name }) => ({ id, name })))}\n\nUser said: ${trimmed}`,
    config: {
      systemInstruction: INSTRUCTIONS,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(parsedMealsSchema),
    },
  })

  const parsed = parsedMealsSchema.parse(JSON.parse(response.text ?? ""))
  return reconcileWithKnownFoods(parsed, knownFoods)
}
