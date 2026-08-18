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
import { useCreateFood } from "../../application/useFoods"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { foodSchema } from "../schemas/foodSchema"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { Plus } from "lucide-react"

const macroFields = [
  { name: "protein", label: "Protein (g)" },
  { name: "carbs", label: "Carbs (g)" },
  { name: "fat", label: "Fat (g)" },
] as const

export default function CreateFoodDialog() {
  const [open, setOpen] = useState(false)
  const createFood = useCreateFood()
  const form = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      calories: 0,
      name: "",
      portion_desc: "",
    },
  })

  async function onSubmit(data: z.infer<typeof foodSchema>) {
    try {
      const response = await createFood.mutateAsync(data)
      setOpen(false)
      form.reset()
      return response
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          New food
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create food</DialogTitle>
          <DialogDescription>
            Add a food to your library. Enter the nutrition values for one
            portion.
          </DialogDescription>
        </DialogHeader>

        <form id="form-food" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Chicken breast"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="portion_desc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="portion">Portion</FieldLabel>
                    <Input
                      {...field}
                      id="portion"
                      aria-invalid={fieldState.invalid}
                      placeholder="100 g"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="calories"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="calories">Calories</FieldLabel>
                    <Input
                      {...field}
                      id="calories"
                      aria-invalid={fieldState.invalid}
                      placeholder="165"
                      type="number"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {macroFields.map((macro) => (
                <Controller
                  key={macro.name}
                  name={macro.name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={macro.name}>
                        {macro.label}
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={macro.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="0"
                        type="number"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber
                          field.onChange(Number.isNaN(value) ? undefined : value)
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={createFood.isPending}>
              {createFood.isPending && <Spinner />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
