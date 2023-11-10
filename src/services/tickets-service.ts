import { invalidDataError, notFoundError } from "@/errors"
import { CreateTickets } from "@/protocols"
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import { TicketStatus } from "@prisma/client"

async function findTicketTypes() {
const ticketTypes = ticketsRepository.findTicketTypes()
return ticketTypes 

}
async function findAllTicketsById(userId:number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!enrollment) throw notFoundError()

  const tickets = await ticketsRepository.findAllTicketsByEnrollmentId(enrollment.id)
  if(!tickets) throw notFoundError()

  return tickets
}

async function createTickets(userId: number, ticketTypeId:number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!enrollment) throw notFoundError()
  
  if(!ticketTypeId) throw invalidDataError('')

  const ticketObj: CreateTickets = {
    enrollmentId: enrollment.id,
    ticketTypeId,
    status: TicketStatus.RESERVED
  }

  const create =  await ticketsRepository.insert(ticketObj)
  return create
}

export const ticketsService = {
  findTicketTypes,
  findAllTicketsById,
  createTickets
}