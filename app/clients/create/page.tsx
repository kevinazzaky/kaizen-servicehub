import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { createClient } from "../actions";

export default async function CreateClientPage() {
  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/clients" className="text-sm font-medium text-zinc-500">
          Back to clients
        </Link>

        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Add Client</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Masukkan data client yang akan dikelola dalam sistem maintenance.
          </p>

          <form action={createClient} className="mt-6 grid gap-5">
            <TextField name="name" label="Client Name" required />
            <label className="grid gap-2 text-sm font-medium">
              Address
              <textarea
                name="address"
                rows={3}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <TextField name="picName" label="PIC Name" />
              <TextField name="phone" label="Phone" />
            </div>

            <TextField name="email" label="Email" type="email" />

            <div className="flex justify-end gap-3">
              <Link
                href="/clients"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Save Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
      />
    </label>
  );
}
