import { supabase } from "@/lib/supabase/client"
import { LoginInput } from "../domain/types"

export async function signIn({ email, password }: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}
