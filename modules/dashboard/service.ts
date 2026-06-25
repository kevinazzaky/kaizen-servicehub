import { EquipmentStatus, WorkOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getDashboardOverview() {
  const [
    totalClients,
    totalEquipment,
    totalWorkOrders,
    pendingWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    cancelledWorkOrders,
    equipmentNeedMaintenance,
    recentWorkOrders,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.equipment.count(),
    prisma.workOrder.count(),
    prisma.workOrder.count({ where: { status: WorkOrderStatus.PENDING } }),
    prisma.workOrder.count({ where: { status: WorkOrderStatus.IN_PROGRESS } }),
    prisma.workOrder.count({ where: { status: WorkOrderStatus.COMPLETED } }),
    prisma.workOrder.count({ where: { status: WorkOrderStatus.CANCELLED } }),
    prisma.equipment.count({
      where: { status: EquipmentStatus.NEED_MAINTENANCE },
    }),
    prisma.workOrder.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        equipment: true,
      },
    }),
  ]);

  return {
    totalClients,
    totalEquipment,
    totalWorkOrders,
    pendingWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    cancelledWorkOrders,
    equipmentNeedMaintenance,
    recentWorkOrders,
  };
}

export type DashboardOverview = Awaited<ReturnType<typeof getDashboardOverview>>;
