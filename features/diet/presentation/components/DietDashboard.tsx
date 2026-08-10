"use client"

import { getToday } from "@/lib/date"
import { useState } from "react"
import DateSelector from "./DateSelector"
import DayOverview from "./DayOverview"
import { useDailyLog, useMealTypes } from "../../application/useMealEntries"
import { groupEntriesByMealType } from "../../domain/calories"
import MealSection from "./MealSection"

interface DietDashboardProps {
  calorieTarget: number
}

export default function DietDashboard({ calorieTarget }: DietDashboardProps) {
  const [date, setDate] = useState(getToday)

  const { data: entries = [] } = useDailyLog(date)
  const { data: mealTypes = [] } = useMealTypes()

  const results = groupEntriesByMealType(mealTypes, entries)
  return (
    <div>
      <DateSelector date={date} onDateChange={setDate} />
      <DayOverview date={date} calorieTarget={calorieTarget} />

      {results.map((group) => (
        <MealSection key={group.mealType.id} mealGroup={group} />
      ))}
    </div>
  )
}
