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
}> = [
  {
    role: "ADMIN",
    title: "Admin",
    description: "Kelola client, equipment, work order, dan laporan.",
  },
  {
    role: "TECHNICIAN",
    title: "Teknisi",
    description: "Lihat pekerjaan, update status, dan isi report.",
  },
  {
    role: "CLIENT",
    title: "Client",
    description: "Pantau progress maintenance dan hasil pekerjaan.",
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
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section>
          <Link href="/" className="text-sm font-medium text-zinc-500">
            Back to home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
            Kaizen ServiceHub
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Pilih portal sesuai peran pengguna.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-zinc-600">
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

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {needsFirstAdmin ? (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-zinc-500">
                  Initial Setup
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Create First Admin
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Belum ada user. Buat akun admin pertama untuk mengaktifkan
                  login.
                </p>
              </div>
              <FirstAdminForm />
            </>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {portalOptions.map((option) => {
                  const active = option.role === selectedRole;

                  return (
                    <Link
                      key={option.role}
                      href={`/login?role=${option.role}`}
                      className={`rounded-lg border p-4 ${
                        active
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-zinc-50 text-zinc-950"
                      }`}
                    >
                      <p className="font-semibold">{option.title}</p>
                      <p
                        className={`mt-2 text-xs leading-5 ${
                          active ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-6">
                <p className="text-sm font-medium text-zinc-500">
                  Login Portal
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {getRoleTitle(selectedRole)}
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Masuk menggunakan akun dengan role {selectedRole}.
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
    return "Admin Portal";
  }

  if (role === "TECHNICIAN") {
    return "Technician Portal";
  }

  return "Client Portal";
}
