"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getString } from "@/lib/form-data";
import { createServiceRequestRecord } from "@/modules/service-requests/service";

export async function createServiceRequest(formData: FormData) {
  const user = await requireRole(["CLIENT", "ADMIN"]);
  await createServiceRequestRecord(
    {
      clientId: getString(formData, "clientId"),
      equipmentId: getString(formData, "equipmentId"),
      title: getString(formData, "title"),
      description: getString(formData, "description"),
      location: getString(formData, "location"),
      priority: getString(formData, "priority") ?? "NORMAL",
    },
    user,
  );

  revalidatePath("/client-portal/requests");
  revalidatePath("/service-requests");
  redirect("/client-portal/requests");
}
