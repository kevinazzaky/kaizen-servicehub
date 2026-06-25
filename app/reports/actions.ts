"use server";

import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import { saveReportPhoto } from "@/lib/report-photos";
import { saveMaintenanceReportRecord } from "@/modules/reports/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMaintenanceReport(
  workOrderId: string,
  formData: FormData,
) {
  const user = await requireRole(["ADMIN", "TECHNICIAN"]);
  const beforePhotoUrl = await saveReportPhoto(
    formData.get("beforePhoto"),
    workOrderId,
    "before",
  );
  const afterPhotoUrl = await saveReportPhoto(
    formData.get("afterPhoto"),
    workOrderId,
    "after",
  );

  await saveMaintenanceReportRecord(
    workOrderId,
    {
      conditionBefore: getString(formData, "conditionBefore"),
      actionTaken: getString(formData, "actionTaken"),
      conditionAfter: getString(formData, "conditionAfter"),
      recommendation: getString(formData, "recommendation"),
      technicianNote: getString(formData, "technicianNote"),
      ...(beforePhotoUrl ? { beforePhotoUrl } : {}),
      ...(afterPhotoUrl ? { afterPhotoUrl } : {}),
    },
    user,
  );

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  revalidatePath(`/reports/${workOrderId}`);

  redirect(`/work-orders/${workOrderId}`);
}
