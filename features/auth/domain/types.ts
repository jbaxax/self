import { Database } from "@/lib/supabase/types"

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
}

export type SessionUser = {
  email: string
}


