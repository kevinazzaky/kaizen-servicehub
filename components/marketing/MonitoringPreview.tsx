import Image from "next/image";
import { MarketingIcon } from "./MarketingIcon";

const progressItems = [
  { label: "Request", value: "Client", icon: "request" },
  { label: "Work Order", value: "Admin", icon: "workflow" },
  { label: "Progress", value: "Teknisi", icon: "technician" },
  { label: "Report", value: "Client", icon: "report" },
] as const;

export function MonitoringPreview() {
  return (
    <div className="relative min-h-[430px] animate-fade-up lg:min-h-[500px]">
      <div className="absolute left-1/2 top-1/2 grid size-56 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur sm:size-64">
        <div className="animate-soft-glow grid size-32 place-items-center rounded-3xl bg-black shadow-xl shadow-black/30 ring-1 ring-white/10 sm:size-36">
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

      {progressItems.map((item, index) => (
        <div
          key={item.label}
          className={`animate-float-soft absolute w-40 rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-lg shadow-black/20 backdrop-blur transition hover:bg-white/[0.1] ${
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
            <span className="grid size-9 place-items-center rounded-xl bg-[#f5b43b] text-slate-950">
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
  );
}
