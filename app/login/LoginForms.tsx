"use client";

import { useActionState } from "react";
import type { Role } from "@prisma/client";
import { createFirstAdmin, login, type AuthFormState } from "./actions";

const initialState: AuthFormState = {};

export function LoginForm({ role }: { role: Role }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="role" value={role} />

      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
          placeholder="admin@kaizen.local"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
          placeholder="••••••••"
        />
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Signing in..." : `Sign In as ${role}`}
      </button>
    </form>
  );
}

export function FirstAdminForm() {
  const [state, action, pending] = useActionState(createFirstAdmin, initialState);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Admin Name
        <input
          name="name"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
          placeholder="Kaizen Admin"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Admin Email
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
          placeholder="admin@kaizen.local"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
          placeholder="Minimum 8 characters"
        />
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Creating admin..." : "Create First Admin"}
      </button>
    </form>
  );
}
