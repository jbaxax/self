"use client"
import { signIn } from "../../infrastructure/authService"
import { Controller, useForm } from "react-hook-form"
import { loginSchema } from "../schemas/loginSchema"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginFormUI() {
  const router = useRouter()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const { error } = await signIn(data)
      if (error) {
        console.log(error)
        return
      }
      router.push("/diet")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                      //placeholder="Ingresa tu correo"
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
                      placeholder=""
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
             
                <Button type="submit" className="h-10">Iniciar sesión</Button>
             
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
