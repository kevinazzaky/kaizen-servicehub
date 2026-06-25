import { ServiceRequestStatus, WorkOrderStatus } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorkOrderNo } from "@/lib/work-order-number";

export type ServiceRequestInput = {
  clientId: string | null;
  equipmentId: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  priority: string;
};

export type ConvertRequestInput = {
  equipmentId: string | null;
  technicianId: string | null;
  scheduledDate: Date | null;
  title: string | null;
  description: string | null;
};

export async function createServiceRequestRecord(
  input: ServiceRequestInput,
  user: CurrentUser,
) {
  const clientId = user.role === "CLIENT" ? user.clientId : input.clientId;

  if (!clientId) {
    throw new Error("Client tidak ditemukan untuk user ini.");
  }

  if (!input.title || !input.description) {
    throw new Error("Judul dan deskripsi problem wajib diisi.");
  }

  return prisma.serviceRequest.create({
    data: {
      clientId,
      equipmentId: input.equipmentId,
      title: input.title,
      description: input.description,
      location: input.location,
      priority: input.priority,
    },
  });
}

export async function updateServiceRequestStatusRecord(
  requestId: string,
  status: ServiceRequestStatus,
) {
  return prisma.serviceRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status,
    },
  });
}

export async function convertServiceRequestToWorkOrder(
  requestId: string,
  input: ConvertRequestInput,
) {
  const request = await prisma.serviceRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new Error("Request tidak ditemukan.");
  }

  const equipmentId = input.equipmentId ?? request.equipmentId;

  if (!equipmentId) {
    throw new Error("Equipment wajib dipilih untuk membuat work order.");
  }

  const workOrder = await prisma.workOrder.create({
    data: {
      workOrderNo: await generateWorkOrderNo(),
      clientId: request.clientId,
      equipmentId,
      technicianId: input.technicianId,
      title: input.title ?? request.title,
      description: input.description ?? request.description,
      scheduledDate: input.scheduledDate,
      status: WorkOrderStatus.PENDING,
    },
  });

  await prisma.serviceRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: ServiceRequestStatus.CONVERTED,
    },
  });

  return workOrder;
}
