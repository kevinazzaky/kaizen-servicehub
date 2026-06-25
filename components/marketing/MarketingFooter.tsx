import Link from "next/link";
import { companyProfile } from "@/lib/marketing-data";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
        <p>
          © 2026 {companyProfile.name}. {companyProfile.productName}.
        </p>
        <div className="flex gap-4">
          <Link href="/login?role=CLIENT" className="hover:text-slate-950">
            Client
          </Link>
          <Link href="/login?role=TECHNICIAN" className="hover:text-slate-950">
            Teknisi
          </Link>
          <Link href="/login?role=ADMIN" className="hover:text-slate-950">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
