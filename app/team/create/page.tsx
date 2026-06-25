import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { createTeamUser } from "../actions";

export default async function CreateTeamUserPage() {
  await connection();

  const clients = await prisma.client.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <Link href="/team" className="text-sm font-medium text-zinc-500">
          Back to team
        </Link>

        <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Add Team User</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Buat akun untuk admin, teknisi, atau client portal.
          </p>

          <form action={createTeamUser} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <input
                name="name"
                required
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                placeholder="Nama user"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                placeholder="user@kaizen.local"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                placeholder="Minimum 8 karakter"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Role
              <select
                name="role"
                defaultValue="TECHNICIAN"
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="TECHNICIAN">TECHNICIAN</option>
                <option value="CLIENT">CLIENT</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Client
              <select
                name="clientId"
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="">Kosongkan untuk ADMIN / TECHNICIAN</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-zinc-500">
                Wajib diisi hanya untuk role CLIENT.
              </span>
            </label>

            <div className="flex justify-end gap-3">
              <Link
                href="/team"
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
              >
                Save User
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
