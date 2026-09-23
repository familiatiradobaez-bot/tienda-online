import type { User, PublicUser } from "~/lib/types";

const encoder = new TextEncoder();

async function hashWithSalt(password: string, salt: Uint8Array): Promise<string> {
  const data = new Uint8Array([...encoder.encode(password), ...salt]);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const saltHex = [...salt].map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return hashWithSalt(password, salt);
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const computed = await hashWithSalt(password, salt);
  const [, computedHash] = computed.split(":");
  return computedHash === hashHex;
}

const SESSION_COOKIE = "sid";
const SESSION_TTL = 60 * 60 * 24 * 7;

export function generateSessionId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(kv: KVNamespace, userId: number): Promise<string> {
  const sessionId = generateSessionId();
  await kv.put(sessionId, JSON.stringify({ userId, createdAt: Date.now() }), { expirationTtl: SESSION_TTL });
  return sessionId;
}

export async function getSession(kv: KVNamespace, sessionId: string): Promise<{ userId: number } | null> {
  const data = await kv.get(sessionId);
  if (!data) return null;
  try { return JSON.parse(data); } catch { return null; }
}

export async function destroySession(kv: KVNamespace, sessionId: string): Promise<void> {
  await kv.delete(sessionId);
}

export function getSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === SESSION_COOKIE) return value;
  }
  return null;
}

export function createSessionCookieHeader(sessionId: string): string {
  return `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}

export function createDeleteSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export { SESSION_COOKIE, SESSION_TTL };

export function toPublicUser(user: User): PublicUser {
  const { password_hash, ...publicUser } = user;
  return publicUser;
}
