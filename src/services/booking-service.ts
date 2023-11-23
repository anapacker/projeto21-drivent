import { notFoundError } from "@/errors"
import { bookingRepository } from "@/repositories"

async function findBookingByUser(userId:number) {
  const booking = await bookingRepository.findBookingWithRoomByUserId(userId)
  if(!booking) throw notFoundError()
  return booking
}

export const bookingService ={
  findBookingByUser
}