import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
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

  const activeEquipment = equipment.filter((item) => item.status === "ACTIVE").length;
  const needMaintenance = equipment.filter(
    (item) => item.status === "NEED_MAINTENANCE",
  ).length;
  const brokenEquipment = equipment.filter((item) => item.status === "BROKEN").length;

  const metrics = [
    {
      label: "Total Equipment",
      value: equipment.length,
      description: "Seluruh asset yang terdaftar",
      icon: "equipment",
    },
    {
      label: "Active",
      value: activeEquipment,
      description: "Unit dengan kondisi siap pakai",
      icon: "clientAccess",
    },
    {
      label: "Need Maintenance",
      value: needMaintenance,
      description: "Unit yang perlu pengecekan",
      icon: "requests",
    },
    {
      label: "Broken",
      value: brokenEquipment,
      description: "Unit dengan status bermasalah",
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
                Assets
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Equipment
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Pantau equipment setiap client, lokasi unit, kode asset, dan
                status maintenance terbaru.
              </p>
            </div>

            <Link
              href="/equipment/create"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1220]"
            >
              <LayoutIcon name="equipment" className="h-4 w-4" />
              Add Equipment
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
                Equipment Register
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Daftar unit terbaru dengan relasi client dan lokasi.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {equipment.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipment.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-slate-500">{item.code}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.client.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
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

          {equipment.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada data equipment.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
