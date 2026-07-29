"use client"

import { getToday } from "@/lib/date"
import { useState } from "react"
import DateSelector from "./DateSelector"
import DayOverview from "./DayOverview"

interface DietDashboardProps {
  calorieTarget: number
}

export default function DietDashboard({ calorieTarget }: DietDashboardProps) {
  const [date, setDate] = useState(getToday)
  return (
    <div>
      <DateSelector date={date} onDateChange={setDate} />
      <DayOverview date={date} calorieTarget={calorieTarget} />
    </div>
  )
}
