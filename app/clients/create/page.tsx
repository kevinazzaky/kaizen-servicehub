import Link from "next/link";
import { createClient } from "../actions";

export default function CreateClientPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/clients" className="text-sm text-cyan-400">
          ← Back to Clients
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Add New Client</h1>
          <p className="mt-2 text-slate-400">
            Masukkan data client yang akan dikelola dalam sistem maintenance.
          </p>

          <form action={createClient} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Client Name
              </label>
              <input
                name="name"
                required
                placeholder="Contoh: The Meru Sanur Bali"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Address
              </label>
              <textarea
                name="address"
                rows={3}
                placeholder="Alamat client"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  PIC Name
                </label>
                <input
                  name="picName"
                  placeholder="Nama penanggung jawab"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone
                </label>
                <input
                  name="phone"
                  placeholder="Nomor telepon"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="email@client.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/clients"
                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Save Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
