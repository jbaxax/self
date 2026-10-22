"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ParsedMeals,
  addItem,
  isReadyToSave,
  mealCalories,
  removeItem,
  setItemQuantity,
  totalCalories,
  updateItem,
} from "../../domain/parsedMeals"
import EditFoodScreen, { FoodDraft } from "./EditFoodScreen"
import PreviewItemRow from "./PreviewItemRow"
import ScreenHeader from "./ScreenHeader"

type EditorTarget =
  | { mode: "edit"; mealIndex: number; itemIndex: number }
  | { mode: "add" }

const BLANK_DRAFT: FoodDraft = {
  name: "",
  portion_desc: "",
  calories: 0,
  quantity: 1,
  mealType: "Breakfast",
}

interface ReviewStepProps {
  parsed: ParsedMeals
  isSaving: boolean
  hasError: boolean
  onChange: (parsed: ParsedMeals) => void
  onBack: () => void
  onSave: () => void
}

export default function ReviewStep({
  parsed,
  isSaving,
  hasError,
  onChange,
  onBack,
  onSave,
}: ReviewStepProps) {
  const [editor, setEditor] = useState<EditorTarget | null>(null)

  function draftForEditor(target: EditorTarget): FoodDraft {
    if (target.mode === "add") return BLANK_DRAFT
    const meal = parsed.meals[target.mealIndex]
    const item = meal?.items[target.itemIndex]
    if (!meal || !item) return BLANK_DRAFT
    return {
      name: item.name,
      portion_desc: item.portion_desc,
      calories: item.calories,
      quantity: item.quantity,
      mealType: meal.meal_type,
    }
  }

  function handleEditorSave(target: EditorTarget, draft: FoodDraft) {
    if (target.mode === "edit") {
      onChange(
        updateItem(parsed, target.mealIndex, target.itemIndex, {
          name: draft.name,
          portion_desc: draft.portion_desc,
          calories: draft.calories,
        })
      )
    } else {
      onChange(
        addItem(parsed, draft.mealType, {
          name: draft.name,
          existing_id: null,
          quantity: draft.quantity,
          portion_desc: draft.portion_desc,
          calories: draft.calories,
        })
      )
    }
    setEditor(null)
  }

  if (editor !== null) {
    return (
      <EditFoodScreen
        mode={editor.mode}
        initial={draftForEditor(editor)}
        onBack={() => setEditor(null)}
        onSave={(draft) => handleEditorSave(editor, draft)}
      />
    )
  }

  return (
    <>
      <ScreenHeader title="Log with AI" />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
        <p className="text-muted-foreground text-sm">
          Review the result. Foods marked new can be edited.
        </p>

        {parsed.meals.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Nothing to save yet. Add a food below.
          </p>
        )}

        {parsed.meals.map((meal, mealIndex) => (
          <section
            key={meal.meal_type}
            className="shrink-0 overflow-hidden rounded-xl border"
          >
            <header className="bg-muted/40 flex min-h-12 items-center justify-between px-4">
              <h3 className="text-[15px] font-semibold">{meal.meal_type}</h3>
              <span className="text-muted-foreground text-sm tabular-nums">
                {Math.round(mealCalories(meal.items))} kcal
              </span>
            </header>
            <ul className="divide-y border-t">
              {meal.items.map((item, itemIndex) => (
                <PreviewItemRow
                  key={`${mealIndex}-${itemIndex}`}
                  item={item}
                  onQuantityChange={(quantity) =>
                    onChange(
                      setItemQuantity(parsed, mealIndex, itemIndex, quantity)
                    )
                  }
                  onEdit={() =>
                    setEditor({ mode: "edit", mealIndex, itemIndex })
                  }
                  onRemove={() =>
                    onChange(removeItem(parsed, mealIndex, itemIndex))
                  }
                />
              ))}
            </ul>
          </section>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-[52px] w-full shrink-0 rounded-xl border-dashed text-base"
          onClick={() => setEditor({ mode: "add" })}
        >
          <Plus className="size-5" />
          Add food
        </Button>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t px-4 pt-3 pb-6">
        {hasError && (
          <p className="text-destructive text-sm">
            Nothing was saved. Check the portions and try again.
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Total</span>
          <span className="text-xl font-bold tabular-nums">
            {Math.round(totalCalories(parsed))} kcal
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-[52px] flex-1 rounded-xl text-base"
            disabled={isSaving}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="button"
            className="h-[52px] flex-[2] rounded-xl text-base font-semibold"
            disabled={!isReadyToSave(parsed) || isSaving}
            onClick={onSave}
          >
            {isSaving && <Spinner />}
            Save all
          </Button>
        </div>
      </div>
    </>
  )
}
