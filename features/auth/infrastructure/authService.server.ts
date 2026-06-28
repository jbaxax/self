import { createClient } from "@/lib/supabase/server"

export async function me() {
  const client = await createClient()
  const { data, error } = await client.auth.getUser()
  return data.user
}
