import { invalidDataError, notFoundError, invalidPayment} from "@/errors"
import { hotelsRepository } from "@/repositories"
import { enrollmentRepository, ticketsRepository } from "@/repositories";
import { TicketStatus, TicketType } from "@prisma/client";

export async function validadePaidEnrollment(userId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!enrollment) throw notFoundError()

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
  if(!ticket) throw notFoundError()

  const type = ticket.TicketType
  if(!type.includesHotel) throw invalidPayment("não inclui hotel.")
  if(type.isRemote) throw invalidPayment("é remoto")
  if(ticket.status != TicketStatus.PAID) throw invalidPayment("não há pagamento")
  
}

async function getHotels(userId:number) {
  await validadePaidEnrollment(userId)
  const hotels = await hotelsRepository.findHotels()
  if(hotels.length === 0) throw notFoundError()

  return hotels
}
async function getHotelsWithRooms(userId: number, hotelId:number){
  await validadePaidEnrollment(userId)
  if(!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId')

  const roomsHotel = await hotelsRepository.findRoomsByHotelId(hotelId)
  if(!roomsHotel) throw notFoundError()

  return roomsHotel
}

export const hotelsService = {
  getHotels,
  getHotelsWithRooms
}