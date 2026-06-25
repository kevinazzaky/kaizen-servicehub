import Link from "next/link";

const workflow = [
  {
    title: "Client kirim kebutuhan",
    description:
      "Client dapat menyampaikan kebutuhan maintenance atau problem yang terjadi di lokasi.",
  },
  {
    title: "Tim membuat work order",
    description:
      "Pekerjaan dicatat sebagai work order agar jadwal, equipment, dan statusnya terpantau.",
  },
  {
    title: "Teknisi melakukan maintenance",
    description:
      "Progress pekerjaan diperbarui dari pending, in progress, sampai selesai.",
  },
  {
    title: "Client memantau hasil",
    description:
      "Client bisa melihat status pekerjaan dan laporan maintenance dari jarak jauh.",
  },
];

const features = [
  "Monitoring progress maintenance",
  "Riwayat work order per equipment",
  "Laporan pekerjaan teknisi",
  "Portal client untuk kerja sama service",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Kaizen ServiceHub
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Maintenance lebih mudah dipantau oleh tim dan client.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Portal kerja sama maintenance untuk mencatat equipment, membuat
              work order, memantau progress, dan membagikan laporan pekerjaan
              kepada client secara terpusat.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login?role=CLIENT"
                className="rounded-md bg-zinc-950 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Masuk Portal
              </Link>
              <a
                href="#contact"
                className="rounded-md border border-zinc-300 bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-800"
              >
                Hubungi Tim
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-4 shadow-sm">
            <div className="rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div>
                  <p className="text-sm font-semibold">Client Monitoring</p>
                  <p className="text-xs text-zinc-500">
                    The Meru Sanur Bali
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  Active
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <DashboardRow
                  code="WO-2026-001"
                  equipment="Freezer Box AK-FZX/044"
                  status="Completed"
                />
                <DashboardRow
                  code="WO-2026-002"
                  equipment="Chiller Main Kitchen"
                  status="In Progress"
                />
                <DashboardRow
                  code="WO-2026-003"
                  equipment="Cold Storage Unit"
                  status="Pending"
                />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Metric label="Equipment" value="12" />
                <Metric label="Open WO" value="2" />
                <Metric label="Reports" value="18" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Cara kerja
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Satu alur untuk koordinasi maintenance.
          </h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Website ini menjadi portal operasional antara tim service dan
            client. Client tidak perlu menunggu update manual karena status dan
            laporan pekerjaan bisa dipantau dari portal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {workflow.map((item, index) => (
            <div
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <span className="grid size-8 place-items-center rounded-md bg-cyan-50 text-sm font-semibold text-cyan-700">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Dibuat untuk kerja sama service jangka panjang.
            </h2>
            <p className="mt-4 leading-7 text-zinc-600">
              Cocok untuk client yang memiliki banyak equipment dan membutuhkan
              pencatatan maintenance yang rapi, transparan, dan mudah dicek
              kembali.
            </p>
          </div>

          <div className="grid gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-lg bg-zinc-950 px-6 py-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Ingin mencoba portal monitoring maintenance?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
              Hubungi tim untuk diskusi kebutuhan maintenance, kerja sama, atau
              demo penggunaan portal client.
            </p>
          </div>

          <Link
            href="/login?role=CLIENT"
            className="mt-6 inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-zinc-950 md:mt-0"
          >
            Masuk ke Portal
          </Link>
        </div>
      </section>
    </main>
  );
}

function DashboardRow({
  code,
  equipment,
  status,
}: {
  code: string;
  equipment: string;
  status: string;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{code}</p>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
          {status}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{equipment}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
