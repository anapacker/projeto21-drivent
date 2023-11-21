import { prisma } from "@/config";

async function findHotels(){
  const result = await prisma.hotel.findMany()
  return result
}

async function findRoomsByHotelId(hotelId:number) {
  const result = await prisma.hotel.findFirst({
    where:{
      id: hotelId,
    },
    include:{
      Rooms: true,
    }
  })
  return result
}


export const hotelsRepository = {
  findHotels,
  findRoomsByHotelId
}