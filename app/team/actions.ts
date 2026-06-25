"use server";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import {
  createTeamUserRecord,
  deleteTeamUserRecord,
  parseRole,
  updateTeamUserRecord,
} from "@/modules/team/service";

function getClientId(role: Role, formData: FormData) {
  if (role !== "CLIENT") {
    return null;
  }

  return getString(formData, "clientId");
}

export async function createTeamUser(formData: FormData) {
  await requireRole(["ADMIN"]);

  const name = getString(formData, "name");
  const email = getString(formData, "email")?.toLowerCase() ?? null;
  const password = getString(formData, "password");
  const role = parseRole(getString(formData, "role"));
  const clientId = getClientId(role, formData);

  await createTeamUserRecord({
    name,
    email,
    password,
    role,
    clientId,
  });

  revalidatePath("/team");
  redirect("/team");
}

export async function updateTeamUser(userId: string, formData: FormData) {
  const currentUser = await requireRole(["ADMIN"]);

  const name = getString(formData, "name");
  const email = getString(formData, "email")?.toLowerCase() ?? null;
  const password = getString(formData, "password");
  const role = parseRole(getString(formData, "role"));
  const clientId = getClientId(role, formData);

  await updateTeamUserRecord(
    userId,
    {
      name,
      email,
      password,
      role,
      clientId,
    },
    currentUser,
  );

  revalidatePath("/team");
  revalidatePath(`/team/${userId}`);
  redirect("/team");
}

export async function deleteTeamUser(userId: string) {
  const currentUser = await requireRole(["ADMIN"]);

  await deleteTeamUserRecord(userId, currentUser);

  revalidatePath("/team");
  redirect("/team");
}
