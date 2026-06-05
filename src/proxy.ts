import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/authToken";

const protectedPagePrefixes = [
  "/dashboard",
  "/weather",
  "/rainfall",
  "/crops",
  "/demographics",
  "/maps",
  "/profile",
  "/alerts",
];

const protectedApiPrefixes = [
  "/api/weather/save",
  "/api/rainfall/sync",
  "/api/rainfall/historical/sync",
  "/api/crops/sync",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPage = protectedPagePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isProtectedApi = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const user = await verifyAuthToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (user) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json(
      {
        error: "Authentication required",
      },
      {
        status: 401,
      }
    );
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/weather/:path*",
    "/rainfall/:path*",
    "/crops/:path*",
    "/demographics/:path*",
    "/maps/:path*",
    "/profile/:path*",
    "/alerts/:path*",
    "/api/weather/save",
    "/api/rainfall/sync",
    "/api/rainfall/historical/sync",
    "/api/crops/sync",
  ],
};
