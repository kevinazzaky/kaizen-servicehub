"use server";

import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import { saveMaintenanceReportRecord } from "@/modules/reports/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMaintenanceReport(
  workOrderId: string,
  formData: FormData,
) {
  const user = await requireRole(["ADMIN", "TECHNICIAN"]);

  await saveMaintenanceReportRecord(
    workOrderId,
    {
      conditionBefore: getString(formData, "conditionBefore"),
      actionTaken: getString(formData, "actionTaken"),
      conditionAfter: getString(formData, "conditionAfter"),
      recommendation: getString(formData, "recommendation"),
      technicianNote: getString(formData, "technicianNote"),
    },
    user,
  );

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  revalidatePath(`/reports/${workOrderId}`);

  redirect(`/work-orders/${workOrderId}`);
}
