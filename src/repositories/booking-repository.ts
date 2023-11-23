import { prisma } from "@/config";

async function findBookingWithRoomByUserId(userId:number){
  return prisma.booking.findFirst({
    where:{
      userId
    },
    include:{
      Room: true
    }
  })
}

export const bookingRepository = {
  findBookingWithRoomByUserId
}