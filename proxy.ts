import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getProfile, me } from "./features/auth/infrastructure/authService.server"
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const user = await me()

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const profile = await getProfile(user.id)
  if (!profile?.weight && pathname !== "/profile") {
    return NextResponse.redirect(new URL("/profile", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/((?!login|register|_next|favicon.ico).*)",
}
