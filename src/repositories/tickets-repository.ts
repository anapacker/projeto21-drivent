import { prisma } from "@/config";
import { CreateTickets } from "@/protocols";

async function findTicketTypes() {
  const result = await prisma.ticketType.findMany()
  return result
}

async function findAllTicketsByEnrollmentId(enrollmentId:number) {
  const ticketsEnrollment = await prisma.ticket.findUnique({
    where:{
      enrollmentId,
    },
    include:{
      TicketType: true
    }
  })
  return ticketsEnrollment
}

async function insert(ticket:CreateTickets) {
  const result = await prisma.ticket.create({
    data:ticket,
    include:{
      TicketType:true
    }
  })
  return result
}

// async function findAllTicketsById(ticketId:number) {
//   const ticket = await prisma.ticket.findUnique({
//     where:{id: ticketId},
//     include:{TicketType:true}
//   })
//   return ticket
// }

export const ticketsRepository = {
  findTicketTypes,
  findAllTicketsByEnrollmentId,
  insert
}