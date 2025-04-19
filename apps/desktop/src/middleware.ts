import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth(); // Check session
  const isAuthenticated = !!session;

  // Define public routes
  const publicRoutes = ["/", "/auth/login", "/auth/token", "/auth/verify-code"];

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow assets to be accessed freely
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/favicon/") ||
    pathname.startsWith("/assets/")
  ) {
    return NextResponse.next();
  }

  if (isAuthenticated && publicRoutes.includes(pathname)) {
    // Redirect authenticated users away from public routes
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    // Redirect unauthenticated users trying to access protected routes
    const callbackUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Allow access to authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: 'nodejs',
};
