import { EquipmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type EquipmentInput = {
  clientId: string | null;
  name: string | null;
  code: string | null;
  category: string | null;
  brand: string | null;
  location: string | null;
  description: string | null;
  status: EquipmentStatus;
};

export function parseEquipmentStatus(value: string | null): EquipmentStatus {
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

function validateEquipmentInput(input: EquipmentInput) {
  if (!input.clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!input.name) {
    throw new Error("Nama equipment wajib diisi.");
  }

  if (!input.code) {
    throw new Error("Kode equipment wajib diisi.");
  }

  return {
    clientId: input.clientId,
    name: input.name,
    code: input.code,
    category: input.category,
    brand: input.brand,
    location: input.location,
    description: input.description,
    status: input.status,
  };
}

export async function createEquipmentRecord(input: EquipmentInput) {
  return prisma.equipment.create({
    data: validateEquipmentInput(input),
  });
}

export async function updateEquipmentRecord(
  equipmentId: string,
  input: EquipmentInput,
) {
  return prisma.equipment.update({
    where: {
      id: equipmentId,
    },
    data: validateEquipmentInput(input),
  });
}

export async function deleteEquipmentRecord(equipmentId: string) {
  return prisma.equipment.delete({
    where: {
      id: equipmentId,
    },
  });
}
