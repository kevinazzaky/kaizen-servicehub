import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteWorkOrder, updateWorkOrder } from "../actions";

type WorkOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function toDateInputValue(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default async function WorkOrderDetailPage({
  params,
}: WorkOrderDetailPageProps) {
  const { id } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      equipment: true,
      report: true,
    },
  });

  if (!workOrder) {
    notFound();
  }

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

  const updateWorkOrderWithId = updateWorkOrder.bind(null, workOrder.id);
  const deleteWorkOrderWithId = deleteWorkOrder.bind(null, workOrder.id);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/work-orders" className="text-sm text-cyan-400">
          ← Back to Work Orders
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Work Order No</p>
            <p className="mt-2 text-xl font-bold">{workOrder.workOrderNo}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Client</p>
            <p className="mt-2 text-xl font-bold">{workOrder.client.name}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-xl font-bold text-cyan-400">
              {workOrder.status}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Edit Work Order</h1>
          <p className="mt-2 text-slate-400">
            Perbarui jadwal dan progress pekerjaan maintenance.
          </p>

          <form action={updateWorkOrderWithId} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Client
              </label>
              <select
                name="clientId"
                required
                defaultValue={workOrder.clientId}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Equipment
              </label>
              <select
                name="equipmentId"
                required
                defaultValue={workOrder.equipmentId}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
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
                defaultValue={workOrder.title}
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
                defaultValue={workOrder.description ?? ""}
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
                  defaultValue={toDateInputValue(workOrder.scheduledDate)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={workOrder.status}
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
                Update Work Order
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Maintenance Report</h2>
              <p className="mt-2 text-sm text-slate-400">
                Laporan hasil pekerjaan teknisi untuk work order ini.
              </p>
            </div>

            <Link
              href={`/reports/${workOrder.id}`}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              {workOrder.report ? "Edit Report" : "Create Report"}
            </Link>
          </div>

          {workOrder.report ? (
            <div className="mt-5 space-y-4 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-300">Kondisi Sebelum</p>
                <p className="mt-2 text-slate-400">
                  {workOrder.report.conditionBefore ?? "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-300">Tindakan</p>
                <p className="mt-2 text-slate-400">
                  {workOrder.report.actionTaken ?? "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-300">Kondisi Setelah</p>
                <p className="mt-2 text-slate-400">
                  {workOrder.report.conditionAfter ?? "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-300">Rekomendasi</p>
                <p className="mt-2 text-slate-400">
                  {workOrder.report.recommendation ?? "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-slate-300">Catatan Teknisi</p>
                <p className="mt-2 text-slate-400">
                  {workOrder.report.technicianNote ?? "-"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              Belum ada report untuk work order ini.
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          <p className="mt-2 text-sm text-slate-400">
            Hapus work order hanya jika data ini belum memiliki report.
          </p>

          <form action={deleteWorkOrderWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400"
            >
              Delete Work Order
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
