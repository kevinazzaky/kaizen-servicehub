import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ServiceRequestStatus } from "@prisma/client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import {
  convertRequestToWorkOrder,
  updateServiceRequestStatus,
} from "../actions";

const statusStyles: Record<ServiceRequestStatus, string> = {
  OPEN: "bg-amber-50 text-amber-700 ring-amber-200",
  REVIEWED: "bg-blue-50 text-blue-700 ring-blue-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CLOSED: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export default async function ServiceRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const request = await prisma.serviceRequest.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      equipment: true,
    },
  });

  if (!request) {
    notFound();
  }

  const [equipment, technicians] = await Promise.all([
    prisma.equipment.findMany({
      where: {
        clientId: request.clientId,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const markReviewed = updateServiceRequestStatus.bind(
    null,
    request.id,
    ServiceRequestStatus.REVIEWED,
  );
  const closeRequest = updateServiceRequestStatus.bind(
    null,
    request.id,
    ServiceRequestStatus.CLOSED,
  );
  const convertRequest = convertRequestToWorkOrder.bind(null, request.id);

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <Link
          href="/service-requests"
          className="text-sm font-medium text-zinc-500"
        >
          Back to requests
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-4">
          <InfoCard label="Client" value={request.client.name} />
          <InfoCard label="Equipment" value={request.equipment?.name ?? "-"} />
          <InfoCard label="Priority" value={request.priority} />
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Status</p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusStyles[request.status]}`}
            >
              {request.status}
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">{request.title}</h1>
          <p className="mt-2 text-sm text-zinc-600">{request.description}</p>
          {request.location ? (
            <p className="mt-4 text-sm text-zinc-500">
              Location: {request.location}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <form action={markReviewed}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Mark Reviewed
              </button>
            </form>
            <form action={closeRequest}>
              <button
                type="submit"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Close Request
              </button>
            </form>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Convert to Work Order</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Buat work order dari request ini agar masuk ke alur teknisi dan
            monitoring client.
          </p>

          <form action={convertRequest} className="mt-6 grid gap-5">
            <TextField name="title" label="Work Order Title" defaultValue={request.title} />

            <label className="grid gap-2 text-sm font-medium">
              Description
              <textarea
                name="description"
                rows={3}
                defaultValue={request.description}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Equipment
              <select
                name="equipmentId"
                required
                defaultValue={request.equipmentId ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="">Pilih equipment</option>
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.code}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Technician
                <select
                  name="technicianId"
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                >
                  <option value="">Belum ditugaskan</option>
                  {technicians.map((technician) => (
                    <option key={technician.id} value={technician.id}>
                      {technician.name}
                    </option>
                  ))}
                </select>
              </label>
              <TextField name="scheduledDate" label="Scheduled Date" type="date" />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Create Work Order
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
