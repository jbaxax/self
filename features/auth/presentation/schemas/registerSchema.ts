import z from "zod";

export const registerSchema = z.object({
    email: z.email("Ingresa email valido"),
    password: z.string().min(6,"Minimo 6 caracteres"),
    confirmPassword: z.string().min(6,"Minitmo 6 caractere")
}).superRefine((data,ctx)=> {
    if(data.password !== data.confirmPassword){
       ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],  
      })
    }
})