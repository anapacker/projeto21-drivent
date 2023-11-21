import { getAllHotels, getHotelsWithRooms } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router()
  .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get("/:hotelId", getHotelsWithRooms)

export {hotelsRouter}