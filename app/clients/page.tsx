import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
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
            <h1 className="mt-2 text-3xl font-bold">Clients</h1>
            <p className="mt-2 text-slate-400">
              Kelola data client yang menggunakan jasa maintenance.
            </p>
          </div>

          <Link
            href="/clients/create"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Add Client
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-800 text-sm text-slate-300">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">PIC</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada data client.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t border-slate-800 text-sm"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {client.name}
                      </div>
                      <div className="text-slate-400">
                        {client.email ?? "-"}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      {client.picName ?? "-"}
                    </td>

                    <td className="p-4 text-slate-300">
                      {client.phone ?? "-"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        {client.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/clients/${client.id}`}
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
