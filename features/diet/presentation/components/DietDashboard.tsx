"use client"

import { getToday } from "@/lib/date"
import { useState } from "react"
import DateSelector from "./DateSelector"
import DayOverview from "./DayOverview"
import { useDailyLog, useMealTypes } from "../../application/useMealEntries"
import { groupEntriesByMealType } from "../../domain/calories"
import MealSection from "./MealSection"
import { CalorieResult } from "../../domain/types"

interface DietDashboardProps {
  calories: CalorieResult
}

export default function DietDashboard({ calories }: DietDashboardProps) {
  const [date, setDate] = useState(getToday)

  const { data: entries = [] } = useDailyLog(date)
  const { data: mealTypes = [] } = useMealTypes()

  const results = groupEntriesByMealType(mealTypes, entries)

  return (
    <div className="flex flex-col gap-4">
      <DateSelector date={date} onDateChange={setDate} />
      <DayOverview date={date} calories={calories} />
      <div className="flex flex-col gap-3">
        {results.map((group) => (
          <MealSection key={group.mealType.id} mealGroup={group} date={date} />
        ))}
      </div>
    </div>
  )
}
