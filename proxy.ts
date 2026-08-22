import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Proxy (formerly middleware) — protects all dashboard/profile/admin routes.
 *
 * Rules:
 * - Unauthenticated users → redirect to /signin
 * - EMPLOYEE role accessing /admin/* → redirect to /dashboard
 * - Authenticated users accessing /signin or /signup → redirect to their home
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/attendance") ||
    pathname.startsWith("/leave") ||
    pathname.startsWith("/payroll");

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    const home = token.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Redirect unauthenticated users to signin
  if (!isAuthenticated && isProtected) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // EMPLOYEE cannot access admin pages
  if (isAuthenticated && token.role === "EMPLOYEE" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/attendance/:path*",
    "/leaves/:path*",
    "/payroll/:path*",
    "/signin",
    "/signup",
  ],
};
