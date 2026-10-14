"use client"

import { Sparkles, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useLogMeals } from "../../application/useMealEntries"
import { useParseMealText } from "../../application/useParseMealText"
import {
  MAX_MEAL_TEXT_LENGTH,
  ParsedMeals,
  isReadyToSave,
  itemCalories,
  mealCalories,
  removeItem,
  setItemQuantity,
  totalCalories,
} from "../../domain/parsedMeals"

interface LogMealsDialogProps {
  date: string
}

export default function LogMealsDialog({ date }: LogMealsDialogProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [parsed, setParsed] = useState<ParsedMeals | null>(null)
  const parseMealText = useParseMealText()
  const logMeals = useLogMeals()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) return
    setText("")
    setParsed(null)
    parseMealText.reset()
    logMeals.reset()
  }

  function handleAnalyze() {
    parseMealText.mutate(text, { onSuccess: setParsed })
  }

  function handleSave() {
    if (parsed === null) return
    logMeals.mutate(
      { date, meals: parsed },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Sparkles />
          Log with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log with AI</DialogTitle>
          <DialogDescription>
            {parsed === null
              ? "Describe what you ate in each meal. Review everything before it is saved."
              : "Review the result. Remove what is wrong and fix the portions."}
          </DialogDescription>
        </DialogHeader>

        {parsed === null && (
          <div className="flex flex-col gap-3">
            <textarea
              value={text}
              maxLength={MAX_MEAL_TEXT_LENGTH}
              onChange={(e) => setText(e.target.value)}
              placeholder="Breakfast: two eggs and bread. Lunch: rice with chicken."
              className="border-input bg-background min-h-28 w-full rounded-md border px-3 py-2 text-sm outline-none"
            />
            {parseMealText.isError && (
              <p className="text-destructive text-sm">
                Could not analyze that. Try again or rephrase it.
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                disabled={text.trim().length === 0 || parseMealText.isPending}
                onClick={handleAnalyze}
              >
                {parseMealText.isPending && <Spinner />}
                Analyze
              </Button>
            </DialogFooter>
          </div>
        )}

        {parsed !== null && parsed.meals.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Nothing left to save.
          </p>
        )}

        {parsed !== null && parsed.meals.length > 0 && (
          <div className="flex flex-col gap-4">
            {parsed.meals.map((meal, mealIndex) => (
              <section key={meal.meal_type} className="rounded-lg border">
                <header className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-medium">{meal.meal_type}</h3>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {Math.round(mealCalories(meal.items))} kcal
                  </span>
                </header>
                <ul className="divide-y border-t">
                  {meal.items.map((item, itemIndex) => (
                    <li
                      key={`${item.name}-${itemIndex}`}
                      className="flex items-center gap-2 px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          {item.name}
                          {item.existing_id === null && (
                            <span className="text-muted-foreground ml-2 text-xs">
                              new
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {item.portion_desc} · {item.calories} kcal each
                        </p>
                      </div>
                      <Input
                        aria-label={`Portions of ${item.name}`}
                        type="number"
                        min={0}
                        step="0.5"
                        className="w-16"
                        value={item.quantity}
                        onChange={(e) =>
                          setParsed(
                            setItemQuantity(
                              parsed,
                              mealIndex,
                              itemIndex,
                              Number(e.target.value)
                            )
                          )
                        }
                      />
                      <span className="text-muted-foreground w-12 text-right text-sm tabular-nums">
                        {Math.round(itemCalories(item))}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          setParsed(removeItem(parsed, mealIndex, itemIndex))
                        }
                      >
                        <Trash2 />
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-right text-sm font-medium tabular-nums">
              Total {Math.round(totalCalories(parsed))} kcal
            </p>
          </div>
        )}

        {parsed !== null && logMeals.isError && (
          <p className="text-destructive text-sm">
            Nothing was saved. Check the portions and try again.
          </p>
        )}

        {parsed !== null && (
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={logMeals.isPending}
              onClick={() => setParsed(null)}
            >
              Back
            </Button>
            <Button
              type="button"
              disabled={!isReadyToSave(parsed) || logMeals.isPending}
              onClick={handleSave}
            >
              {logMeals.isPending && <Spinner />}
              Save all
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
