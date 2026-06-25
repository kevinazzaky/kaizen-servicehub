import Link from "next/link";
import { connection } from "next/server";
import { ServiceRequestStatus } from "@prisma/client";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { requireUser } from "@/lib/auth";
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

export default async function ClientRequestsPage() {
  await connection();
  const user = await requireUser();

  const requests = await prisma.serviceRequest.findMany({
    where:
      user.role === "CLIENT"
        ? {
            clientId: user.clientId ?? "__missing_client__",
          }
        : undefined,
    include: {
      client: true,
      equipment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PortalLayout
      role="CLIENT"
      title="Client Workspace"
      subtitle="Service Requests"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Problem Reporting
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Requests
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Kirim problem maintenance agar tim dapat review dan membuat work
              order.
            </p>
          </div>

          <Link
            href="/client-portal/requests/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            New Request
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Request</th>
                  <th className="px-5 py-3 font-semibold">Equipment</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-950">
                        {request.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-zinc-500">
                        {request.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {request.equipment?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {request.priority}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {formatDate(request.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {requests.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada request.
            </div>
          ) : null}
        </section>
      </div>
    </PortalLayout>
  );
}
