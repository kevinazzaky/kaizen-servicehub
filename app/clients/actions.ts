"use server";

import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import {
  createClientRecord,
  deleteClientRecord,
  updateClientRecord,
} from "@/modules/clients/service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  await requireRole(["ADMIN"]);

  await createClientRecord({
    name: getString(formData, "name"),
    address: getString(formData, "address"),
    picName: getString(formData, "picName"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(clientId: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  await updateClientRecord(clientId, {
    name: getString(formData, "name"),
    address: getString(formData, "address"),
    picName: getString(formData, "picName"),
    phone: getString(formData, "phone"),
    email: getString(formData, "email"),
    status: getString(formData, "status") ?? "ACTIVE",
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  redirect("/clients");
}

export async function deleteClient(clientId: string) {
  await requireRole(["ADMIN"]);

  await deleteClientRecord(clientId);

  revalidatePath("/clients");
  redirect("/clients");
}
