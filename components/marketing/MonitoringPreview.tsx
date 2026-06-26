import Image from "next/image";
import { MarketingIcon } from "./MarketingIcon";
import type { MarketingIconName } from "./MarketingIcon";

export function MonitoringPreview({
  items,
}: {
  items: ReadonlyArray<{
    label: string;
    value: string;
    icon: MarketingIconName;
  }>;
}) {
  return (
    <>
      <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/25 backdrop-blur sm:hidden">
        <div className="flex items-center gap-4">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-black ring-1 ring-white/10">
            <Image
              src="/images/hero/logo-kaizen.png"
              alt="Kaizen logo"
              width={58}
              height={58}
              className="object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">
              ServiceHub Monitoring
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Live overview for requests, jobs, reports, and assets.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f5b43b] text-slate-950">
                <MarketingIcon name={item.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-xs text-slate-300">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative hidden min-h-[430px] animate-fade-up sm:block lg:min-h-[500px]">
        <div className="absolute left-1/2 top-1/2 grid size-64 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur">
          <div className="animate-soft-glow grid size-36 place-items-center rounded-[2rem] bg-black shadow-xl shadow-black/30 ring-1 ring-white/10">
            <Image
              src="/images/hero/logo-kaizen.png"
              alt="Kaizen logo"
              width={88}
              height={88}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/10" />

        {items.map((item, index) => (
          <div
            key={item.label}
            className={`animate-float-soft absolute w-40 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white/[0.1] ${
              index === 0
                ? "left-0 top-8"
                : index === 1
                  ? "right-0 top-16"
                  : index === 2
                    ? "bottom-16 left-4"
                    : "bottom-8 right-4"
            }`}
            style={{ animationDelay: `${index * 220}ms` }}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-2xl bg-[#f5b43b] text-slate-950">
                <MarketingIcon name={item.icon} className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-slate-300">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
