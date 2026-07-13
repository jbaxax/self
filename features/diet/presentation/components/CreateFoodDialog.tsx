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
export default function CreateFoodDialog() {
  const [open,setOpen] = useState(false);
  const createFood = useCreateFood()
  const form = useForm<z.infer<typeof foodSchema>>({
    defaultValues: {
      calories: 0,
      carbs: 0,
      fat: 0,
      name: "",
      portion_desc: "",
      protein: 0,
    },
  })

  async function onSubmit(data: z.infer<typeof foodSchema>) {
    try {
      const response = await createFood.mutateAsync(data)
      setOpen(false);
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
          <DialogTitle>Create Fodd</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>

          <form id="form-food" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type calories"
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
                    <FieldLabel>Portion</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
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
                    <FieldLabel>Calories</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type calories"
                      type="number"
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
                    <FieldLabel>Carbs</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type carbs"
                      type="number"
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
                    <FieldLabel>Fat</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type fat"
                      type="number"
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
                    <FieldLabel>Protein</FieldLabel>
                    <Input
                      {...field}
                      id="form-food"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type protein"
                      type="number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit">
                Save
              </Button>
            </FieldGroup>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
