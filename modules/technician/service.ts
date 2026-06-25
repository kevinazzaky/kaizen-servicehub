import { WorkOrderStatus } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  saveMaintenanceReportRecord,
  type MaintenanceReportInput,
} from "@/modules/reports/service";

async function findAssignableWorkOrder(workOrderId: string, user: CurrentUser) {
  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id: workOrderId,
    },
    select: {
      technicianId: true,
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

  return workOrder;
}

export async function updateTechnicianJobStatus(
  workOrderId: string,
  status: WorkOrderStatus,
  user: CurrentUser,
) {
  const workOrder = await findAssignableWorkOrder(workOrderId, user);

  return prisma.workOrder.update({
    where: {
      id: workOrderId,
    },
    data: {
      status,
      ...(user.role === "TECHNICIAN" && !workOrder.technicianId
        ? { technicianId: user.id }
        : {}),
    },
  });
}

export async function saveTechnicianJobReport(
  workOrderId: string,
  input: MaintenanceReportInput,
  user: CurrentUser,
) {
  return saveMaintenanceReportRecord(workOrderId, input, user);
}
