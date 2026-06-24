import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createEquipment } from "../actions";

export default async function CreateEquipmentPage() {
  const clients = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/equipment" className="text-sm text-cyan-400">
          ← Back to Equipment
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Add New Equipment</h1>
          <p className="mt-2 text-slate-400">
            Masukkan data alat milik client yang akan dikelola.
          </p>

          {clients.length === 0 ? (
            <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">
              Belum ada client. Buat client terlebih dahulu sebelum menambahkan
              equipment.
            </div>
          ) : (
            <form action={createEquipment} className="mt-6 space-y-5">
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
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Equipment Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Contoh: Freezer Box"
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
                    placeholder="Contoh: AK-FZX/044"
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
                    placeholder="Contoh: Freezer / Chiller"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Brand
                  </label>
                  <input
                    name="brand"
                    placeholder="Brand equipment"
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
                    placeholder="Contoh: Main Kitchen"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue="ACTIVE"
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
                  placeholder="Catatan kondisi atau informasi tambahan"
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
                  Save Equipment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
