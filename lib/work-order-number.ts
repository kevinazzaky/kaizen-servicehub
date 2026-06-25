import { prisma } from "@/lib/prisma";

export async function generateWorkOrderNo() {
  const year = new Date().getFullYear();
  const totalWorkOrders = await prisma.workOrder.count();
  const nextNumber = String(totalWorkOrders + 1).padStart(3, "0");

  return `WO-${year}-${nextNumber}`;
}
