import Link from "next/link";
import { connection } from "next/server";
import { WorkOrderStatus } from "@prisma/client";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
import { requireRole } from "@/lib/auth";
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

export default async function TechnicianJobsPage() {
  await connection();
  const user = await requireRole(["ADMIN", "TECHNICIAN"]);

  const workOrders = await prisma.workOrder.findMany({
    where:
      user.role === "TECHNICIAN"
        ? {
            OR: [{ technicianId: user.id }, { technicianId: null }],
          }
        : undefined,
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

  const openJobs = workOrders.filter((job) => job.status !== "COMPLETED");
  const completedJobs = workOrders.filter((job) => job.status === "COMPLETED");
  const inProgressJobs = workOrders.filter(
    (job) => job.status === "IN_PROGRESS",
  );
  const reportReadyJobs = workOrders.filter((job) => job.report).length;
  const metrics = [
    {
      label: "Open Jobs",
      value: String(openJobs.length),
      description: "Ready or active work",
      icon: "jobs",
    },
    {
      label: "In Progress",
      value: String(inProgressJobs.length),
      description: "Currently handled",
      icon: "workOrders",
    },
    {
      label: "Completed",
      value: String(completedJobs.length),
      description: "Finished work orders",
      icon: "clientAccess",
    },
    {
      label: "Reports",
      value: String(reportReadyJobs),
      description: "Submitted reports",
      icon: "requests",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    description: string;
    icon: LayoutIconName;
  }>;

  return (
    <PortalLayout
      role="TECHNICIAN"
      title="Technician Jobs"
      subtitle="Field Service"
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b47a12]">
                Field Service
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Daftar Pekerjaan Teknisi
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Lihat assignment, mulai pekerjaan, dan lengkapi report
                maintenance dengan bukti foto.
              </p>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              {user.name}
            </div>
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
                Job Queue
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Work Order Assignments
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Work Order</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Schedule</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Assignment</th>
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
                    <td className="px-5 py-4 text-zinc-600">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          workOrder.technician
                            ? "bg-slate-100 text-slate-600 ring-slate-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {workOrder.technician?.name ?? "Available"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/technician/jobs/${workOrder.id}`}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#f5b43b]/70 hover:bg-amber-50 hover:text-slate-950"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {workOrders.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada pekerjaan untuk teknisi.
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
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-[#f5b43b] transition group-hover:bg-[#f5b43b] group-hover:text-slate-950">
          <LayoutIcon name={icon} className="size-5" />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
