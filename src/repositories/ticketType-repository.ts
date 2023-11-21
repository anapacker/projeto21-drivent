import { prisma } from "@/config";

async function findTiketTypeByTicketId(ticketId:number) {
  const ticketType = prisma.ticketType.findFirst({
    where:{
      id:ticketId
    }
  })
  return ticketType
}

export const ticketTypeRepository = {
  findTiketTypeByTicketId
}
