import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export async function AdminTopbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
            Maintenance Management
          </p>
          <p className="text-lg font-semibold text-slate-950">
            Operations Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-950">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-xs text-slate-500">{user?.role ?? "ADMIN"}</p>
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
  );
}
