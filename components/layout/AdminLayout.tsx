import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole(["ADMIN"]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:flex">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
