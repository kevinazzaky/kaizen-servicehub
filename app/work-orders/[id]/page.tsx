import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { deleteWorkOrder, updateWorkOrder } from "../actions";

type WorkOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function toDateInputValue(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default async function WorkOrderDetailPage({
  params,
}: WorkOrderDetailPageProps) {
  await connection();

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

  const [clients, equipment, technicians] = await Promise.all([
    prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.equipment.findMany({
      include: {
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const updateWorkOrderWithId = updateWorkOrder.bind(null, workOrder.id);
  const deleteWorkOrderWithId = deleteWorkOrder.bind(null, workOrder.id);

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <Link href="/work-orders" className="text-sm font-medium text-zinc-500">
          Back to work orders
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard label="Work Order No" value={workOrder.workOrderNo} />
          <InfoCard label="Client" value={workOrder.client.name} />
          <InfoCard label="Status" value={workOrder.status} />
        </section>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Edit Work Order</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Perbarui jadwal, assignment, dan progress pekerjaan maintenance.
          </p>

          <form action={updateWorkOrderWithId} className="mt-6 grid gap-5">
            <SelectField
              name="clientId"
              label="Client"
              defaultValue={workOrder.clientId}
              required
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              name="equipmentId"
              label="Equipment"
              defaultValue={workOrder.equipmentId}
              required
            >
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.code} ({item.client.name})
                </option>
              ))}
            </SelectField>

            <TextField
              name="title"
              label="Work Order Title"
              defaultValue={workOrder.title}
              required
            />

            <SelectField
              name="technicianId"
              label="Technician"
              defaultValue={workOrder.technicianId ?? ""}
            >
              <option value="">Belum ditugaskan</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name}
                </option>
              ))}
            </SelectField>

            <label className="grid gap-2 text-sm font-medium">
              Description
              <textarea
                name="description"
                rows={3}
                defaultValue={workOrder.description ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                name="scheduledDate"
                label="Scheduled Date"
                type="date"
                defaultValue={toDateInputValue(workOrder.scheduledDate)}
              />
              <SelectField
                name="status"
                label="Status"
                defaultValue={workOrder.status}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </SelectField>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/work-orders"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Update Work Order
              </button>
            </div>
          </form>
        </div>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h2 className="text-lg font-semibold">Maintenance Report</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Laporan hasil pekerjaan teknisi untuk work order ini.
              </p>
            </div>

            <Link
              href={`/reports/${workOrder.id}`}
              className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
            >
              {workOrder.report ? "Edit Report" : "Create Report"}
            </Link>
          </div>

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
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
              Belum ada report untuk work order ini.
            </div>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-sm text-red-700">
            Hapus work order hanya jika data ini belum memiliki report.
          </p>
          <form action={deleteWorkOrderWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Delete Work Order
            </button>
          </form>
        </section>
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

function TextField({
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  children,
  required = false,
  defaultValue,
}: {
  name: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      >
        {children}
      </select>
    </label>
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
