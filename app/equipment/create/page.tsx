import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { createEquipment } from "../actions";

export default async function CreateEquipmentPage() {
  await connection();

  const clients = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/equipment" className="text-sm font-medium text-zinc-500">
          Back to equipment
        </Link>

        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Add Equipment</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Masukkan data alat milik client yang akan dikelola.
          </p>

          {clients.length === 0 ? (
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Belum ada client. Buat client terlebih dahulu sebelum menambahkan
              equipment.
            </div>
          ) : (
            <form action={createEquipment} className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Client
                <select
                  name="clientId"
                  required
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                >
                  <option value="">Pilih client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField name="name" label="Equipment Name" required />
                <TextField name="code" label="Equipment Code" required />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField name="category" label="Category" />
                <TextField name="brand" label="Brand" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <TextField name="location" label="Location" />
                <label className="grid gap-2 text-sm font-medium">
                  Status
                  <select
                    name="status"
                    defaultValue="ACTIVE"
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
                  Save Equipment
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
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
