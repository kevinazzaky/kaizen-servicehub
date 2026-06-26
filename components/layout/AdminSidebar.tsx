import Link from "next/link";
import { LayoutIcon, type LayoutIconName } from "./LayoutIcon";

const navItems: Array<{
  href: string;
  label: string;
  icon: LayoutIconName;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/clients", label: "Clients", icon: "clients" },
  { href: "/equipment", label: "Equipment", icon: "equipment" },
  { href: "/work-orders", label: "Work Orders", icon: "workOrders" },
  { href: "/service-requests", label: "Requests", icon: "requests" },
  { href: "/team", label: "Team", icon: "team" },
  { href: "/client-portal", label: "Client Access", icon: "clientAccess" },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#111827] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-5 px-4 py-4 sm:gap-6 sm:py-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
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

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-fit shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
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
  );
}
