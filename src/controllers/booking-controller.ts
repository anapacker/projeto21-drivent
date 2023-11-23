import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req:AuthenticatedRequest, res: Response) {
  const {userId} = req

  const booking = await bookingService.findBookingByUser(userId)

  const body = {
    id: booking.id,
    Room: booking.Room
  }
  return res.status(httpStatus.OK).send(body)
}