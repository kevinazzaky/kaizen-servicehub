import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { deleteClient, updateClient } from "../actions";

type ClientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  await connection();

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      equipment: true,
      workOrders: true,
    },
  });

  if (!client) {
    notFound();
  }

  const updateClientWithId = updateClient.bind(null, client.id);
  const deleteClientWithId = deleteClient.bind(null, client.id);

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Link href="/clients" className="text-sm font-medium text-zinc-500">
          Back to clients
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard label="Equipment" value={String(client.equipment.length)} />
          <InfoCard label="Work Orders" value={String(client.workOrders.length)} />
          <InfoCard label="Status" value={client.status} />
        </section>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Edit Client</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Perbarui data client dan informasi kontak.
          </p>

          <form action={updateClientWithId} className="mt-6 grid gap-5">
            <TextField
              name="name"
              label="Client Name"
              defaultValue={client.name}
              required
            />
            <label className="grid gap-2 text-sm font-medium">
              Address
              <textarea
                name="address"
                rows={3}
                defaultValue={client.address ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                name="picName"
                label="PIC Name"
                defaultValue={client.picName ?? ""}
              />
              <TextField
                name="phone"
                label="Phone"
                defaultValue={client.phone ?? ""}
              />
            </div>

            <TextField
              name="email"
              label="Email"
              type="email"
              defaultValue={client.email ?? ""}
            />

            <label className="grid gap-2 text-sm font-medium">
              Status
              <select
                name="status"
                defaultValue={client.status}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>

            <div className="flex justify-end gap-3">
              <Link
                href="/clients"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Update Client
              </button>
            </div>
          </form>
        </div>

        <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-sm text-red-700">
            Hapus client hanya jika data ini belum memiliki equipment atau work
            order.
          </p>
          <form action={deleteClientWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Delete Client
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
