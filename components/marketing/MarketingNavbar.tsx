import Image from "next/image";
import Link from "next/link";
import { companyProfile, type MarketingCopy } from "@/lib/marketing-data";

export function MarketingNavbar({ copy }: { copy: MarketingCopy }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f17]/88 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-black ring-1 ring-white/10">
            <Image
              src="/images/hero/logo-kaizen.png"
              alt="Kaizen logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-white">
                {companyProfile.name}
              </p>
              <span className="rounded-full border border-[#f5b43b]/30 bg-[#f5b43b]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f5b43b]">
                ServiceHub
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Maintenance Management System
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          {copy.nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-full border border-white/15 bg-white/5 p-1 sm:flex">
            <Link
              href="/?lang=id"
              className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
                copy.langLabel === "ID"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              ID
            </Link>
            <Link
              href="/?lang=en"
              className={`rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
                copy.langLabel === "EN"
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              EN
            </Link>
          </div>

          <Link
            href="/login?role=CLIENT"
            className="rounded-full bg-[#f5b43b] px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-[#ffc65a]"
          >
            Client Access
          </Link>
        </div>
      </div>
    </header>
  );
}
