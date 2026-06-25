import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { WorkOrderStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { ReportPhotos } from "@/components/reports/ReportPhotos";
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

export default async function ClientPortalWorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const user = await requireUser();

  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      equipment: true,
      report: true,
    },
  });

  if (!workOrder) {
    notFound();
  }

  if (user.role === "CLIENT" && workOrder.clientId !== user.clientId) {
    notFound();
  }

  return (
    <PortalLayout
      role="CLIENT"
      title="Client Portal"
      subtitle="Work Order Detail"
    >
      <div className="flex max-w-4xl flex-col gap-6">
        <div>
          <Link
            href="/client-portal"
            className="text-sm font-medium text-zinc-500"
          >
            Back to client portal
          </Link>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                {workOrder.workOrderNo}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {workOrder.title}
              </h1>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusStyles[workOrder.status]}`}
            >
              {statusLabels[workOrder.status]}
            </span>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Client</p>
            <p className="mt-2 font-semibold">{workOrder.client.name}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Equipment</p>
            <p className="mt-2 font-semibold">{workOrder.equipment.name}</p>
            <p className="text-xs text-zinc-500">{workOrder.equipment.code}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Schedule</p>
            <p className="mt-2 font-semibold">
              {formatDate(workOrder.scheduledDate)}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Work Order Progress</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => {
              const active =
                status === workOrder.status ||
                (status === "PENDING" &&
                  ["IN_PROGRESS", "COMPLETED"].includes(workOrder.status)) ||
                (status === "IN_PROGRESS" && workOrder.status === "COMPLETED");

              return (
                <div
                  key={status}
                  className={`rounded-md border px-4 py-3 text-sm font-medium ${
                    active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500"
                  }`}
                >
                  {statusLabels[status as WorkOrderStatus]}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Maintenance Report</h2>

          {workOrder.report ? (
            <div className="mt-5 grid gap-4 text-sm">
              <ReportItem
                label="Kondisi Sebelum"
                value={workOrder.report.conditionBefore}
              />
              <ReportItem label="Tindakan" value={workOrder.report.actionTaken} />
              <ReportItem
                label="Kondisi Setelah"
                value={workOrder.report.conditionAfter}
              />
              <ReportItem
                label="Rekomendasi"
                value={workOrder.report.recommendation}
              />
              <ReportItem
                label="Catatan Teknisi"
                value={workOrder.report.technicianNote}
              />
              <ReportPhotos
                beforePhotoUrl={workOrder.report.beforePhotoUrl}
                afterPhotoUrl={workOrder.report.afterPhotoUrl}
              />
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
              Report belum tersedia.
            </div>
          )}
        </section>
      </div>
    </PortalLayout>
  );
}

function ReportItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <p className="font-medium text-zinc-700">{label}</p>
      <p className="mt-2 text-zinc-600">{value ?? "-"}</p>
    </div>
  );
}
