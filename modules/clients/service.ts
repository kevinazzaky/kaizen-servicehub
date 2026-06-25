import { prisma } from "@/lib/prisma";

export type ClientInput = {
  name: string | null;
  address: string | null;
  picName: string | null;
  phone: string | null;
  email: string | null;
  status?: string;
};

function validateClientInput(input: ClientInput) {
  if (!input.name) {
    throw new Error("Nama client wajib diisi.");
  }

  return {
    name: input.name,
    address: input.address,
    picName: input.picName,
    phone: input.phone,
    email: input.email,
    status: input.status ?? "ACTIVE",
  };
}

export async function createClientRecord(input: ClientInput) {
  return prisma.client.create({
    data: validateClientInput(input),
  });
}

export async function updateClientRecord(clientId: string, input: ClientInput) {
  return prisma.client.update({
    where: {
      id: clientId,
    },
    data: validateClientInput(input),
  });
}

export async function deleteClientRecord(clientId: string) {
  return prisma.client.delete({
    where: {
      id: clientId,
    },
  });
}
