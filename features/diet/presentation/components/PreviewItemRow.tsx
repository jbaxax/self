"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParsedFood, itemCalories } from "../../domain/parsedMeals"
import QuantityStepper from "./QuantityStepper"

interface PreviewItemRowProps {
  item: ParsedFood
  onQuantityChange: (quantity: number) => void
  onEdit: () => void
  onRemove: () => void
}

export default function PreviewItemRow({
  item,
  onQuantityChange,
  onEdit,
  onRemove,
}: PreviewItemRowProps) {
  const isNew = item.existing_id === null
  const label = item.name || "food"

  const details = (
    <span className="text-muted-foreground block truncate text-[13px]">
      {item.portion_desc} · {item.calories} kcal each
    </span>
  )

  return (
    <li className="flex flex-col py-2 pr-2 pl-4">
      <div className="flex items-center gap-2">
        {isNew ? (
          <button
            type="button"
            aria-label={`Edit ${label}`}
            onClick={onEdit}
            className="min-h-12 min-w-0 flex-1 py-1 text-left"
          >
            <span className="flex items-center gap-2 text-base font-medium">
              <span className="truncate">{item.name || "Unnamed food"}</span>
              <span className="text-muted-foreground bg-muted shrink-0 rounded px-2 py-0.5 text-xs font-normal">
                new
              </span>
              <Pencil className="text-muted-foreground size-4 shrink-0" />
            </span>
            {details}
          </button>
        ) : (
          <div className="min-w-0 flex-1 py-1">
            <span className="block truncate text-base font-medium">
              {item.name}
            </span>
            {details}
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          className="size-12 shrink-0 rounded-xl"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
        >
          <Trash2 className="size-5" />
        </Button>
      </div>
      <div className="flex items-center justify-between pr-2">
        <QuantityStepper
          value={item.quantity}
          label={label}
          onChange={onQuantityChange}
        />
        <span className="text-base font-semibold tabular-nums">
          {Math.round(itemCalories(item))} kcal
        </span>
      </div>
    </li>
  )
}
