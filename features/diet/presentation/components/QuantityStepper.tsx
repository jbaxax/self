"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stepQuantity } from "../../domain/parsedMeals"

interface QuantityStepperProps {
  value: number
  label: string
  size?: "md" | "lg"
  onChange: (quantity: number) => void
}

export default function QuantityStepper({
  value,
  label,
  size = "md",
  onChange,
}: QuantityStepperProps) {
  const button = size === "lg" ? "size-[52px]" : "size-12"

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        className={`${button} rounded-xl`}
        aria-label={`Fewer portions of ${label}`}
        onClick={() => onChange(stepQuantity(value, -1))}
      >
        <Minus className="size-5" />
      </Button>
      <span
        className={`text-center font-semibold tabular-nums ${
          size === "lg" ? "w-[72px] text-xl" : "w-14 text-lg"
        }`}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        className={`${button} rounded-xl`}
        aria-label={`More portions of ${label}`}
        onClick={() => onChange(stepQuantity(value, 1))}
      >
        <Plus className="size-5" />
      </Button>
    </div>
  )
}
