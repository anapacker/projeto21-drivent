import { prisma } from "@/config";

async function findTicketTypes() {
  const result = await prisma.ticketType.findMany()
  return result
}

export const ticketsRepository = {
  findTicketTypes
}