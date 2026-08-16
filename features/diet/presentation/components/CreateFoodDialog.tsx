"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateFood } from "../../application/useFoods"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { foodSchema } from "../schemas/foodSchema"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
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
      toast.error(error instanceof Error ? error.message : "Error inesperado")
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Create Food</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Food</DialogTitle>
          <DialogDescription>
            Add a food to your library. Enter the nutrition values for one
            portion.
          </DialogDescription>

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
                      placeholder="Type name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
                      placeholder="Type portion"
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
                      placeholder="Type calories"
                      type="number"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="carbs"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="carbs">Carbs</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="carbs"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type carbs"
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
              <Controller
                name="fat"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fat">Fat</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="fat"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type fat"
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
              <Controller
                name="protein"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="protein">Protein</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="protein"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type protein"
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

              <Button type="submit" disabled={createFood.isPending}>
                {createFood.isPending && <Spinner />}
                Save
              </Button>
            </FieldGroup>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
