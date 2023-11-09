import { notFoundError } from "@/errors"
import { enrollmentRepository, ticketsRepository } from "@/repositories"

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

export const ticketsService = {
  findTicketTypes,
  findAllTicketsById
}