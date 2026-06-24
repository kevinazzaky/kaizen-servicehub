import Link from "next/link";
import { connection } from "next/server";
import { EquipmentStatus, WorkOrderStatus } from "@prisma/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<WorkOrderStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusStyles: Record<WorkOrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export default async function DashboardPage() {
  await connection();

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

  const summaryCards = [
    { label: "Total Clients", value: totalClients, href: "/clients" },
    { label: "Total Equipment", value: totalEquipment, href: "/equipment" },
    {
      label: "Total Work Orders",
      value: totalWorkOrders,
      href: "/work-orders",
    },
    {
      label: "Need Maintenance",
      value: equipmentNeedMaintenance,
      href: "/equipment",
    },
  ];

  const workOrderStats = [
    { label: "Pending", value: pendingWorkOrders },
    { label: "In Progress", value: inProgressWorkOrders },
    { label: "Completed", value: completedWorkOrders },
    { label: "Cancelled", value: cancelledWorkOrders },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              System Overview
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          <Link
            href="/work-orders/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            New Work Order
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-lg border border-zinc-200 bg-white p-5 hover:border-zinc-300"
            >
              <p className="text-sm font-medium text-zinc-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Work Order Status</h2>
              <Link
                href="/work-orders"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {workOrderStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3"
                >
                  <span className="text-sm font-medium text-zinc-600">
                    {stat.label}
                  </span>
                  <span className="text-lg font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Recent Work Orders</h2>
              <Link
                href="/work-orders"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
              >
                Open list
              </Link>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="py-3 pr-4 font-semibold">WO Number</th>
                    <th className="py-3 pr-4 font-semibold">Client</th>
                    <th className="py-3 pr-4 font-semibold">Equipment</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentWorkOrders.map((workOrder) => (
                    <tr key={workOrder.id}>
                      <td className="py-3 pr-4 font-medium text-zinc-950">
                        {workOrder.workOrderNo}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">
                        {workOrder.client.name}
                      </td>
                      <td className="py-3 pr-4 text-zinc-600">
                        {workOrder.equipment.name}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[workOrder.status]}`}
                        >
                          {statusLabels[workOrder.status]}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/work-orders/${workOrder.id}`}
                          className="font-medium text-zinc-950 hover:underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentWorkOrders.length === 0 ? (
                <div className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
                  No work orders yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
