import { ticketsRepository } from "@/repositories"

async function findTicketTypes() {
const ticketTypes = ticketsRepository.findTicketTypes()
return ticketTypes 

}

export const ticketsService = {
  findTicketTypes
}