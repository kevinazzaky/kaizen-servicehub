"use server";

import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";
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

function getEquipmentStatus(value: string | null): EquipmentStatus {
  if (
    value === "ACTIVE" ||
    value === "NEED_MAINTENANCE" ||
    value === "BROKEN" ||
    value === "INACTIVE"
  ) {
    return value;
  }

  return "ACTIVE";
}

export async function createEquipment(formData: FormData) {
  const clientId = getString(formData, "clientId");
  const name = getString(formData, "name");
  const code = getString(formData, "code");
  const category = getString(formData, "category");
  const brand = getString(formData, "brand");
  const location = getString(formData, "location");
  const description = getString(formData, "description");
  const status = getEquipmentStatus(getString(formData, "status"));

  if (!clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!name) {
    throw new Error("Nama equipment wajib diisi.");
  }

  if (!code) {
    throw new Error("Kode equipment wajib diisi.");
  }

  await prisma.equipment.create({
    data: {
      clientId,
      name,
      code,
      category,
      brand,
      location,
      description,
      status,
    },
  });

  revalidatePath("/equipment");
  redirect("/equipment");
}

export async function updateEquipment(equipmentId: string, formData: FormData) {
  const clientId = getString(formData, "clientId");
  const name = getString(formData, "name");
  const code = getString(formData, "code");
  const category = getString(formData, "category");
  const brand = getString(formData, "brand");
  const location = getString(formData, "location");
  const description = getString(formData, "description");
  const status = getEquipmentStatus(getString(formData, "status"));

  if (!clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!name) {
    throw new Error("Nama equipment wajib diisi.");
  }

  if (!code) {
    throw new Error("Kode equipment wajib diisi.");
  }

  await prisma.equipment.update({
    where: {
      id: equipmentId,
    },
    data: {
      clientId,
      name,
      code,
      category,
      brand,
      location,
      description,
      status,
    },
  });

  revalidatePath("/equipment");
  revalidatePath(`/equipment/${equipmentId}`);
  redirect("/equipment");
}

export async function deleteEquipment(equipmentId: string) {
  await prisma.equipment.delete({
    where: {
      id: equipmentId,
    },
  });

  revalidatePath("/equipment");
  redirect("/equipment");
}
