import type { MarketingCopy } from "@/lib/marketing-data";
import { MarketingIcon, type MarketingIconName } from "./MarketingIcon";

export function PortalBenefitsSection({ copy }: { copy: MarketingCopy }) {
  const section = copy.benefitsSection;

  return (
    <section id="portal" className="bg-[#f8fafc] px-4 py-14 text-slate-950 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-stretch">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b47a12] sm:tracking-[0.2em]">
            {section.eyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {section.description}
          </p>
          <div className="mt-6 h-1.5 w-20 rounded-full bg-[#f5b43b]" />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {section.items.map((item) => (
            <div
              key={item.title}
              className="group flex gap-4 rounded-2xl border border-slate-200 border-l-[#f5b43b] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#f5b43b]/70 hover:bg-[#fffaf0] hover:shadow-md sm:rounded-3xl"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-slate-950 text-[#f5b43b] transition group-hover:bg-[#f5b43b] group-hover:text-slate-950">
                <MarketingIcon
                  name={item.icon as MarketingIconName}
                  className="size-4"
                />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-950">{item.title}</h3>
                <p className="mt-1.5 text-sm font-medium leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
