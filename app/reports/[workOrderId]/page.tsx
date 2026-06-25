import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ReportPhotoInputs, ReportPhotos } from "@/components/reports/ReportPhotos";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMaintenanceReport } from "../actions";

type ReportPageProps = {
  params: Promise<{
    workOrderId: string;
  }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  await connection();

  const user = await requireRole(["ADMIN", "TECHNICIAN"]);
  const { workOrderId } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id: workOrderId,
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

  if (
    user.role === "TECHNICIAN" &&
    workOrder.technicianId &&
    workOrder.technicianId !== user.id
  ) {
    notFound();
  }

  const saveReportWithId = saveMaintenanceReport.bind(null, workOrder.id);

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Link
          href={`/work-orders/${workOrder.id}`}
          className="text-sm font-medium text-zinc-500"
        >
          Back to work order
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard label="Work Order" value={workOrder.workOrderNo} />
          <InfoCard label="Client" value={workOrder.client.name} />
          <InfoCard label="Equipment" value={workOrder.equipment.name} />
        </section>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Maintenance Report</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Isi laporan hasil pekerjaan maintenance untuk equipment berikut.
          </p>

          <form action={saveReportWithId} className="mt-6 grid gap-5">
            <ReportTextarea
              name="conditionBefore"
              label="Kondisi Sebelum Maintenance"
              defaultValue={workOrder.report?.conditionBefore ?? ""}
            />
            <ReportTextarea
              name="actionTaken"
              label="Tindakan yang Dilakukan"
              defaultValue={workOrder.report?.actionTaken ?? ""}
            />
            <ReportTextarea
              name="conditionAfter"
              label="Kondisi Setelah Maintenance"
              defaultValue={workOrder.report?.conditionAfter ?? ""}
            />
            <ReportTextarea
              name="recommendation"
              label="Rekomendasi"
              defaultValue={workOrder.report?.recommendation ?? ""}
            />
            <ReportTextarea
              name="technicianNote"
              label="Catatan Teknisi"
              defaultValue={workOrder.report?.technicianNote ?? ""}
            />

            <div>
              <h2 className="text-sm font-semibold">Foto Bukti Pekerjaan</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Upload foto sebelum dan sesudah maintenance sebagai bukti
                pekerjaan.
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

            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Setelah report disimpan, status work order otomatis berubah
              menjadi COMPLETED.
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href={`/work-orders/${workOrder.id}`}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Save Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
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
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
