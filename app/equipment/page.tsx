import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EquipmentPage() {
  const equipment = await prisma.equipment.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
              Kaizen ServiceHub
            </p>
            <h1 className="mt-2 text-3xl font-bold">Equipment</h1>
            <p className="mt-2 text-slate-400">
              Kelola data equipment milik setiap client.
            </p>
          </div>

          <Link
            href="/equipment/create"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Add Equipment
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-800 text-sm text-slate-300">
              <tr>
                <th className="p-4">Equipment</th>
                <th className="p-4">Client</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data equipment.
                  </td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800 text-sm"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {item.name}
                      </div>
                      <div className="text-slate-400">{item.code}</div>
                    </td>

                    <td className="p-4 text-slate-300">{item.client.name}</td>

                    <td className="p-4 text-slate-300">
                      {item.location ?? "-"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/equipment/${item.id}`}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
