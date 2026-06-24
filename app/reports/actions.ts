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

export async function saveMaintenanceReport(
  workOrderId: string,
  formData: FormData,
) {
  const conditionBefore = getString(formData, "conditionBefore");
  const actionTaken = getString(formData, "actionTaken");
  const conditionAfter = getString(formData, "conditionAfter");
  const recommendation = getString(formData, "recommendation");
  const technicianNote = getString(formData, "technicianNote");

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id: workOrderId,
    },
  });

  if (!workOrder) {
    throw new Error("Work order tidak ditemukan.");
  }

  await prisma.maintenanceReport.upsert({
    where: {
      workOrderId,
    },
    update: {
      conditionBefore,
      actionTaken,
      conditionAfter,
      recommendation,
      technicianNote,
    },
    create: {
      workOrderId,
      conditionBefore,
      actionTaken,
      conditionAfter,
      recommendation,
      technicianNote,
    },
  });

  await prisma.workOrder.update({
    where: {
      id: workOrderId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  revalidatePath(`/reports/${workOrderId}`);

  redirect(`/work-orders/${workOrderId}`);
}
