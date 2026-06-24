import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function WorkOrdersPage() {
  const workOrders = await prisma.workOrder.findMany({
    include: {
      client: true,
      equipment: true,
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
            <h1 className="mt-2 text-3xl font-bold">Work Orders</h1>
            <p className="mt-2 text-slate-400">
              Kelola jadwal dan progress pekerjaan maintenance.
            </p>
          </div>

          <Link
            href="/work-orders/create"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Add Work Order
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-800 text-sm text-slate-300">
              <tr>
                <th className="p-4">Work Order</th>
                <th className="p-4">Client</th>
                <th className="p-4">Equipment</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {workOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada work order.
                  </td>
                </tr>
              ) : (
                workOrders.map((workOrder) => (
                  <tr
                    key={workOrder.id}
                    className="border-t border-slate-800 text-sm"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {workOrder.workOrderNo}
                      </div>
                      <div className="text-slate-400">{workOrder.title}</div>
                    </td>

                    <td className="p-4 text-slate-300">
                      {workOrder.client.name}
                    </td>

                    <td className="p-4 text-slate-300">
                      <div>{workOrder.equipment.name}</div>
                      <div className="text-xs text-slate-500">
                        {workOrder.equipment.code}
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      {formatDate(workOrder.scheduledDate)}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                        {workOrder.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <Link
                        href={`/work-orders/${workOrder.id}`}
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

        <div className="mt-6 flex gap-3">
          <Link href="/clients" className="text-sm text-cyan-400">
            Clients
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/equipment" className="text-sm text-cyan-400">
            Equipment
          </Link>
        </div>
      </div>
    </main>
  );
}
