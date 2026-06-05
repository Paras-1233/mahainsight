import { NextResponse } from "next/server";

export function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Request not allowed",
    },
    {
      status: 403,
    }
  );
}

export function badRequestResponse(error: string) {
  return NextResponse.json(
    {
      error,
    },
    {
      status: 400,
    }
  );
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    new URL(request.url).protocol.replace(":", "");

  if (!host) {
    return false;
  }

  return origin === `${protocol}://${host}`;
}

export function requireSameOrigin(request: Request) {
  return isSameOriginRequest(request) ? null : forbiddenResponse();
}

export async function readJsonObject(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }

  const body = await request.json();

  return body && typeof body === "object" && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function logServerError(message: string, error: unknown) {
  if (isProduction()) {
    console.error(message);
    return;
  }

  console.error(message, error);
}
