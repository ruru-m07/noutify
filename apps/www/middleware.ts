import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "auth";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/token"];
const ASSET_PREFIXES = ["/_next/", "/favicon.ico", "/assets/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_ROUTES.includes(pathname) ||
    ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  if (isAuthenticated && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
