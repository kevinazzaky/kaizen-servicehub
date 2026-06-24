import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createWorkOrder } from "../actions";

export default async function CreateWorkOrderPage() {
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

  const canCreate = clients.length > 0 && equipment.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/work-orders" className="text-sm text-cyan-400">
          ← Back to Work Orders
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Add New Work Order</h1>
          <p className="mt-2 text-slate-400">
            Buat tugas maintenance untuk equipment milik client.
          </p>

          {!canCreate ? (
            <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">
              Kamu perlu membuat client dan equipment terlebih dahulu sebelum
              membuat work order.
            </div>
          ) : (
            <form action={createWorkOrder} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Client
                </label>
                <select
                  name="clientId"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">Pilih client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Untuk versi awal, pilihan equipment belum otomatis terfilter
                  berdasarkan client.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Equipment
                </label>
                <select
                  name="equipmentId"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">Pilih equipment</option>
                  {equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.code} ({item.client.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Work Order Title
                </label>
                <input
                  name="title"
                  required
                  placeholder="Contoh: Preventive Maintenance Freezer Box"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Catatan pekerjaan maintenance"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Scheduled Date
                  </label>
                  <input
                    name="scheduledDate"
                    type="date"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue="PENDING"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Link
                  href="/work-orders"
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Save Work Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
