"use client";

import { useActionState } from "react";
import type { Role } from "@prisma/client";
import { createFirstAdmin, login, type AuthFormState } from "./actions";

const initialState: AuthFormState = {};

const loginCopy: Record<
  Role,
  {
    emailLabel: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    button: string;
  }
> = {
  ADMIN: {
    emailLabel: "Admin Email",
    emailPlaceholder: "admin@kaizen.local",
    passwordPlaceholder: "Password admin",
    button: "Masuk sebagai Admin",
  },
  TECHNICIAN: {
    emailLabel: "Teknisi Email",
    emailPlaceholder: "teknisi@kaizen.local",
    passwordPlaceholder: "Password teknisi",
    button: "Masuk sebagai Teknisi",
  },
  CLIENT: {
    emailLabel: "Client Email",
    emailPlaceholder: "client@company.com",
    passwordPlaceholder: "Password client",
    button: "Masuk sebagai Client",
  },
};

export function LoginForm({ role }: { role: Role }) {
  const [state, action, pending] = useActionState(login, initialState);
  const copy = loginCopy[role];

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="role" value={role} />

      <label className="grid gap-2 text-sm font-semibold text-slate-800">
        {copy.emailLabel}
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 font-normal text-slate-950 outline-none transition focus:border-[#f5b43b] focus:ring-4 focus:ring-amber-100"
          placeholder={copy.emailPlaceholder}
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-800">
        Password
        <input
          name="password"
          type="password"
          required
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 font-normal text-slate-950 outline-none transition focus:border-[#f5b43b] focus:ring-4 focus:ring-amber-100"
          placeholder={copy.passwordPlaceholder}
        />
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#f5b43b] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#ffc65a] disabled:opacity-60"
      >
        {pending ? "Memproses..." : copy.button}
      </button>
    </form>
  );
}

export function FirstAdminForm() {
  const [state, action, pending] = useActionState(createFirstAdmin, initialState);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-slate-800">
        Admin Name
        <input
          name="name"
          required
          className="rounded-md border border-slate-200 px-3 py-2.5 font-normal outline-none transition focus:border-[#f5b43b] focus:ring-4 focus:ring-amber-100"
          placeholder="Kaizen Admin"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-800">
        Admin Email
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-slate-200 px-3 py-2.5 font-normal outline-none transition focus:border-[#f5b43b] focus:ring-4 focus:ring-amber-100"
          placeholder="admin@kaizen.local"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-800">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-slate-200 px-3 py-2.5 font-normal outline-none transition focus:border-[#f5b43b] focus:ring-4 focus:ring-amber-100"
          placeholder="Minimum 8 characters"
        />
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[#f5b43b] px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-[#ffc65a] disabled:opacity-60"
      >
        {pending ? "Creating admin..." : "Create First Admin"}
      </button>
    </form>
  );
}
