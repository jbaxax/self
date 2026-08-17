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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Diet</h1>
        <p>Calories: {Math.round(calories.target)}</p>
        <p>BMR: {Math.round(calories.bmr)}</p>
        <p>TEE: {Math.round(calories.tdee)}</p>
      </div>
     <div>
      <CreateFoodDialog/>
     </div>
      <div>
        <DietDashboard calorieTarget={calories.target}/>
      </div>
    </div>
  )
}
