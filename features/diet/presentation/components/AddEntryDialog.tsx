"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tables } from "@/lib/supabase/types"
import { useState } from "react"
import FoodSearch from "./FoodSearch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCreateMealEntry } from "../../application/useMealEntries"
import { scaleMacros } from "../../domain/calories"
import { Spinner } from "@/components/ui/spinner"
import { Plus } from "lucide-react"

interface AddEntryDialogProps {
  mealTypeId: number
  date: string
}

export default function AddEntryDialog({
  mealTypeId,
  date,
}: AddEntryDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Tables<"foods"> | null>(null)
  const [quantity, setQuantity] = useState(1)
  const createMealEntry = useCreateMealEntry()

  async function handleSubmit() {
    if (!selectedFood || quantity <= 0) return

    const macros = scaleMacros(selectedFood, quantity)

    await createMealEntry.mutateAsync({
      food_id: selectedFood.id,
      meal_type_id: mealTypeId,
      quantity,
      log_date: date,
      ...macros,
    })

    setOpen(false)
    setSelectedFood(null)
    setQuantity(1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-full justify-start"
        >
          <Plus />
          Add food
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add food</DialogTitle>
          <DialogDescription>
            Search your library, then set how many portions you ate.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {selectedFood === null && <FoodSearch onSelect={setSelectedFood} />}
          {selectedFood && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedFood.name}
                  </p>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {selectedFood.calories} kcal ·{" "}
                    {selectedFood.portion_desc ?? "1 portion"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFood(null)}
                >
                  Change
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="quantity">Portions</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={0}
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={!selectedFood || createMealEntry.isPending}
            >
              {createMealEntry.isPending && <Spinner />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
