"use client"

import { Button } from "@/components/ui/button"
import { addDays } from "@/lib/date"

interface DateSelectorProps {
  date: string
  onDateChange: (date: string) => void
}

export default function DateSelector({
  date,
  onDateChange,
}: DateSelectorProps) {
  return (
    <div>
      <Button onClick={() => onDateChange(addDays(date, -1))}>Previous</Button>
      <span>{date}</span>
      <Button onClick={() => onDateChange(addDays(date, 1))}>Next</Button>
    </div>
  )
}
