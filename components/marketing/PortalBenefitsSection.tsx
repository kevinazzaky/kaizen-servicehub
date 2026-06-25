import { portalBenefits } from "@/lib/marketing-data";
import { MarketingIcon, type MarketingIconName } from "./MarketingIcon";

export function PortalBenefitsSection() {
  return (
    <section id="portal" className="bg-[#f8fafc] px-6 py-20 text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Kaizen ServiceHub
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Satu sistem untuk alur maintenance.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            ServiceFlow menyatukan client, admin, dan teknisi agar progress
            pekerjaan tidak tercecer.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {portalBenefits.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#f5b43b]/50 hover:shadow-md"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-[#f5b43b]">
                <MarketingIcon
                  name={item.icon as MarketingIconName}
                  className="size-5"
                />
              </span>
              <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
