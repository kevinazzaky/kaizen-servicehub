import { workflowSteps } from "@/lib/marketing-data";
import { MarketingIcon, type MarketingIconName } from "./MarketingIcon";

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="bg-[radial-gradient(circle_at_82%_12%,rgba(245,180,59,0.12),transparent_28%),linear-gradient(135deg,#0b0f17_0%,#111827_58%,#202a3a_100%)] px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b43b]">
            Alur Kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Dari problem client sampai laporan selesai.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-md"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#f5b43b] text-slate-950">
                <MarketingIcon
                  name={item.icon as MarketingIconName}
                  className="size-5"
                />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#f5b43b]">
                Step {index + 1}
              </p>
              <h3 className="mt-2 font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
