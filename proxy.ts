import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getProfile, me } from "./features/auth/infrastructure/authService.server"
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const user = await me()
  const isAuthRoute = pathname === "/login" || pathname === "/register"

  if (!user) {
    return isAuthRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url))
  }

  const profile = await getProfile(user.id)
  if (!profile?.weight && pathname !== "/profile") {
    return NextResponse.redirect(new URL("/profile", request.url))
  }
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/diet", request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: "/((?!_next|favicon.ico).*)",
}
