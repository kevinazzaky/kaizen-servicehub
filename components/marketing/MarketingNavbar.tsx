import Image from "next/image";
import Link from "next/link";
import { companyProfile, marketingNav } from "@/lib/marketing-data";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f17]/88 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-black ring-1 ring-white/10">
            <Image
              src="/images/hero/logo-kaizen.png"
              alt="Kaizen logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              {companyProfile.name}
            </p>
            <p className="text-[11px] text-slate-300">ServiceHub</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 md:flex">
          {marketingNav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login?role=CLIENT"
          className="rounded-md bg-[#f5b43b] px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-[#ffc65a]"
        >
          Portal
        </Link>
      </div>
    </header>
  );
}
