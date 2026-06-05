import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDatabaseUrlConfigError, prisma } from "@/lib/prisma";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  getAuthCookieOptions,
} from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { readJsonObject, requireSameOrigin } from "@/lib/security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);

  if (originError) {
    return originError;
  }

  const databaseConfigError = getDatabaseUrlConfigError();

  if (databaseConfigError) {
    return NextResponse.json(
      {
        error: databaseConfigError,
      },
      {
        status: 503,
      }
    );
  }

  const ip = getClientIp(request);
  const limit = await checkRateLimit({
    key: `login:${ip}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!limit.allowed) {
    return rateLimitResponse(limit.resetAt);
  }

  try {
    const body = await readJsonObject(request);

    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!emailPattern.test(email) || password.length < 1) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const response = NextResponse.json({
      success: true,
      user: safeUser,
    });
    const token = await createAuthToken(safeUser);

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return response;
  } catch {
    return NextResponse.json(
      {
        error: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}
