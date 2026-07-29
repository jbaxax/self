"use client"

import { useDailyLog, useMealTypes } from "../../application/useMealEntries"
import { groupEntriesByMealType } from "../../domain/calories"

interface MealSectionProps{
    date: string,

}

export default function MealSection({date,}:MealSectionProps) {
 const {data: entries = []} = useDailyLog(date)
 const {data: mealTypes = [] } = useMealTypes() 

 const results = groupEntriesByMealType(mealTypes,entries)
    return (
    <div>MealSection</div>
  )
}
