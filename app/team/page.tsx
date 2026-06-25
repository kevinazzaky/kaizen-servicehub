import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { prisma } from "@/lib/prisma";

const roleStyles = {
  ADMIN: "bg-zinc-950 text-white ring-zinc-950",
  TECHNICIAN: "bg-blue-50 text-blue-700 ring-blue-200",
  CLIENT: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default async function TeamPage() {
  await connection();

  const users = await prisma.user.findMany({
    include: {
      client: true,
      assignedWorkOrders: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-500">Access Control</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Team</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Buat akun admin, teknisi, dan client untuk mengakses portal sesuai
              role masing-masing.
            </p>
          </div>

          <Link
            href="/team/create"
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            Add User
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Assigned Jobs</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-zinc-950">{user.name}</p>
                      <p className="mt-1 text-zinc-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${roleStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {user.client?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {user.assignedWorkOrders.length}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/team/${user.id}`}
                        className="font-medium text-zinc-950 hover:underline"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Belum ada user.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
