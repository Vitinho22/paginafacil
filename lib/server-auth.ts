import { adminAuth } from "./firebase-admin";

export async function requireUser(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}