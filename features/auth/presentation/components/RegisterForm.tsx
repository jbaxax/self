import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { registerSchema } from "../schemas/registerSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "../../infrastructure/authService"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit">Registrarse</Button>
      </form>
    </div>
  )
}
