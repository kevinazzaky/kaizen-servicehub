import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveMaintenanceReport } from "../actions";

type ReportPageProps = {
  params: Promise<{
    workOrderId: string;
  }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { workOrderId } = await params;

  const workOrder = await prisma.workOrder.findUnique({
    where: {
      id: workOrderId,
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

  const saveReportWithId = saveMaintenanceReport.bind(null, workOrder.id);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/work-orders/${workOrder.id}`}
          className="text-sm text-cyan-400"
        >
          ← Back to Work Order
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Maintenance Report
          </p>

          <h1 className="mt-2 text-2xl font-bold">{workOrder.workOrderNo}</h1>

          <p className="mt-2 text-slate-400">
            Isi laporan hasil pekerjaan maintenance untuk equipment berikut.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Client</p>
              <p className="mt-1 font-semibold">{workOrder.client.name}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Equipment</p>
              <p className="mt-1 font-semibold">{workOrder.equipment.name}</p>
              <p className="text-xs text-slate-500">
                {workOrder.equipment.code}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-1 font-semibold text-cyan-400">
                {workOrder.status}
              </p>
            </div>
          </div>

          <form action={saveReportWithId} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Kondisi Sebelum Maintenance
              </label>
              <textarea
                name="conditionBefore"
                rows={4}
                defaultValue={workOrder.report?.conditionBefore ?? ""}
                placeholder="Contoh: Freezer mengalami penumpukan bunga es dan suhu kurang stabil."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Tindakan yang Dilakukan
              </label>
              <textarea
                name="actionTaken"
                rows={4}
                defaultValue={workOrder.report?.actionTaken ?? ""}
                placeholder="Contoh: Membersihkan evaporator, pengecekan thermostat, dan pengecekan seal pintu."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Kondisi Setelah Maintenance
              </label>
              <textarea
                name="conditionAfter"
                rows={4}
                defaultValue={workOrder.report?.conditionAfter ?? ""}
                placeholder="Contoh: Freezer kembali berfungsi normal dengan suhu stabil."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Rekomendasi
              </label>
              <textarea
                name="recommendation"
                rows={3}
                defaultValue={workOrder.report?.recommendation ?? ""}
                placeholder="Contoh: Perlu pengecekan ulang dalam 1 bulan."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Catatan Teknisi
              </label>
              <textarea
                name="technicianNote"
                rows={3}
                defaultValue={workOrder.report?.technicianNote ?? ""}
                placeholder="Catatan tambahan dari teknisi."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              Setelah report disimpan, status work order otomatis berubah
              menjadi COMPLETED.
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href={`/work-orders/${workOrder.id}`}
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Save Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
