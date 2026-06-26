import Link from "next/link";
import { connection } from "next/server";
import { WorkOrderStatus } from "@prisma/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
import {
  getDashboardOverview,
  type DashboardOverview,
} from "@/modules/dashboard/service";

const statusLabels: Record<WorkOrderStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusStyles: Record<WorkOrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 ring-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export default async function DashboardPage() {
  await connection();

  const fallbackDashboard: DashboardOverview = {
    totalClients: 0,
    totalEquipment: 0,
    totalWorkOrders: 0,
    pendingWorkOrders: 0,
    inProgressWorkOrders: 0,
    completedWorkOrders: 0,
    cancelledWorkOrders: 0,
    equipmentNeedMaintenance: 0,
    recentWorkOrders: [],
  };

  let databaseError = false;
  let dashboard: DashboardOverview = fallbackDashboard;

  try {
    dashboard = await getDashboardOverview();
  } catch (error) {
    databaseError = true;
    console.error("Failed to load dashboard overview", error);
  }

  const {
    totalClients,
    totalEquipment,
    totalWorkOrders,
    pendingWorkOrders,
    inProgressWorkOrders,
    completedWorkOrders,
    cancelledWorkOrders,
    equipmentNeedMaintenance,
    recentWorkOrders,
  } = dashboard;

  const summaryCards = [
    {
      label: "Clients",
      value: totalClients,
      href: "/clients",
      description: "Active customer records",
      icon: "clients",
    },
    {
      label: "Equipment",
      value: totalEquipment,
      href: "/equipment",
      description: "Assets under service",
      icon: "equipment",
    },
    {
      label: "Work Orders",
      value: totalWorkOrders,
      href: "/work-orders",
      description: "All service jobs",
      icon: "workOrders",
    },
    {
      label: "Need Maintenance",
      value: equipmentNeedMaintenance,
      href: "/equipment",
      description: "Equipment requires attention",
      icon: "equipment",
    },
  ] satisfies Array<{
    label: string;
    value: number;
    href: string;
    description: string;
    icon: LayoutIconName;
  }>;

  const workOrderStats = [
    {
      label: "Pending",
      value: pendingWorkOrders,
      tone: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    {
      label: "In Progress",
      value: inProgressWorkOrders,
      tone: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      label: "Completed",
      value: completedWorkOrders,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    {
      label: "Cancelled",
      value: cancelledWorkOrders,
      tone: "bg-slate-100 text-slate-600 ring-slate-200",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b47a12]">
                Operations Overview
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-950">
                Admin Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Monitor client records, equipment condition, and current work
                order progress from one workspace.
              </p>
            </div>

            <Link
              href="/work-orders/create"
              className="w-fit rounded-md bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              New Work Order
            </Link>
          </div>
        </section>

        {databaseError ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Dashboard belum bisa mengambil data dari database. Cek koneksi
            internet atau status database Neon, lalu refresh halaman.
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-slate-200 border-l-[#f5b43b] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#f5b43b]/70 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
                    {card.value}
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-[#f5b43b] transition group-hover:bg-[#f5b43b] group-hover:text-slate-950">
                  <LayoutIcon name={card.icon} className="size-5" />
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {card.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Work Order Status
                </h2>
              </div>
              <Link
                href="/work-orders"
                className="text-sm font-semibold text-slate-500 hover:text-slate-950"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {workOrderStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <span className={`size-2 rounded-full ring-4 ${stat.tone}`} />
                    {stat.label}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950 ring-1 ring-slate-200">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="p-5 pb-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Latest Activity
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Recent Work Orders
                </h2>
              </div>
              <Link
                href="/work-orders"
                className="mr-5 mt-5 text-sm font-semibold text-slate-500 hover:text-slate-950"
              >
                Open list
              </Link>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-y border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-3 pl-5 pr-4 font-semibold">WO Number</th>
                    <th className="py-3 pr-4 font-semibold">Client</th>
                    <th className="py-3 pr-4 font-semibold">Equipment</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentWorkOrders.map((workOrder) => (
                    <tr key={workOrder.id} className="hover:bg-slate-50/70">
                      <td className="py-3 pl-5 pr-4 font-medium text-slate-950">
                        {workOrder.workOrderNo}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {workOrder.client.name}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {workOrder.equipment.name}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[workOrder.status]}`}
                        >
                          {statusLabels[workOrder.status]}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/work-orders/${workOrder.id}`}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#f5b43b]/70 hover:bg-amber-50 hover:text-slate-950"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {recentWorkOrders.length === 0 ? (
                <div className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
                  No work orders yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
