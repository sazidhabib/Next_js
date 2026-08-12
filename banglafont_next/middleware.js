import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const designerToken = request.cookies.get("designer_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to admin dashboard if already logged in and visiting login page
  if (pathname === "/admin/login" && token) {
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect /designer/dashboard routes
  if (pathname.startsWith("/designer/dashboard")) {
    if (!designerToken) {
      const loginUrl = new URL("/designer/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to designer dashboard if already logged in and visiting login/register pages
  if ((pathname === "/designer/login" || pathname === "/designer/register") && designerToken) {
    const dashboardUrl = new URL("/designer/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths starting with /admin or designer dashboard/auth
  matcher: [
    "/admin/:path*",
    "/designer/dashboard/:path*",
    "/designer/login",
    "/designer/register",
  ],
};
