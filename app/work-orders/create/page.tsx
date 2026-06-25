import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { createWorkOrder } from "../actions";

export default async function CreateWorkOrderPage() {
  await connection();

  const clients = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const equipment = await prisma.equipment.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const technicians = await prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
    },
    orderBy: {
      name: "asc",
    },
  });

  const canCreate = clients.length > 0 && equipment.length > 0;

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/work-orders" className="text-sm font-medium text-zinc-500">
          Back to work orders
        </Link>

        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Add Work Order</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Buat tugas maintenance untuk equipment milik client.
          </p>

          {!canCreate ? (
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Kamu perlu membuat client dan equipment terlebih dahulu sebelum
              membuat work order.
            </div>
          ) : (
            <form action={createWorkOrder} className="mt-6 grid gap-5">
              <SelectField name="clientId" label="Client" required>
                <option value="">Pilih client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </SelectField>

              <SelectField name="equipmentId" label="Equipment" required>
                <option value="">Pilih equipment</option>
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.code} ({item.client.name})
                  </option>
                ))}
              </SelectField>

              <TextField name="title" label="Work Order Title" required />

              <SelectField name="technicianId" label="Technician">
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
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField name="scheduledDate" label="Scheduled Date" type="date" />
                <SelectField name="status" label="Status" defaultValue="PENDING">
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
                  Save Work Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
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
