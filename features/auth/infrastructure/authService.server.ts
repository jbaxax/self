"use server"
import { createClient } from "@/lib/supabase/server"
import { Tables } from "@/lib/supabase/types"
import { UpdateUserInput } from "../presentation/schemas/profileSchema"

export async function me() {
  const client = await createClient()
  const { data, error } = await client.auth.getUser()
  return data.user
}

export async function updateUser(
  id: string,
  body: UpdateUserInput
): Promise<{ data: Tables<"users"> | null; error: unknown }> {
  const client = await createClient()
  const { data, error } = await client
    .from("users")
    .update(body)
    .eq("id", id)
    .select()
    .single()
  return { data, error }
}

export async function getProfile(id:string){
  const client = await createClient()
  const {data} = await client.from("users").select().eq("id",id).single()
  return data
}