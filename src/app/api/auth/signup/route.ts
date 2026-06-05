import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDatabaseUrlConfigError, prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { badRequestResponse, readJsonObject, requireSameOrigin } from "@/lib/security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must be between 2 and 80 characters." };
  }

  if (!emailPattern.test(email) || email.length > 160) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 8 || password.length > 128) {
    return { error: "Password must be between 8 and 128 characters." };
  }

  return {
    name,
    email,
    password,
  };
}

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
    key: `signup:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!limit.allowed) {
    return rateLimitResponse(limit.resetAt);
  }

  try {
    const body = await readJsonObject(request);

    if (!body) {
      return badRequestResponse("Invalid signup payload");
    }

    const validation = validateSignup(body);

    if ("error" in validation) {
      return NextResponse.json(
        {
          error: validation.error,
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validation.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Unable to create account with these details.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(validation.password, 12);
    const user = await prisma.user.create({
      data: {
        name: validation.name,
        email: validation.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 201,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}
