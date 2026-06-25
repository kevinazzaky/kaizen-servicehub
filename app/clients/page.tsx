import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
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

  const totalEquipment = clients.reduce(
    (total, client) => total + client.equipment.length,
    0,
  );
  const totalWorkOrders = clients.reduce(
    (total, client) => total + client.workOrders.length,
    0,
  );
  const activeClients = clients.filter((client) => client.status === "ACTIVE").length;

  const metrics = [
    {
      label: "Total Clients",
      value: clients.length,
      description: "Perusahaan yang sudah terdaftar",
      icon: "clients",
    },
    {
      label: "Active Clients",
      value: activeClients,
      description: "Client yang masih aktif dilayani",
      icon: "clientAccess",
    },
    {
      label: "Equipment",
      value: totalEquipment,
      description: "Unit equipment milik client",
      icon: "equipment",
    },
    {
      label: "Work Orders",
      value: totalWorkOrders,
      description: "Riwayat pekerjaan dari client",
      icon: "workOrders",
    },
  ] satisfies Array<{
    label: string;
    value: number;
    description: string;
    icon: LayoutIconName;
  }>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b47a12]">
                Customers
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Clients
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Kelola data perusahaan, PIC, kontak, dan hubungan client dengan
                equipment serta pekerjaan maintenance.
              </p>
            </div>

            <Link
              href="/clients/create"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1220]"
            >
              <LayoutIcon name="clients" className="h-4 w-4" />
              Add Client
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {metric.value}
                  </p>
                </div>
                <span className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-[#b47a12]">
                  <LayoutIcon name={metric.icon} className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {metric.description}
              </p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Client Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Data client terbaru diurutkan dari yang paling baru dibuat.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {clients.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
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
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {client.name}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {client.email ?? "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {client.picName ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {client.phone ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {client.equipment.length}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
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
                        className="inline-flex rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#b47a12] hover:text-[#b47a12]"
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
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada data client.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
