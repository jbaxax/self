import React from "react"
import { signIn } from "../../infrastructure/authService"
import { Controller, useForm } from "react-hook-form"
import { LoginForm, loginSchema } from "../schemas/loginSchema"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function LoginFormUI() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const response = await signIn(data)
    return response.data
  }

  return (
    <div>
      <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
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
                //placeholder="Ingresa tu correo"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                placeholder=""
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </div>
  )
}
