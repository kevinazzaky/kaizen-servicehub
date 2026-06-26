import Link from "next/link";
import { connection } from "next/server";
import { WorkOrderStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { PortalLayout } from "@/components/layout/PortalLayout";
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

export default async function ClientPortalPage() {
  await connection();
  const user = await requireUser();

  const workOrders = await prisma.workOrder.findMany({
    where:
      user.role === "CLIENT"
        ? {
            clientId: user.clientId ?? "__missing_client__",
          }
        : undefined,
    include: {
      client: true,
      equipment: true,
      report: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = workOrders.filter(
    (workOrder) => workOrder.status === "PENDING",
  ).length;
  const inProgressCount = workOrders.filter(
    (workOrder) => workOrder.status === "IN_PROGRESS",
  ).length;
  const availableReports = workOrders.filter((workOrder) => workOrder.report)
    .length;

  const metrics = [
    {
      label: "Total Work Orders",
      value: String(workOrders.length),
      description: "All visible jobs",
      icon: "workOrders",
    },
    {
      label: "Pending",
      value: String(pendingCount),
      description: "Waiting for action",
      icon: "requests",
    },
    {
      label: "In Progress",
      value: String(inProgressCount),
      description: "Currently handled",
      icon: "jobs",
    },
    {
      label: "Reports",
      value: String(availableReports),
      description: "Completed evidence",
      icon: "clientAccess",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    description: string;
    icon: LayoutIconName;
  }>;

  return (
    <PortalLayout
      role="CLIENT"
      title="Client Workspace"
      subtitle="Maintenance Monitoring"
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b47a12]">
                Kaizen ServiceHub
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-950">
                Client Workspace
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor progress pekerjaan maintenance, jadwal equipment, dan
                report yang sudah selesai.
              </p>
            </div>

            <Link
              href={user.role === "CLIENT" ? "/client-portal/requests/create" : "/dashboard"}
              className="w-fit rounded-md bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {user.role === "CLIENT" ? "Create Request" : "Admin Dashboard"}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Work Orders
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Maintenance Progress
              </h2>
            </div>
            <Link
              href="/client-portal/requests"
              className="text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              View requests
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Work Order</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Schedule</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Report</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workOrders.map((workOrder) => (
                  <tr key={workOrder.id} className="hover:bg-slate-50/70">
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
                      {formatDate(workOrder.scheduledDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[workOrder.status]}`}
                      >
                        {statusLabels[workOrder.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          workOrder.report
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-slate-100 text-slate-500 ring-slate-200"
                        }`}
                      >
                        {workOrder.report ? "Available" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/client-portal/work-orders/${workOrder.id}`}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#f5b43b]/70 hover:bg-amber-50 hover:text-slate-950"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {workOrders.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada work order yang bisa ditampilkan.
            </div>
          ) : null}
        </section>
      </div>
    </PortalLayout>
  );
}

function Metric({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: LayoutIconName;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 border-l-[#f5b43b] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#f5b43b]/70 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-[#f5b43b] transition group-hover:bg-[#f5b43b] group-hover:text-slate-950">
          <LayoutIcon name={icon} className="size-5" />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
