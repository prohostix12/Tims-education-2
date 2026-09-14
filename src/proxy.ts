import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPublicApi = pathname === "/api/admin/login" || pathname === "/api/admin/check-auth";

  const session = request.cookies.get("admin_session")?.value;
  const isAuthenticated = session === "authenticated";

  // Protect Admin Pages
  if (isAdminRoute && !isLoginPage) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to dashboard if logged in user visits login page
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Protect Admin API Routes (except public ones like login/check-auth)
  if (isAdminApi && !isPublicApi && !isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
