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
    <aside className="border-b border-zinc-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-6 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
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
  );
}
