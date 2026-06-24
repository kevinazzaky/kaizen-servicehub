export function AdminTopbar() {
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

        <div className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600">
          Admin
        </div>
      </div>
    </header>
  );
}
