import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { deleteEquipment, updateEquipment } from "../actions";

type EquipmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  await connection();

  const { id } = await params;

  const equipment = await prisma.equipment.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      workOrders: true,
    },
  });

  if (!equipment) {
    notFound();
  }

  const clients = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const updateEquipmentWithId = updateEquipment.bind(null, equipment.id);
  const deleteEquipmentWithId = deleteEquipment.bind(null, equipment.id);

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Link href="/equipment" className="text-sm font-medium text-zinc-500">
          Back to equipment
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard label="Client" value={equipment.client.name} />
          <InfoCard
            label="Work Orders"
            value={String(equipment.workOrders.length)}
          />
          <InfoCard label="Status" value={equipment.status} />
        </section>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Edit Equipment</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Perbarui data equipment dan status maintenance.
          </p>

          <form action={updateEquipmentWithId} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Client
              <select
                name="clientId"
                required
                defaultValue={equipment.clientId}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                name="name"
                label="Equipment Name"
                defaultValue={equipment.name}
                required
              />
              <TextField
                name="code"
                label="Equipment Code"
                defaultValue={equipment.code}
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                name="category"
                label="Category"
                defaultValue={equipment.category ?? ""}
              />
              <TextField
                name="brand"
                label="Brand"
                defaultValue={equipment.brand ?? ""}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                name="location"
                label="Location"
                defaultValue={equipment.location ?? ""}
              />
              <label className="grid gap-2 text-sm font-medium">
                Status
                <select
                  name="status"
                  defaultValue={equipment.status}
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NEED_MAINTENANCE">NEED_MAINTENANCE</option>
                  <option value="BROKEN">BROKEN</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium">
              Description
              <textarea
                name="description"
                rows={3}
                defaultValue={equipment.description ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="flex justify-end gap-3">
              <Link
                href="/equipment"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Update Equipment
              </button>
            </div>
          </form>
        </div>

        <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-sm text-red-700">
            Hapus equipment hanya jika belum memiliki work order.
          </p>
          <form action={deleteEquipmentWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Delete Equipment
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
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
