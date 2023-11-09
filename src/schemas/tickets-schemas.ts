import { TicketsInfos } from "@/protocols";
import Joi from "joi";

const ticketSchema = Joi.object<TicketsInfos>({
  ticketTypeId: Joi.number().required()
})