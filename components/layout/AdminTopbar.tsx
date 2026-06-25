import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/login/actions";
import { LayoutIcon } from "./LayoutIcon";

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || "A";
}

export async function AdminTopbar() {
  const user = await getCurrentUser();
  const displayName = user?.name ?? "Admin";
  const displayRole = user?.role ?? "ADMIN";

  return (
    <header className="border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b47a12]">
            Maintenance Management
          </p>
          <p className="text-lg font-semibold text-slate-950">
            Operations Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-4 shadow-sm sm:flex">
            <span className="grid size-9 place-items-center rounded-full bg-[#111827] text-sm font-semibold text-[#f5b43b] ring-1 ring-slate-900/10">
              {getInitial(displayName)}
            </span>
            <div className="text-left">
              <p className="max-w-36 truncate text-sm font-semibold text-slate-950">
                {displayName}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {displayRole}
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
  );
}
