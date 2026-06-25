"use server";

import { requireRole } from "@/lib/auth";
import { getDate, getString } from "@/lib/form-data";
import {
  createWorkOrderRecord,
  deleteWorkOrderRecord,
  parseWorkOrderStatus,
  updateWorkOrderRecord,
} from "@/modules/work-orders/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkOrder(formData: FormData) {
  await requireRole(["ADMIN"]);

  await createWorkOrderRecord({
    clientId: getString(formData, "clientId"),
    equipmentId: getString(formData, "equipmentId"),
    technicianId: getString(formData, "technicianId"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    scheduledDate: getDate(getString(formData, "scheduledDate")),
    status: parseWorkOrderStatus(getString(formData, "status")),
  });

  revalidatePath("/work-orders");
  redirect("/work-orders");
}

export async function updateWorkOrder(workOrderId: string, formData: FormData) {
  await requireRole(["ADMIN", "TECHNICIAN"]);

  await updateWorkOrderRecord(workOrderId, {
    clientId: getString(formData, "clientId"),
    equipmentId: getString(formData, "equipmentId"),
    technicianId: getString(formData, "technicianId"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    scheduledDate: getDate(getString(formData, "scheduledDate")),
    status: parseWorkOrderStatus(getString(formData, "status")),
  });

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  redirect("/work-orders");
}

export async function deleteWorkOrder(workOrderId: string) {
  await requireRole(["ADMIN"]);

  await deleteWorkOrderRecord(workOrderId);

  revalidatePath("/work-orders");
  redirect("/work-orders");
}
