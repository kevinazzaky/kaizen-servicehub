import Link from "next/link";
import type { ReactNode } from "react";
import type { Role } from "@prisma/client";
import { logout } from "@/app/login/actions";
import { requireRole } from "@/lib/auth";

const portalNav: Record<Role, Array<{ href: string; label: string; marker: string }>> = {
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
    <div className="min-h-screen bg-zinc-50 text-zinc-950 lg:flex">
      <aside className="border-b border-zinc-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-zinc-950 text-sm font-semibold text-white">
              K
            </span>
            <div>
              <p className="font-semibold text-zinc-950">Kaizen</p>
              <p className="text-xs text-zinc-500">ServiceHub</p>
            </div>
          </Link>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              >
                <span className="grid size-7 place-items-center rounded-md border border-zinc-200 text-xs">
                  {item.marker}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-500">{subtitle}</p>
              <p className="text-lg font-semibold text-zinc-950">{title}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-zinc-950">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.role}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
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
