import type { CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type MaintenanceReportInput = {
  conditionBefore: string | null;
  actionTaken: string | null;
  conditionAfter: string | null;
  recommendation: string | null;
  technicianNote: string | null;
};

export async function saveMaintenanceReportRecord(
  workOrderId: string,
  input: MaintenanceReportInput,
  user: CurrentUser,
) {
  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id: workOrderId,
    },
  });

  if (!workOrder) {
    throw new Error("Work order tidak ditemukan.");
  }

  if (
    user.role === "TECHNICIAN" &&
    workOrder.technicianId &&
    workOrder.technicianId !== user.id
  ) {
    throw new Error("Work order ini bukan assignment kamu.");
  }

  await prisma.maintenanceReport.upsert({
    where: {
      workOrderId,
    },
    update: input,
    create: {
      workOrderId,
      ...input,
    },
  });

  return prisma.workOrder.update({
    where: {
      id: workOrderId,
    },
    data: {
      status: "COMPLETED",
      ...(user.role === "TECHNICIAN" && !workOrder.technicianId
        ? { technicianId: user.id }
        : {}),
    },
  });
}
