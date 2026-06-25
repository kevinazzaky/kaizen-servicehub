"use server";

import { WorkOrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import { saveReportPhoto } from "@/lib/report-photos";
import {
  saveTechnicianJobReport,
  updateTechnicianJobStatus,
} from "@/modules/technician/service";

export async function updateJobStatus(
  workOrderId: string,
  status: WorkOrderStatus,
) {
  const user = await requireRole(["ADMIN", "TECHNICIAN"]);

  await updateTechnicianJobStatus(workOrderId, status, user);

  revalidatePath("/technician/jobs");
  revalidatePath(`/technician/jobs/${workOrderId}`);
  revalidatePath(`/work-orders/${workOrderId}`);
  redirect(`/technician/jobs/${workOrderId}`);
}

export async function saveTechnicianReport(
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

  await saveTechnicianJobReport(
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

  revalidatePath("/technician/jobs");
  revalidatePath(`/technician/jobs/${workOrderId}`);
  revalidatePath(`/client-portal/work-orders/${workOrderId}`);
  redirect("/technician/jobs");
}
