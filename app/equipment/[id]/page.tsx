import Link from "next/link";
import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/equipment" className="text-sm text-cyan-400">
          ← Back to Equipment
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Client</p>
            <p className="mt-2 text-xl font-bold">{equipment.client.name}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Work Orders</p>
            <p className="mt-2 text-3xl font-bold">
              {equipment.workOrders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-xl font-bold text-cyan-400">
              {equipment.status}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Edit Equipment</h1>
          <p className="mt-2 text-slate-400">
            Perbarui data equipment dan status maintenance.
          </p>

          <form action={updateEquipmentWithId} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Client
              </label>
              <select
                name="clientId"
                required
                defaultValue={equipment.clientId}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Equipment Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={equipment.name}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Equipment Code
                </label>
                <input
                  name="code"
                  required
                  defaultValue={equipment.code}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={equipment.category ?? ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Brand
                </label>
                <input
                  name="brand"
                  defaultValue={equipment.brand ?? ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location
                </label>
                <input
                  name="location"
                  defaultValue={equipment.location ?? ""}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={equipment.status}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NEED_MAINTENANCE">NEED_MAINTENANCE</option>
                  <option value="BROKEN">BROKEN</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={equipment.description ?? ""}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/equipment"
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Update Equipment
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          <p className="mt-2 text-sm text-slate-400">
            Hapus equipment hanya jika belum memiliki work order.
          </p>

          <form action={deleteEquipmentWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
            >
              Delete Equipment
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
