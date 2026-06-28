import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { me } from "./features/auth/infrastructure/authService.server"

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const user = await me()
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/((?!login|register|_next|favicon.ico).*)",
  //matcher: "/diet"
}
