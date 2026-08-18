import { me } from "@/features/auth/infrastructure/authService.server"
import ProfileForm from "@/features/auth/presentation/components/ProfileForm"

export default async function page() {
  const user = await me()

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-16">
      <ProfileForm userId={user?.id!} />
    </div>
  )
}
