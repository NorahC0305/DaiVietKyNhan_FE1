import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLE } from "@constants/common";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Get user role from token
  const userRole = token ? String((token as any)?.role) : null;
  const isAdmin = userRole === String(ROLE.ADMIN.ID);
  const isCustomer = userRole === String(ROLE.CUSTOMER.ID);

  // Protect all admin routes - only admins can access
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Unauthenticated users trying to access admin routes
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (!isAdmin) {
      // Non-admin users trying to access admin routes get redirected to not-found
      // and change URL to hide admin path
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (token && pathname.startsWith("/auth")) {
    // Redirect based on role
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (isCustomer) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Redirect unauthenticated users to login for protected routes
  if (!token) {
    const publicPaths = [
      "/",
      "/introduce",
      "/auth",
      "/contact",
      "/about",
    ];

    const isPublicPath = publicPaths.some(
      (path) => pathname === path || (path !== "/" && pathname.startsWith(path))
    );

    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
