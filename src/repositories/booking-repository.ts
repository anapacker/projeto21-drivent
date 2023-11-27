import { prisma } from "@/config";
import { Booking } from "@prisma/client";
import { type } from "os";

type Update = Omit<Booking, 'createdAt' | 'updatedAt'>

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

async function createBooking(roomId:number, userId:number) {
  const result = prisma.booking.create({
    data:{
      userId,
      roomId
    }
  })
  return result
}

async function findBookingsByRoomId(roomId:number) {
  return prisma.booking.findMany({
    where:{
      roomId:roomId
    }
  })
}

async function findRoomById(roomId:number) {
  const room = prisma.room.findFirst({
    where:{
      id:roomId
    }
  })
  return room
}

async function upsertBooking({id, roomId, userId}: Update){
  return prisma.booking.upsert({
    where:{
      id,
    },
    create:{
      roomId,
      userId,
    },
    update:{roomId}
  })
  
}
export const bookingRepository = {
  findBookingWithRoomByUserId,
  createBooking,
  findBookingsByRoomId,
  findRoomById,
  upsertBooking
}