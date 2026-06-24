import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/clients" className="text-sm text-cyan-400">
          ← Back to Clients
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Equipment</p>
            <p className="mt-2 text-3xl font-bold">{client.equipment.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Work Orders</p>
            <p className="mt-2 text-3xl font-bold">
              {client.workOrders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-xl font-bold text-emerald-400">
              {client.status}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Edit Client</h1>
          <p className="mt-2 text-slate-400">
            Perbarui data client dan informasi kontak.
          </p>

          <form action={updateClientWithId} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Client Name
              </label>
              <input
                name="name"
                required
                defaultValue={client.name}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                defaultValue={client.address ?? ""}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  PIC Name
                </label>
                <input
                  name="picName"
                  defaultValue={client.picName ?? ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone
                </label>
                <input
                  name="phone"
                  defaultValue={client.phone ?? ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={client.email ?? ""}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>
              <select
                name="status"
                defaultValue={client.status}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/clients"
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Update Client
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          <p className="mt-2 text-sm text-slate-400">
            Hapus client hanya jika data ini belum memiliki equipment atau work
            order.
          </p>

          <form action={deleteClientWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
            >
              Delete Client
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
