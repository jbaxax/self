"use client"

import { Spinner } from "@/components/ui/spinner"
import { useDailyLog } from "../../application/useMealEntries"
import { calculateDailyTotals } from "../../domain/calories"

interface DayOverviewProps{
    date:string,
    calorieTarget: number,
}

export default function DayOverview({date,calorieTarget}:DayOverviewProps) {
 const { data, isLoading, error } = useDailyLog(date)
 const totals = calculateDailyTotals(data ?? [])
    return (
    <div>
     {isLoading && <Spinner/>}
     {error && <p>Error loading day</p>}
     {data?.length === 0 && <p>No entries logged for this day</p>}
     {(data?.length ?? 0) > 0   && 
         <p>{totals.calories} VS {calorieTarget}</p>
     }
    </div>
  )
}
