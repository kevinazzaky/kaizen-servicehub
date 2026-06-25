import Link from "next/link";
import { connection } from "next/server";
import type { Role } from "@prisma/client";
import { getCurrentUser, getHomePathForRole } from "@/lib/auth";
import { logout } from "@/app/login/actions";
import { getUsersCount } from "@/modules/auth/service";
import { FirstAdminForm, LoginForm } from "./LoginForms";

const portalOptions: Array<{
  role: Role;
  title: string;
  description: string;
  marker: string;
}> = [
  {
    role: "ADMIN",
    title: "Admin",
    description: "Kelola client, equipment, work order, dan laporan.",
    marker: "A",
  },
  {
    role: "TECHNICIAN",
    title: "Teknisi",
    description: "Lihat pekerjaan, update status, dan isi report.",
    marker: "T",
  },
  {
    role: "CLIENT",
    title: "Client",
    description: "Pantau progress maintenance dan hasil pekerjaan.",
    marker: "C",
  },
];

type LoginPageProps = {
  searchParams: Promise<{
    role?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await connection();

  const query = await searchParams;
  const selectedRole = getSelectedRole(query.role);
  const currentUser = await getCurrentUser();
  const usersCount = await getUsersCount();
  const needsFirstAdmin = usersCount === 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_22%_18%,rgba(245,180,59,0.18),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(29,54,102,0.5),transparent_32%),linear-gradient(135deg,#0b0f17_0%,#111827_48%,#17223a_100%)] px-6 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <section>
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 shadow-sm backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            Back to home
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-[#f5b43b]">
            Kaizen ServiceHub
          </p>
          <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Masuk ke portal operasional sesuai peran.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
            Admin, teknisi, dan client memakai sistem yang sama, tapi aksesnya
            dipisahkan supaya alur kerja tetap rapi.
          </p>

          {currentUser ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Kamu sedang login sebagai <strong>{currentUser.name}</strong> (
              {currentUser.role}).
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={getHomePathForRole(currentUser.role)}
                  className="rounded-md bg-emerald-700 px-3 py-2 font-medium text-white"
                >
                  Masuk ke halaman saya
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-md border border-emerald-300 bg-white px-3 py-2 font-medium text-emerald-800"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-white/20 bg-white p-5 text-slate-950 shadow-2xl shadow-black/30 sm:p-6">
          {needsFirstAdmin ? (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-500">
                  Initial Setup
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Create First Admin
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Belum ada user. Buat akun admin pertama untuk mengaktifkan
                  login.
                </p>
              </div>
              <FirstAdminForm />
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-1.5">
                <div className="grid gap-1.5 sm:grid-cols-3">
                {portalOptions.map((option) => {
                  const active = option.role === selectedRole;

                  return (
                    <Link
                      key={option.role}
                      href={`/login?role=${option.role}`}
                      className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-[#111827] text-white shadow-sm"
                          : "text-slate-600 hover:bg-white hover:text-slate-950"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                          active
                            ? "bg-[#f5b43b] text-slate-950"
                            : "bg-white text-slate-500 ring-1 ring-slate-200 group-hover:text-slate-950"
                        }`}
                      >
                        {option.marker}
                      </span>
                      <span className="font-semibold">{option.title}</span>
                    </Link>
                  );
                })}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                  System Access
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  {getRoleTitle(selectedRole)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {getRoleDescription(selectedRole)}
                </p>

                <div className="mt-6">
                  <LoginForm role={selectedRole} />
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function getSelectedRole(role: string | undefined): Role {
  if (role === "ADMIN" || role === "TECHNICIAN" || role === "CLIENT") {
    return role;
  }

  return "CLIENT";
}

function getRoleTitle(role: Role) {
  if (role === "ADMIN") {
    return "Admin Console";
  }

  if (role === "TECHNICIAN") {
    return "Technician Workspace";
  }

  return "Client Workspace";
}

function getRoleDescription(role: Role) {
  if (role === "ADMIN") {
    return "Kelola client, equipment, work order, laporan, request, dan akun pengguna.";
  }

  if (role === "TECHNICIAN") {
    return "Lihat assignment pekerjaan, update status, dan lengkapi report maintenance.";
  }

  return "Pantau progress pekerjaan, request service, dan hasil laporan maintenance.";
}
