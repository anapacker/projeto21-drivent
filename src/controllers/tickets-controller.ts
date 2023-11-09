import { AuthenticatedRequest } from "@/middlewares";
import { ticketsService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTypeTickets(_req:AuthenticatedRequest, res: Response) {
  const ticketTypes = await ticketsService.findTicketTypes()
  if(ticketTypes.length === 0){
    return res.status(httpStatus.OK).send([])
  }
  return res.status(httpStatus.OK).send(ticketTypes)
}

