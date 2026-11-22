import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";
import prisma from "./prisma";

export const AUTH_COOKIE_NAME = "noorkids_auth_token";

export async function getSessionFromRequest(
  req: NextRequest
): Promise<TokenPayload | null> {
  // Check cookie first
  const cookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookie) {
    const verified = await verifyToken(cookie);
    if (verified) return verified;
  }

  // Check Authorization header fallback
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const verified = await verifyToken(token);
    if (verified) return verified;
  }

  return null;
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: ("CHILD" | "PARENT" | "ADMIN")[]
): Promise<{ user: TokenPayload; response?: never } | { user?: never; response: NextResponse }> {
  const session = await getSessionFromRequest(req);

  if (!session) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized. Please log in to NoorKids." },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return {
      response: NextResponse.json(
        { error: "Forbidden: You do not have permission to access this area." },
        { status: 403 }
      ),
    };
  }

  return { user: session };
}
