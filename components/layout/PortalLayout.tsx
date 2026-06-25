import Link from "next/link";
import type { ReactNode } from "react";
import type { Role } from "@prisma/client";
import { logout } from "@/app/login/actions";
import { requireRole } from "@/lib/auth";

const portalNav: Record<
  Role,
  Array<{ href: string; label: string; marker: string }>
> = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", marker: "D" },
    { href: "/work-orders", label: "Work Orders", marker: "W" },
  ],
  TECHNICIAN: [
    { href: "/technician/jobs", label: "My Jobs", marker: "J" },
  ],
  CLIENT: [
    { href: "/client-portal", label: "Work Orders", marker: "W" },
    { href: "/client-portal/requests", label: "Requests", marker: "R" },
  ],
};

export async function PortalLayout({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const user = await requireRole([role, "ADMIN"]);
  const navItems = portalNav[role];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <aside className="border-b border-white/10 bg-[#111827] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-black text-sm font-semibold text-[#f5b43b] shadow-sm ring-1 ring-white/10">
              K
            </span>
            <div>
              <p className="font-semibold text-white">Kaizen</p>
              <p className="text-xs text-slate-400">ServiceHub</p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <span className="grid size-7 place-items-center rounded-md border border-white/10 bg-white/5 text-xs text-[#f5b43b]">
                  {item.marker}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">{subtitle}</p>
              <p className="text-lg font-semibold text-slate-950">{title}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-950">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#f5b43b]/70 hover:bg-amber-50 hover:text-slate-950"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
