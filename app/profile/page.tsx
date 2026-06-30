import { me } from "@/features/auth/infrastructure/authService.server"
import ProfileForm from "@/features/auth/presentation/components/ProfileForm"

export default async function page() {
  
  const user = await me()
    return (
    <div className="">
       <ProfileForm userId={user?.id!} />
     </div>   
  )
}
