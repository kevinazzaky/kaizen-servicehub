"use server";

import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import {
  createEquipmentRecord,
  deleteEquipmentRecord,
  parseEquipmentStatus,
  updateEquipmentRecord,
} from "@/modules/equipment/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEquipment(formData: FormData) {
  await requireRole(["ADMIN"]);

  await createEquipmentRecord({
    clientId: getString(formData, "clientId"),
    name: getString(formData, "name"),
    code: getString(formData, "code"),
    category: getString(formData, "category"),
    brand: getString(formData, "brand"),
    location: getString(formData, "location"),
    description: getString(formData, "description"),
    status: parseEquipmentStatus(getString(formData, "status")),
  });

  revalidatePath("/equipment");
  redirect("/equipment");
}

export async function updateEquipment(equipmentId: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  await updateEquipmentRecord(equipmentId, {
    clientId: getString(formData, "clientId"),
    name: getString(formData, "name"),
    code: getString(formData, "code"),
    category: getString(formData, "category"),
    brand: getString(formData, "brand"),
    location: getString(formData, "location"),
    description: getString(formData, "description"),
    status: parseEquipmentStatus(getString(formData, "status")),
  });

  revalidatePath("/equipment");
  revalidatePath(`/equipment/${equipmentId}`);
  redirect("/equipment");
}

export async function deleteEquipment(equipmentId: string) {
  await requireRole(["ADMIN"]);

  await deleteEquipmentRecord(equipmentId);

  revalidatePath("/equipment");
  redirect("/equipment");
}
