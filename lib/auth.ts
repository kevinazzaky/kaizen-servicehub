import crypto from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "kaizen_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  role: Role;
  clientId: string | null;
  expiresAt: number;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  clientId: string | null;
};

export async function createSession(user: CurrentUser) {
  const payload: SessionPayload = {
    userId: user.id,
    role: user.role,
    clientId: user.clientId,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: signSession(payload),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientId: true,
    },
  });
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    redirect(user.role === "CLIENT" ? "/client-portal" : "/dashboard");
  }

  return user;
}

export function getHomePathForRole(role: Role) {
  if (role === "CLIENT") {
    return "/client-portal";
  }

  if (role === "TECHNICIAN") {
    return "/technician/jobs";
  }

  return "/dashboard";
}

function signSession(payload: SessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifySession(value: string | undefined): SessionPayload | null {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.SESSION_SECRET ??
    "kaizen-servicehub-dev-secret"
  );
}
