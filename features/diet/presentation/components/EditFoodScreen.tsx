"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MAX_CALORIES_PER_PORTION,
  MEAL_TYPE_NAMES,
  MealTypeName,
  isItemValid,
} from "../../domain/parsedMeals"
import QuantityStepper from "./QuantityStepper"
import ScreenHeader from "./ScreenHeader"

export type FoodDraft = {
  name: string
  portion_desc: string
  calories: number
  quantity: number
  mealType: MealTypeName
}

interface EditFoodScreenProps {
  mode: "edit" | "add"
  initial: FoodDraft
  onBack: () => void
  onSave: (draft: FoodDraft) => void
}

const FIELD = "h-[52px] rounded-xl px-4 text-base"

export default function EditFoodScreen({
  mode,
  initial,
  onBack,
  onSave,
}: EditFoodScreenProps) {
  const idPrefix = useId()
  const [name, setName] = useState(initial.name)
  const [portion, setPortion] = useState(initial.portion_desc)
  const [calories, setCalories] = useState(
    initial.calories > 0 ? String(initial.calories) : ""
  )
  const [quantity, setQuantity] = useState(initial.quantity)
  const [mealType, setMealType] = useState<MealTypeName>(initial.mealType)

  const draft: FoodDraft = {
    name: name.trim(),
    portion_desc: portion.trim(),
    calories: Number(calories),
    quantity,
    mealType,
  }
  const isValid = isItemValid({
    name: draft.name,
    existing_id: null,
    quantity: draft.quantity,
    portion_desc: draft.portion_desc,
    calories: draft.calories,
  })
  const total = Math.round(draft.calories * draft.quantity) || 0

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isValid) onSave(draft)
  }

  return (
    <>
      <ScreenHeader
        title={mode === "edit" ? "Edit food" : "Add food"}
        badge={mode === "edit" ? "new" : undefined}
        onBack={onBack}
      />
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
          <p className="text-muted-foreground text-sm">
            {mode === "edit"
              ? "Changes apply to this list. Nothing is saved until Save all."
              : "Add a food by hand. It is saved with the rest."}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${idPrefix}-name`} className="text-sm">
              Name
            </Label>
            <Input
              id={`${idPrefix}-name`}
              className={FIELD}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor={`${idPrefix}-portion`} className="text-sm">
                Portion
              </Label>
              <Input
                id={`${idPrefix}-portion`}
                className={FIELD}
                placeholder="1 plate"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Label htmlFor={`${idPrefix}-calories`} className="text-sm">
                kcal per portion
              </Label>
              <Input
                id={`${idPrefix}-calories`}
                className={FIELD}
                type="number"
                inputMode="numeric"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          {mode === "add" && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Meal</span>
                <div className="grid grid-cols-2 gap-2">
                  {MEAL_TYPE_NAMES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={type === mealType ? "default" : "outline"}
                      aria-pressed={type === mealType}
                      className="h-[52px] rounded-xl text-base"
                      onClick={() => setMealType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Portions</span>
                <QuantityStepper
                  size="lg"
                  value={quantity}
                  label="this food"
                  onChange={setQuantity}
                />
              </div>
            </>
          )}

          <div className="bg-muted flex items-center justify-between rounded-xl p-4">
            <span className="text-muted-foreground text-sm tabular-nums">
              {draft.calories || 0} kcal × {draft.quantity}{" "}
              {draft.quantity === 1 ? "portion" : "portions"}
            </span>
            <span className="text-xl font-bold tabular-nums">{total} kcal</span>
          </div>

          {!isValid && (
            <p className="text-destructive text-sm">
              Needs a name, a portion and 1 to {MAX_CALORIES_PER_PORTION} kcal
              per portion.
            </p>
          )}
        </div>

        <div className="flex shrink-0 gap-2 border-t px-4 pt-3 pb-6">
          <Button
            type="button"
            variant="outline"
            className="h-[52px] flex-1 rounded-xl text-base"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[52px] flex-[2] rounded-xl text-base font-semibold"
            disabled={!isValid}
          >
            Save food
          </Button>
        </div>
      </form>
    </>
  )
}
