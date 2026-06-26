import Link from "next/link";
import { connection } from "next/server";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LayoutIcon, type LayoutIconName } from "@/components/layout/LayoutIcon";
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

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const technicianCount = users.filter(
    (user) => user.role === "TECHNICIAN",
  ).length;
  const clientUserCount = users.filter((user) => user.role === "CLIENT").length;

  const metrics = [
    {
      label: "Total Users",
      value: users.length,
      description: "Akun yang bisa mengakses sistem",
      icon: "team",
    },
    {
      label: "Admin",
      value: adminCount,
      description: "Pengelola operasional sistem",
      icon: "dashboard",
    },
    {
      label: "Technician",
      value: technicianCount,
      description: "Tim lapangan dan pelaksana job",
      icon: "jobs",
    },
    {
      label: "Client",
      value: clientUserCount,
      description: "Akun monitoring untuk pelanggan",
      icon: "clientAccess",
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
                Access Control
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl text-slate-950">
                Team
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Buat dan kelola akun admin, teknisi, serta client agar setiap
                pengguna masuk ke portal sesuai role masing-masing.
              </p>
            </div>

            <Link
              href="/team/create"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1220]"
            >
              <LayoutIcon name="team" className="h-4 w-4" />
              Add User
            </Link>
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
                User Access
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Daftar akun terbaru, role, client terkait, dan assigned jobs.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {users.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Assigned Jobs</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="mt-1 text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${roleStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {user.client?.name ?? "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {user.assignedWorkOrders.length}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/team/${user.id}`}
                        className="inline-flex rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#b47a12] hover:text-[#b47a12]"
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
            <div className="px-5 py-12 text-center text-sm text-slate-500">
              Belum ada user.
            </div>
          ) : null}
        </section>
      </div>
    </AdminLayout>
  );
}
