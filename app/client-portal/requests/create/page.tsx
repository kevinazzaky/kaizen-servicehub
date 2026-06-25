import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createServiceRequest } from "../actions";

export default async function CreateClientRequestPage() {
  const user = await requireUser();

  const equipment = await prisma.equipment.findMany({
    where:
      user.role === "CLIENT"
        ? {
            clientId: user.clientId ?? "__missing_client__",
          }
        : undefined,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <PortalLayout
      role="CLIENT"
      title="Client Portal"
      subtitle="New Service Request"
    >
      <div className="max-w-3xl">
        <Link
          href="/client-portal/requests"
          className="text-sm font-medium text-zinc-500"
        >
          Back to requests
        </Link>

        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">New Request</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Laporkan problem equipment agar tim service dapat menindaklanjuti.
          </p>

          <form action={createServiceRequest} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Equipment
              <select
                name="equipmentId"
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="">Tidak spesifik / belum dipilih</option>
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.code}
                  </option>
                ))}
              </select>
            </label>

            <TextField name="title" label="Problem Title" required />

            <label className="grid gap-2 text-sm font-medium">
              Description
              <textarea
                name="description"
                required
                rows={4}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField name="location" label="Location" />
              <label className="grid gap-2 text-sm font-medium">
                Priority
                <select
                  name="priority"
                  defaultValue="NORMAL"
                  className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/client-portal/requests"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}

function TextField({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
