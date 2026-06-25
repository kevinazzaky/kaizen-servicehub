import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";

const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  NEED_MAINTENANCE: "bg-amber-50 text-amber-700 ring-amber-200",
  BROKEN: "bg-red-50 text-red-700 ring-red-200",
  INACTIVE: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export default async function EquipmentPage() {
  await connection();

  const equipment = await prisma.equipment.findMany({
    include: {
      client: true,
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
            <p className="text-sm font-medium text-zinc-500">Assets</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Equipment
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Kelola data equipment milik setiap client.
            </p>
          </div>

          <Link
            href="/equipment/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add Equipment
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-950">{item.name}</p>
                      <p className="mt-1 text-zinc-500">{item.code}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {item.client.name}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {item.location ?? "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/equipment/${item.id}`}
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

          {equipment.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada data equipment.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
