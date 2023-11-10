import { TicketsInfos } from "@/protocols";
import Joi from "joi";

export const ticketSchema = Joi.object<TicketsInfos>({
  ticketTypeId: Joi.number().required()
})