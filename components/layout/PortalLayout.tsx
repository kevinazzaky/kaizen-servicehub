import Link from "next/link";
import type { ReactNode } from "react";
import type { Role } from "@prisma/client";
import { logout } from "@/app/login/actions";
import { requireRole } from "@/lib/auth";
import { LayoutIcon, type LayoutIconName } from "./LayoutIcon";

const portalNav: Record<
  Role,
  Array<{ href: string; label: string; icon: LayoutIconName }>
> = {
  ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/work-orders", label: "Work Orders", icon: "workOrders" },
  ],
  TECHNICIAN: [
    { href: "/technician/jobs", label: "My Jobs", icon: "jobs" },
  ],
  CLIENT: [
    { href: "/client-portal", label: "Work Orders", icon: "workOrders" },
    { href: "/client-portal/requests", label: "Requests", icon: "requests" },
  ],
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

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
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">
                  Kaizen Utama Teknik
                </p>
                <span className="rounded-full border border-[#f5b43b]/30 bg-[#f5b43b]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f5b43b]">
                  Hub
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">ServiceHub</p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <span className="grid size-7 place-items-center rounded-md border border-white/10 bg-white/5 text-[#f5b43b]">
                  <LayoutIcon name={item.icon} className="size-4" />
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b47a12]">
                {subtitle}
              </p>
              <p className="text-lg font-semibold text-slate-950">{title}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-4 shadow-sm sm:flex">
                <span className="grid size-9 place-items-center rounded-full bg-[#111827] text-sm font-semibold text-[#f5b43b] ring-1 ring-slate-900/10">
                  {getInitial(user.name)}
                </span>
                <div className="text-left">
                  <p className="max-w-36 truncate text-sm font-semibold text-slate-950">
                    {user.name}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#f5b43b]/70 hover:bg-amber-50 hover:text-slate-950"
                >
                  <LayoutIcon name="logout" className="size-4" />
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
