import {
  getProfile,
  me,
} from "@/features/auth/infrastructure/authService.server"
import { calculateCalorieResult } from "@/features/diet/domain/calories"
import CreateFoodDialog from "@/features/diet/presentation/components/CreateFoodDialog"
import DietDashboard from "@/features/diet/presentation/components/DietDashboard"

export default async function page() {
  const supabaseUser = await me()
  const profile = await getProfile(supabaseUser?.id!)

  const calories = calculateCalorieResult({
    weight: profile?.weight!,
    height: profile?.height!,
    age: profile?.age!,
    sex: profile?.sex!,
    activityLevel: profile?.activity_level!,
    goal: profile?.goal!,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Daily Log</h1>
          <p className="text-muted-foreground text-sm">
            What you ate today, and how it adds up.
          </p>
        </div>
        <CreateFoodDialog />
      </div>
      <DietDashboard calories={calories} />
    </div>
  )
}
