import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard", marker: "D" },
  { href: "/clients", label: "Clients", marker: "C" },
  { href: "/equipment", label: "Equipment", marker: "E" },
  { href: "/work-orders", label: "Work Orders", marker: "W" },
  { href: "/service-requests", label: "Requests", marker: "R" },
  { href: "/team", label: "Team", marker: "T" },
  { href: "/client-portal", label: "Client Portal", marker: "P" },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#111827] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
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
  );
}
