import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createRoom(hotelId:number) {
  return prisma.room.create({
    data:{
      name: '2345',
      capacity:5,
      hotelId:hotelId,
    }
  })
}