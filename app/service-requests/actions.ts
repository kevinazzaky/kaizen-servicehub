"use server";

import { ServiceRequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getDate, getString } from "@/lib/form-data";
import {
  convertServiceRequestToWorkOrder,
  updateServiceRequestStatusRecord,
} from "@/modules/service-requests/service";

export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceRequestStatus,
) {
  await requireRole(["ADMIN"]);

  await updateServiceRequestStatusRecord(requestId, status);

  revalidatePath("/service-requests");
  revalidatePath(`/service-requests/${requestId}`);
}

export async function convertRequestToWorkOrder(
  requestId: string,
  formData: FormData,
) {
  await requireRole(["ADMIN"]);

  const workOrder = await convertServiceRequestToWorkOrder(requestId, {
    equipmentId: getString(formData, "equipmentId"),
    technicianId: getString(formData, "technicianId"),
    scheduledDate: getDate(getString(formData, "scheduledDate")),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
  });

  revalidatePath("/service-requests");
  revalidatePath("/work-orders");
  redirect(`/work-orders/${workOrder.id}`);
}
