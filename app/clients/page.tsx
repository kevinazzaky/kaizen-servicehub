import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  await connection();

  const clients = await prisma.client.findMany({
    include: {
      equipment: true,
      workOrders: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-500">Customers</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Clients
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Kelola data client yang menggunakan jasa maintenance.
            </p>
          </div>

          <Link
            href="/clients/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add Client
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">PIC</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Work Orders</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-950">
                        {client.name}
                      </p>
                      <p className="mt-1 text-zinc-500">
                        {client.email ?? "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {client.picName ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {client.phone ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {client.equipment.length}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {client.workOrders.length}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        {client.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-zinc-950 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {clients.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada data client.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
