import { badRequestError, forbiddenError, notFoundError } from "@/errors"
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories"

async function validEnrollmentTicket(userId:number) {
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!enrollment)throw forbiddenError()

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
  if(!ticket) throw forbiddenError()

  const tickerType = await ticketsRepository.findTicketById(ticket.id)
  if(!tickerType.TicketType.includesHotel) throw forbiddenError()

  if(tickerType.TicketType.isRemote) throw forbiddenError()
  if(ticket.status != 'PAID') throw forbiddenError()
}

async function validRoomBooking(roomId:number) {
  const existsRoom = await bookingRepository.findRoomById(roomId)
  if(!existsRoom) throw notFoundError()

  const bookings = await bookingRepository.findBookingsByRoomId(roomId)
  if(bookings.length >= existsRoom.capacity) throw forbiddenError()

}
async function findBookingByUser(userId:number) {
  const booking = await bookingRepository.findBookingWithRoomByUserId(userId)
  if(!booking) throw notFoundError()
  return booking
}

async function createBooking(roomId:number, userId:number) {
  if(!roomId) throw badRequestError()

  await validEnrollmentTicket(userId)
  await validRoomBooking(roomId)

  return bookingRepository.createBooking(roomId,userId)
}

async function updateBooking(userId:number, roomId:number) {
  if(!roomId) throw badRequestError()

  await validRoomBooking(roomId)
  const booking = await bookingRepository.findBookingWithRoomByUserId(userId)
  if(!booking || booking.userId !== userId) throw forbiddenError()

  return bookingRepository.upsertBooking({id: booking.id, roomId, userId})
}

export const bookingService ={
  findBookingByUser,
  createBooking,
  updateBooking
}