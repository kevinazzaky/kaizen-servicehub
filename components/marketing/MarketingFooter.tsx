import Link from "next/link";
import { companyProfile, type MarketingCopy } from "@/lib/marketing-data";

export function MarketingFooter({ copy }: { copy: MarketingCopy }) {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-slate-600 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm sm:flex-row sm:items-center">
        <p>
          © 2026 {companyProfile.name}. {companyProfile.productName}.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login?role=CLIENT" className="hover:text-slate-950">
            {copy.footer.client}
          </Link>
          <Link href="/login?role=TECHNICIAN" className="hover:text-slate-950">
            {copy.footer.technician}
          </Link>
          <Link href="/login?role=ADMIN" className="hover:text-slate-950">
            {copy.footer.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
