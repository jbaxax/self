"use client"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { registerSchema } from "../schemas/registerSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "../../infrastructure/authService"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    try {
      const { error } = await signUp(data)
      if (error) {
        console.log(error)
        return
      }
      router.push("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>

        <CardTitle>Crea una cuenta</CardTitle>
        <CardDescription>
          Ingresa tu correo y contraseña para crear una cuenta
        </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Correo</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Confirmar contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="form-login"
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

            <Button type="submit" className="h-10">
              Registrarse
            </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
