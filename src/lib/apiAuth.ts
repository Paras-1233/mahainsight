import { requireAuth } from "@/lib/auth";

export async function unauthorizedResponse() {
  return Response.json(
    {
      error: "Authentication required",
    },
    {
      status: 401,
    }
  );
}

export async function requireApiAuth() {
  return requireAuth();
}
