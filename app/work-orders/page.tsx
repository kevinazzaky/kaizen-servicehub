import Link from "next/link";
import { connection } from "next/server";
import { WorkOrderStatus } from "@prisma/client";
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

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function WorkOrdersPage() {
  await connection();

  const workOrders = await prisma.workOrder.findMany({
    include: {
      client: true,
      equipment: true,
      technician: true,
      report: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-500">Service</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Work Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Kelola jadwal, assignment teknisi, dan progress pekerjaan
              maintenance.
            </p>
          </div>

          <Link
            href="/work-orders/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add Work Order
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Work Order</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Technician</th>
                  <th className="px-5 py-3 font-semibold">Schedule</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Report</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {workOrders.map((workOrder) => (
                  <tr key={workOrder.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-950">
                        {workOrder.workOrderNo}
                      </p>
                      <p className="mt-1 text-zinc-500">{workOrder.title}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {workOrder.client.name}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      <p>{workOrder.equipment.name}</p>
                      <p className="text-xs text-zinc-400">
                        {workOrder.equipment.code}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {workOrder.technician?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {formatDate(workOrder.scheduledDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[workOrder.status]}`}
                      >
                        {statusLabels[workOrder.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {workOrder.report ? "Available" : "-"}
                    </td>
                    <td className="px-5 py-4">
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
          </div>

          {workOrders.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada work order.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
