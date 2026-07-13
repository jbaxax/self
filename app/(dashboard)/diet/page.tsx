import {
  getProfile,
  me,
} from "@/features/auth/infrastructure/authService.server"
import { calculateCalorieResult } from "@/features/diet/domain/calories"
import CreateFoodDialog from "@/features/diet/presentation/components/CreateFoodDialog"
import FoodSearch from "@/features/diet/presentation/components/FoodSearch"

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
        <p>Calories: {calories.target}</p>
        <p>BMR: {calories.bmr}</p>
        <p>TEE: {calories.tdee}</p>
      </div>
     <div>
      <CreateFoodDialog/>
     </div>
      <div>
        <FoodSearch/>
      </div>
    </div>
  )
}
