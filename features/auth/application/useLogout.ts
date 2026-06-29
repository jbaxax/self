import { useRouter } from "next/navigation"
import { signOut } from "../infrastructure/authService"

export function useLogout() {
  const router = useRouter()

  return async () => {
    await signOut()
    router.push("/login")
  }
}
