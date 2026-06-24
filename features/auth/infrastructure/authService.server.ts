import { createClient } from "@/lib/supabase/server"
import { error } from "console"

export async function me() {
  const client = await createClient()
  const { data, error } = await client.auth.getUser()
  return { data, error }
}
