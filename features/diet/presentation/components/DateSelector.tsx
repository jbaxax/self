"use client"

import { Button } from "@/components/ui/button"
import { addDays, getToday } from "@/lib/date"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateSelectorProps {
  date: string
  onDateChange: (date: string) => void
}

function formatDayLabel(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export default function DateSelector({
  date,
  onDateChange,
}: DateSelectorProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous day"
          onClick={() => onDateChange(addDays(date, -1))}
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-36 text-center text-sm font-medium">
          {formatDayLabel(date)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next day"
          onClick={() => onDateChange(addDays(date, 1))}
        >
          <ChevronRight />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDateChange(getToday())}
      >
        Today
      </Button>
    </div>
  )
}
