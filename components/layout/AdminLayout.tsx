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
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
