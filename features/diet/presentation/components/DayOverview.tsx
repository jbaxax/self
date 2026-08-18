"use client"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useDailyLog } from "../../application/useMealEntries"
import { calculateDailyTotals } from "../../domain/calories"
import { CalorieResult } from "../../domain/types"

interface DayOverviewProps {
  date: string
  calories: CalorieResult
}

export default function DayOverview({ date, calories }: DayOverviewProps) {
  const { data, isLoading, error } = useDailyLog(date)
  const totals = calculateDailyTotals(data ?? [])

  const target = Math.round(calories.target)
  const consumed = Math.round(totals.calories)
  const remaining = target - consumed
  const isOver = remaining < 0
  const progress = target > 0 ? Math.min((consumed / target) * 100, 100) : 0

  const macros = [
    { label: "Protein", value: Math.round(totals.protein) },
    { label: "Carbs", value: Math.round(totals.carbs) },
    { label: "Fat", value: Math.round(totals.fat) },
  ]

  return (
    <section className="bg-card rounded-lg border p-5">
      {isLoading && (
        <div className="flex h-28 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm">Could not load this day.</p>
      )}

      {!isLoading && !error && (
        <div className="flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                {isOver ? "Over target" : "Remaining"}
              </p>
              <p className="text-4xl font-semibold tracking-tight tabular-nums">
                {Math.abs(remaining)}
                <span className="text-muted-foreground ml-1.5 text-base font-normal">
                  kcal
                </span>
              </p>
            </div>
            <p className="text-muted-foreground text-sm tabular-nums">
              {consumed} / {target}
            </p>
          </div>

          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isOver ? "bg-destructive" : "bg-foreground"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t pt-4">
            {macros.map((macro) => (
              <div key={macro.label} className="space-y-0.5">
                <dt className="text-muted-foreground text-xs">{macro.label}</dt>
                <dd className="text-sm font-medium tabular-nums">
                  {macro.value} g
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-muted-foreground text-xs tabular-nums">
            BMR {Math.round(calories.bmr)} · TDEE {Math.round(calories.tdee)}
          </p>
        </div>
      )}
    </section>
  )
}
