import { Role } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export type TeamUserInput = {
  name: string | null;
  email: string | null;
  password: string | null;
  role: Role;
  clientId: string | null;
};

export function parseRole(value: string | null): Role {
  if (value === "ADMIN" || value === "TECHNICIAN" || value === "CLIENT") {
    return value;
  }

  return "TECHNICIAN";
}

function validateClientRole(role: Role, clientId: string | null) {
  if (role === "CLIENT" && !clientId) {
    throw new Error("Client wajib dipilih untuk user role CLIENT.");
  }
}

export async function createTeamUserRecord(input: TeamUserInput) {
  if (!input.name || !input.email || !input.password) {
    throw new Error("Nama, email, dan password wajib diisi.");
  }

  if (input.password.length < 8) {
    throw new Error("Password minimal 8 karakter.");
  }

  validateClientRole(input.role, input.clientId);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
      role: input.role,
      clientId: input.clientId,
    },
  });
}

export async function updateTeamUserRecord(
  userId: string,
  input: TeamUserInput,
  currentUser: CurrentUser,
) {
  if (!input.name || !input.email) {
    throw new Error("Nama dan email wajib diisi.");
  }

  validateClientRole(input.role, input.clientId);

  if (currentUser.id === userId && input.role !== "ADMIN") {
    throw new Error(
      "Akun admin yang sedang login tidak boleh menurunkan role sendiri.",
    );
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      clientId: input.clientId,
      ...(input.password ? { password: await hashPassword(input.password) } : {}),
    },
  });
}

export async function deleteTeamUserRecord(
  userId: string,
  currentUser: CurrentUser,
) {
  if (currentUser.id === userId) {
    throw new Error("Akun yang sedang login tidak boleh dihapus.");
  }

  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
