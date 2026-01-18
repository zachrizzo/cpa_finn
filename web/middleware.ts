import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

function hasValidSession(request: NextRequest): boolean {
  return !!request.cookies.get("__session")?.value;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasValidSession(request);

  // Redirect unauthenticated users from protected routes to login
  if (isRouteMatch(pathname, PROTECTED_ROUTES) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isRouteMatch(pathname, AUTH_ROUTES) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except static files, images, favicon, and API routes
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
