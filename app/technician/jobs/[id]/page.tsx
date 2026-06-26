import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { WorkOrderStatus } from "@prisma/client";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { ReportPhotoInputs, ReportPhotos } from "@/components/reports/ReportPhotos";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveTechnicianReport, updateJobStatus } from "../actions";

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

export default async function TechnicianJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const user = await requireRole(["ADMIN", "TECHNICIAN"]);
  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      equipment: true,
      technician: true,
      report: true,
    },
  });

  if (!workOrder) {
    notFound();
  }

  if (
    user.role === "TECHNICIAN" &&
    workOrder.technicianId &&
    workOrder.technicianId !== user.id
  ) {
    notFound();
  }

  const startJob = updateJobStatus.bind(
    null,
    workOrder.id,
    WorkOrderStatus.IN_PROGRESS,
  );

  const cancelJob = updateJobStatus.bind(
    null,
    workOrder.id,
    WorkOrderStatus.CANCELLED,
  );

  const saveReport = saveTechnicianReport.bind(null, workOrder.id);

  return (
    <PortalLayout
      role="TECHNICIAN"
      title="Technician Job"
      subtitle="Work Order Detail"
    >
      <div className="flex max-w-5xl flex-col gap-6">
        <div>
          <Link
            href="/technician/jobs"
            className="text-sm font-medium text-zinc-500"
          >
            Back to jobs
          </Link>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                {workOrder.workOrderNo}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
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

        <section className="grid gap-4 md:grid-cols-4">
          <InfoCard label="Client" value={workOrder.client.name} />
          <InfoCard label="Equipment" value={workOrder.equipment.name} />
          <InfoCard label="Code" value={workOrder.equipment.code} />
          <InfoCard label="Schedule" value={formatDate(workOrder.scheduledDate)} />
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">Technician Action</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Mulai pekerjaan, batalkan jika tidak bisa dikerjakan, atau isi
                report setelah maintenance selesai.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={startJob}>
                <button
                  type="submit"
                  className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                >
                  Start Job
                </button>
              </form>
              <a
                href="#technician-report"
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white"
              >
                {workOrder.report ? "Edit Report" : "Fill Report"}
              </a>
              <form action={cancelJob}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  Cancel Job
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Work Scope</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {workOrder.description ?? "Belum ada deskripsi pekerjaan."}
          </p>
        </section>

        <section
          id="technician-report"
          className="rounded-lg border border-zinc-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold">Maintenance Report</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Isi laporan langsung dari halaman pekerjaan teknisi. Setelah
            disimpan, status work order menjadi completed.
          </p>

          <form action={saveReport} className="mt-5 grid gap-5">
            <ReportTextarea
              name="conditionBefore"
              label="Kondisi Sebelum"
              defaultValue={workOrder.report?.conditionBefore ?? ""}
              placeholder="Kondisi equipment sebelum maintenance"
            />
            <ReportTextarea
              name="actionTaken"
              label="Tindakan"
              defaultValue={workOrder.report?.actionTaken ?? ""}
              placeholder="Tindakan maintenance yang dilakukan"
            />
            <ReportTextarea
              name="conditionAfter"
              label="Kondisi Setelah"
              defaultValue={workOrder.report?.conditionAfter ?? ""}
              placeholder="Kondisi equipment setelah maintenance"
            />
            <ReportTextarea
              name="recommendation"
              label="Rekomendasi"
              defaultValue={workOrder.report?.recommendation ?? ""}
              placeholder="Rekomendasi follow-up"
            />
            <ReportTextarea
              name="technicianNote"
              label="Catatan Teknisi"
              defaultValue={workOrder.report?.technicianNote ?? ""}
              placeholder="Catatan internal teknisi"
            />

            <div>
              <h3 className="text-sm font-semibold">Foto Bukti Pekerjaan</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Tambahkan foto before dan after equipment agar report memiliki
                bukti visual.
              </p>
              <div className="mt-3">
                <ReportPhotoInputs
                  beforePhotoUrl={workOrder.report?.beforePhotoUrl}
                  afterPhotoUrl={workOrder.report?.afterPhotoUrl}
                />
              </div>
            </div>

            <ReportPhotos
              beforePhotoUrl={workOrder.report?.beforePhotoUrl}
              afterPhotoUrl={workOrder.report?.afterPhotoUrl}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Save Report
              </button>
            </div>
          </form>
        </section>
      </div>
    </PortalLayout>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function ReportTextarea({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
