import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createAuthToken,
  verifyAuthToken,
  type AuthUser,
} from "@/lib/authToken";

export {
  AUTH_COOKIE_NAME,
  createAuthToken,
  verifyAuthToken,
  type AuthUser,
};

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return verifyAuthToken(token);
}

export async function requireAuth() {
  return getCurrentUser();
}
