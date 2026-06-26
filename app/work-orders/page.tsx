import Link from "next/link";
import { connection } from "next/server";
import { WorkOrderStatus } from "@prisma/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
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

  const pendingCount = workOrders.filter(
    (workOrder) => workOrder.status === WorkOrderStatus.PENDING,
  ).length;
  const inProgressCount = workOrders.filter(
    (workOrder) => workOrder.status === WorkOrderStatus.IN_PROGRESS,
  ).length;
  const completedCount = workOrders.filter(
    (workOrder) => workOrder.status === WorkOrderStatus.COMPLETED,
  ).length;

  const metrics = [
    {
      label: "Total Work Orders",
      value: workOrders.length,
      description: "Seluruh pekerjaan maintenance",
      icon: "workOrders",
    },
    {
      label: "Pending",
      value: pendingCount,
      description: "Menunggu jadwal atau assignment",
      icon: "requests",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      description: "Sedang dikerjakan teknisi",
      icon: "jobs",
    },
    {
      label: "Completed",
      value: completedCount,
      description: "Pekerjaan selesai dan terdokumentasi",
      icon: "clientAccess",
    },
  ] satisfies Array<{
    label: string;
    value: number;
    description: string;
    icon: LayoutIconName;
  }>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b47a12]">
                Service
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-950">
                Work Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Kelola jadwal, assignment teknisi, progress pekerjaan, dan
                laporan maintenance dalam satu alur.
              </p>
            </div>

            <Link
              href="/work-orders/create"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1220]"
            >
              <LayoutIcon name="workOrders" className="h-4 w-4" />
              Add Work Order
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
                    {metric.value}
                  </p>
                </div>
                <span className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-[#b47a12]">
                  <LayoutIcon name={metric.icon} className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {metric.description}
              </p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Work Order Queue
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pantau status, teknisi, jadwal, dan ketersediaan report.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {workOrders.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
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
              <tbody className="divide-y divide-slate-100">
                {workOrders.map((workOrder) => (
                  <tr key={workOrder.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {workOrder.workOrderNo}
                      </p>
                      <p className="mt-1 text-slate-500">{workOrder.title}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {workOrder.client.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{workOrder.equipment.name}</p>
                      <p className="text-xs text-slate-400">
                        {workOrder.equipment.code}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {workOrder.technician?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(workOrder.scheduledDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[workOrder.status]}`}
                      >
                        {statusLabels[workOrder.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {workOrder.report ? "Available" : "-"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/work-orders/${workOrder.id}`}
                        className="inline-flex rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#b47a12] hover:text-[#b47a12]"
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
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada work order.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
