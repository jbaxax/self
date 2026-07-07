"use client"
import { Controller, useForm } from "react-hook-form"
import { profileSchema } from "../schemas/profileSchema"
import z from "zod"
import { useUpdateProfile } from "../../application/useUpdateProfile"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

const activityLevel = [
  { label: "active", value: "active" },
  { label: "light", value: "light" },
  { label: "moderate", value: "moderate" },
  { label: "sedentary", value: "sedentary" },
]
const goal = [
  { label: "lose weight", value: "lose_weight" },
  { label: "gain muscle", value: "gain_muscle" },
  { label: "maintain", value: "maintain" },
]

const sex = [
  { label: "male", value: "male" },
  { label: "female", value: "female" },
]

export default function ProfileForm({ userId }: { userId: string }) {
  const updateProfile = useUpdateProfile(userId)
  const router = useRouter()
  const form = useForm<z.infer<typeof profileSchema>>({
    defaultValues: {
      weight: 0,
      height: 0,
      age: 0,
      activity_level: "moderate",
      goal: "maintain",
      sex: "male",
    },
  })

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    try {
      const response = await updateProfile.mutateAsync(data)
      
      router.push("/diet")
      return response.data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado")
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Update your profile</CardTitle>
          <CardDescription>Enter your information</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="weight"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Weight</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      placeholder="Type your weight"
                      type="number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="height"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Height</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      placeholder=""
                      type="number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="age"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Age</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      placeholder=""
                      type="number"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="activity_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Activivity Level</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {activityLevel.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="goal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Goal</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {goal.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="sex"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Sex</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sex.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="h-10">
                Update
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
