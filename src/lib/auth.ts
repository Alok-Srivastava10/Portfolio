import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_purposes";

export interface TokenPayload {
  email: string;
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): TokenPayload | null {
  // Try to get token from cookie
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    // Try to get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const headerToken = authHeader.substring(7);
      return verifyToken(headerToken);
    }
    return null;
  }
  return verifyToken(token);
}
