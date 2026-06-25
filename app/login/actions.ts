"use server";

import { redirect } from "next/navigation";
import { createSession, clearSession, getHomePathForRole } from "@/lib/auth";
import {
  authenticateUser,
  createFirstAdminUser,
  parseAuthRole,
} from "@/modules/auth/service";

export type AuthFormState = {
  error?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const selectedRole = parseAuthRole(getString(formData, "role"));

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const result = await authenticateUser({ email, password, selectedRole });

  if (result.error || !result.user) {
    return { error: result.error };
  }

  await createSession(result.user);
  redirect(getHomePathForRole(result.user.role));
}

export async function createFirstAdmin(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  const result = await createFirstAdminUser({ name, email, password });

  if (result.error || !result.user) {
    return { error: result.error };
  }

  await createSession(result.user);
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
