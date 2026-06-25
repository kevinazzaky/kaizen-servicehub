import { Role } from "@prisma/client";
import type { User } from "@prisma/client";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type AuthResult =
  | {
      user: User;
      error?: never;
    }
  | {
      user?: never;
      error: string;
    };

export function parseAuthRole(value: string) {
  if (value === "ADMIN" || value === "TECHNICIAN" || value === "CLIENT") {
    return value;
  }

  return null;
}

export async function getUsersCount() {
  return prisma.user.count();
}

export async function authenticateUser(input: {
  email: string;
  password: string;
  selectedRole: Role | null;
}): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user || !(await verifyPassword(input.password, user.password))) {
    return { error: "Email atau password salah." };
  }

  if (input.selectedRole && user.role !== input.selectedRole) {
    return {
      error: `Akun ini bukan akun ${input.selectedRole.toLowerCase()}. Pilih portal yang sesuai.`,
    };
  }

  return { user };
}

export async function createFirstAdminUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const usersCount = await prisma.user.count();

  if (usersCount > 0) {
    return { error: "Setup admin awal sudah tidak tersedia." };
  }

  if (!input.name || !input.email || input.password.length < 8) {
    return {
      error: "Nama, email, dan password minimal 8 karakter wajib diisi.",
    };
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: await hashPassword(input.password),
      role: Role.ADMIN,
    },
  });

  return { user };
}
