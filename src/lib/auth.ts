import crypto from "crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 100000;
const DIGEST = "sha512";
const SESSION_COOKIE = "session_token";
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 })
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  stored: string
): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto
    .scryptSync(password, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 })
    .toString("hex");
  return hash === check;
}

export async function createSession(
  alumniId: number
): Promise<{ token: string; expiresAt: string }> {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  await db.run(
    "INSERT INTO sessions (alumni_id, token, expires_at) VALUES ($1, $2, $3)",
    [alumniId, token, expiresAt]
  );
  return { token, expiresAt };
}

export async function setSessionCookie(
  token: string,
  expiresAt: string
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export interface AlumniUser {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  role: string;
  gender: string;
  location: string;
  occupation: string;
  profile_picture: string;
  must_change_password: number;
}

export async function getCurrentUser(): Promise<AlumniUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const session = await db.get(
    "SELECT alumni_id, expires_at FROM sessions WHERE token = $1",
    [token]
  ) as any;
  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    await db.run("DELETE FROM sessions WHERE token = $1", [token]);
    return null;
  }

  const user = await db.get(
    "SELECT id, name, email, phone_no, role, gender, location, occupation, profile_picture, must_change_password FROM alumni WHERE id = $1",
    [session.alumni_id]
  ) as AlumniUser | undefined;

  return user || null;
}

export async function deleteSession(
  token: string
): Promise<void> {
  const db = getDb();
  await db.run("DELETE FROM sessions WHERE token = $1", [token]);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = getDb();
    await db.run("DELETE FROM sessions WHERE token = $1", [token]);
  }
  cookieStore.delete(SESSION_COOKIE);
}
