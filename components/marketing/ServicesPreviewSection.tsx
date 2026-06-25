import { serviceHighlights } from "@/lib/marketing-data";
import { MarketingIcon, type MarketingIconName } from "./MarketingIcon";

export function ServicesPreviewSection() {
  return (
    <section id="services" className="bg-white px-6 py-16 text-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            Keunggulan Sistem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Dibuat untuk membuat kerja sama maintenance lebih rapi.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            ServiceHub bukan hanya halaman promosi. Sistem ini membantu tim
            service mencatat pekerjaan, membuktikan hasil maintenance, dan
            memberi client akses monitoring yang jelas.
          </p>
        </div>

        <div className="grid gap-4">
          {serviceHighlights.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-[#f5b43b]/50 hover:bg-white hover:shadow-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-[#f5b43b]">
                <MarketingIcon
                  name={item.icon as MarketingIconName}
                  className="size-5"
                />
              </span>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
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
