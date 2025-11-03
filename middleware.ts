import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth", "/api/signup", "/_next", "/favicon.ico", "/public"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function roleAllowed(pathname: string, role?: string | null) {
  if (!role) return false;
  if (role === "ADMIN") return pathname.startsWith("/admin") || pathname.startsWith("/staff") || pathname.startsWith("/home");
  if (role === "STAFF") return pathname.startsWith("/staff");
  if (role === "USER") return pathname.startsWith("/home");
  return true; // other routes allowed
}

function roleHome(role?: string | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "STAFF") return "/staff";
  if (role === "USER") return "/home";
  return "/";
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as string | undefined;

  // Redirect authenticated user from root to their home
  if (pathname === "/" && token) {
    const dest = roleHome(role);
    if (dest !== "/") {
      return NextResponse.redirect(new URL(dest, origin));
    }
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Block protected areas when not signed in
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/staff") || pathname.startsWith("/home"))) {
    const url = new URL("/login", origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Enforce role-specific access
  if (token && !roleAllowed(pathname, role)) {
    const dest = roleHome(role);
    return NextResponse.redirect(new URL(dest, origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/admin/:path*",
    "/staff/:path*",
    "/home/:path*",
  ],
};
