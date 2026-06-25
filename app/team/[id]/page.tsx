import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";
import { deleteTeamUser, updateTeamUser } from "../actions";

export default async function TeamUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const [user, clients] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        assignedWorkOrders: {
          include: {
            client: true,
            equipment: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),
    prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!user) {
    notFound();
  }

  const updateUserWithId = updateTeamUser.bind(null, user.id);
  const deleteUserWithId = deleteTeamUser.bind(null, user.id);

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Link href="/team" className="text-sm font-medium text-zinc-500">
          Back to team
        </Link>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <InfoCard label="Role" value={user.role} />
          <InfoCard label="Client" value={user.client?.name ?? "-"} />
          <InfoCard
            label="Assigned Jobs"
            value={String(user.assignedWorkOrders.length)}
          />
        </section>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h1 className="text-2xl font-semibold">Edit Team User</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Perbarui data akun dan role akses user.
          </p>

          <form action={updateUserWithId} className="mt-6 grid gap-5">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <input
                name="name"
                required
                defaultValue={user.name}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                defaultValue={user.email}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              New Password
              <input
                name="password"
                type="password"
                minLength={8}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
                placeholder="Kosongkan jika tidak diganti"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Role
              <select
                name="role"
                defaultValue={user.role}
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
                defaultValue={user.clientId ?? ""}
                className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
              >
                <option value="">Kosongkan untuk ADMIN / TECHNICIAN</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
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
                Update User
              </button>
            </div>
          </form>
        </div>

        <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
          <p className="mt-2 text-sm text-red-700">
            Hapus user hanya jika akun ini sudah tidak digunakan.
          </p>
          <form action={deleteUserWithId} className="mt-4">
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Delete User
            </button>
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
