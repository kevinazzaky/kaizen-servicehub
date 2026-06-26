import Link from "next/link";
import { connection } from "next/server";
import { ServiceRequestStatus } from "@prisma/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
import { prisma } from "@/lib/prisma";

const statusStyles: Record<ServiceRequestStatus, string> = {
  OPEN: "bg-amber-50 text-amber-700 ring-amber-200",
  REVIEWED: "bg-blue-50 text-blue-700 ring-blue-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ServiceRequestsPage() {
  await connection();

  const requests = await prisma.serviceRequest.findMany({
    include: {
      client: true,
      equipment: true,
    },
    orderBy: {
      createdAt: "desc",
      },
  });

  const openCount = requests.filter(
    (request) => request.status === ServiceRequestStatus.OPEN,
  ).length;
  const reviewedCount = requests.filter(
    (request) => request.status === ServiceRequestStatus.REVIEWED,
  ).length;
  const convertedCount = requests.filter(
    (request) => request.status === ServiceRequestStatus.CONVERTED,
  ).length;

  const metrics = [
    {
      label: "Total Requests",
      value: requests.length,
      description: "Semua problem yang dikirim client",
      icon: "requests",
    },
    {
      label: "Open",
      value: openCount,
      description: "Request baru yang perlu direview",
      icon: "clientAccess",
    },
    {
      label: "Reviewed",
      value: reviewedCount,
      description: "Sudah dicek oleh admin",
      icon: "team",
    },
    {
      label: "Converted",
      value: convertedCount,
      description: "Sudah menjadi work order",
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
                Client Problem
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-950">
                Service Requests
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Review kendala dari client, prioritaskan kebutuhan lapangan,
                lalu convert menjadi work order jika perlu ditindaklanjuti.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-[#8a5a0a]">
              <LayoutIcon name="requests" className="h-4 w-4" />
              Client submitted issues
            </div>
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
                  <p className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">
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
                Request Inbox
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Urutan request terbaru dari client portal.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {requests.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Request</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {request.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-slate-500">
                        {request.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {request.client.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {request.equipment?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {request.priority}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/service-requests/${request.id}`}
                        className="inline-flex rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#b47a12] hover:text-[#b47a12]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada service request.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
