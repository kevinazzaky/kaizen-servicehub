"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function createClient(formData: FormData) {
  const name = getString(formData, "name");
  const address = getString(formData, "address");
  const picName = getString(formData, "picName");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");

  if (!name) {
    throw new Error("Nama client wajib diisi.");
  }

  await prisma.client.create({
    data: {
      name,
      address,
      picName,
      phone,
      email,
      status: "ACTIVE",
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(clientId: string, formData: FormData) {
  const name = getString(formData, "name");
  const address = getString(formData, "address");
  const picName = getString(formData, "picName");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const status = getString(formData, "status") ?? "ACTIVE";

  if (!name) {
    throw new Error("Nama client wajib diisi.");
  }

  await prisma.client.update({
    where: {
      id: clientId,
    },
    data: {
      name,
      address,
      picName,
      phone,
      email,
      status,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  redirect("/clients");
}

export async function deleteClient(clientId: string) {
  await prisma.client.delete({
    where: {
      id: clientId,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}