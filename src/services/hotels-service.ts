import { invalidDataError, notFoundError, invalidPayment} from "@/errors"
import { hotelsRepository } from "@/repositories"
import { enrollmentRepository, ticketTypeRepository, ticketsRepository } from "@/repositories";

export async function validadePaidEnrollment(userId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!enrollment) throw notFoundError()

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
  if(!ticket) throw notFoundError()

  const ticketType = await ticketTypeRepository.findTiketTypeByTicketId(ticket.id)
  if(!ticketType.includesHotel) throw invalidPayment("não inclui hotel.")
  if(ticketType.isRemote) throw invalidPayment("é remoto")
  if(ticket.status != 'PAID') throw invalidPayment("não há pagamento")
  
}

async function getHotels(userId:number) {
  await validadePaidEnrollment(userId)
  const hotels = hotelsRepository.findHotels()
  if((await hotels).length === 0) throw notFoundError()

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