"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tables } from "@/lib/supabase/types"
import { useState } from "react"
import FoodSearch from "./FoodSearch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateMealEntry } from "../../application/useMealEntries"
import { scaleMacros } from "../../domain/calories"

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
      <DialogTrigger>Add food</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>"Add food</DialogTitle>
          <DialogDescription>
      
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {selectedFood === null && <FoodSearch onSelect={setSelectedFood} />}
          {selectedFood && (
            <div>
              {selectedFood.name}
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          )}
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
