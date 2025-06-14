import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

const secret = process.env.JWT_SECRET || "supersecretkey";
const expiration = "2h";

interface UserPayload {
  username: string;
  _id: string;
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export function signToken({ username, _id }: UserPayload): string {
  const payload = { username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: AuthRequest }): AuthRequest {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // Extract token from "Bearer <token>"
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.split(" ").pop()?.trim();
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, secret) as { data: UserPayload };
    req.user = decoded.data;
  } catch {
    console.log("Invalid token");
  }

  return req;
}
