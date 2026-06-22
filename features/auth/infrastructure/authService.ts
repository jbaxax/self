import { supabase } from "@/lib/supabase/client"
import { LoginInput, RegisterInput } from "../domain/types"

export async function signIn({ email, password }: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signUp({ email, password }: RegisterInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { data, error }
}

export async function me():<>{
  const { data, error }  = await supabase.auth.getUser()
  return {data, error}
}

export async function signOut(){
  return await supabase.auth.signOut();
}

