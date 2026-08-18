import { AppSidebar } from "@/components/shared/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SessionUser } from "@/features/auth/domain/types"
import {
  getProfile,
  me,
} from "@/features/auth/infrastructure/authService.server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabaseUser = await me()
  if (!supabaseUser) redirect("/login")

  const user: SessionUser = { email: supabaseUser.email! }
  const profile = await getProfile(supabaseUser.id)
  if (!profile?.weight) redirect("/profile")

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm font-medium">Daily Log</span>
        </header>
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
