import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export async function AdminTopbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Maintenance Management
          </p>
          <p className="text-lg font-semibold text-zinc-950">
            Operations Console
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-950">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-xs text-zinc-500">{user?.role ?? "ADMIN"}</p>
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
  );
}
