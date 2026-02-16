import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route yang butuh login
 */
const PROTECTED_ROUTES = ["/shopping-cart", "/profile", "/orders", "/checkout"];

/**
 * Route publik (tidak boleh diakses jika sudah login)
 */
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  /**
   * Ambil token auth dari cookie
   * (nanti bisa diganti Firebase session cookie)
   */
  const authToken = request.cookies.get("auth-token")?.value;

  /**
   * ❌ Belum login tapi akses halaman protected
   */
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * ✅ Sudah login tapi ke halaman login/register
   */
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher (WAJIB)
 * Hindari static files & API
 */
export const config = {
  matcher: [
    "/shopping-cart/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/login/:path*",
    "/register/:path*",
  ],
};
