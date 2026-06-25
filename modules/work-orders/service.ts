import { WorkOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateWorkOrderNo } from "@/lib/work-order-number";

export type WorkOrderInput = {
  clientId: string | null;
  equipmentId: string | null;
  technicianId: string | null;
  title: string | null;
  description: string | null;
  scheduledDate: Date | null;
  status: WorkOrderStatus;
};

export function parseWorkOrderStatus(value: string | null): WorkOrderStatus {
  if (
    value === "PENDING" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED" ||
    value === "CANCELLED"
  ) {
    return value;
  }

  return "PENDING";
}

function validateWorkOrderInput(input: WorkOrderInput) {
  if (!input.clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!input.equipmentId) {
    throw new Error("Equipment wajib dipilih.");
  }

  if (!input.title) {
    throw new Error("Judul work order wajib diisi.");
  }

  return {
    clientId: input.clientId,
    equipmentId: input.equipmentId,
    technicianId: input.technicianId,
    title: input.title,
    description: input.description,
    scheduledDate: input.scheduledDate,
    status: input.status,
  };
}

export async function createWorkOrderRecord(input: WorkOrderInput) {
  return prisma.workOrder.create({
    data: {
      workOrderNo: await generateWorkOrderNo(),
      ...validateWorkOrderInput(input),
    },
  });
}

export async function updateWorkOrderRecord(
  workOrderId: string,
  input: WorkOrderInput,
) {
  return prisma.workOrder.update({
    where: {
      id: workOrderId,
    },
    data: validateWorkOrderInput(input),
  });
}

export async function deleteWorkOrderRecord(workOrderId: string) {
  return prisma.workOrder.delete({
    where: {
      id: workOrderId,
    },
  });
}
