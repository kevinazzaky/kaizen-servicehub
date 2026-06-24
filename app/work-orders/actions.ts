"use server";

import { prisma } from "@/lib/prisma";
import { WorkOrderStatus } from "@prisma/client";
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

function getWorkOrderStatus(value: string | null): WorkOrderStatus {
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

function getDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  return new Date(value);
}

async function generateWorkOrderNo() {
  const year = new Date().getFullYear();

  const totalWorkOrders = await prisma.workOrder.count();

  const nextNumber = String(totalWorkOrders + 1).padStart(3, "0");

  return `WO-${year}-${nextNumber}`;
}

export async function createWorkOrder(formData: FormData) {
  const clientId = getString(formData, "clientId");
  const equipmentId = getString(formData, "equipmentId");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const scheduledDate = getDate(getString(formData, "scheduledDate"));
  const status = getWorkOrderStatus(getString(formData, "status"));

  if (!clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!equipmentId) {
    throw new Error("Equipment wajib dipilih.");
  }

  if (!title) {
    throw new Error("Judul work order wajib diisi.");
  }

  const workOrderNo = await generateWorkOrderNo();

  await prisma.workOrder.create({
    data: {
      workOrderNo,
      clientId,
      equipmentId,
      title,
      description,
      scheduledDate,
      status,
    },
  });

  revalidatePath("/work-orders");
  redirect("/work-orders");
}

export async function updateWorkOrder(workOrderId: string, formData: FormData) {
  const clientId = getString(formData, "clientId");
  const equipmentId = getString(formData, "equipmentId");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const scheduledDate = getDate(getString(formData, "scheduledDate"));
  const status = getWorkOrderStatus(getString(formData, "status"));

  if (!clientId) {
    throw new Error("Client wajib dipilih.");
  }

  if (!equipmentId) {
    throw new Error("Equipment wajib dipilih.");
  }

  if (!title) {
    throw new Error("Judul work order wajib diisi.");
  }

  await prisma.workOrder.update({
    where: {
      id: workOrderId,
    },
    data: {
      clientId,
      equipmentId,
      title,
      description,
      scheduledDate,
      status,
    },
  });

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  redirect("/work-orders");
}

export async function deleteWorkOrder(workOrderId: string) {
  await prisma.workOrder.delete({
    where: {
      id: workOrderId,
    },
  });

  revalidatePath("/work-orders");
  redirect("/work-orders");
}
