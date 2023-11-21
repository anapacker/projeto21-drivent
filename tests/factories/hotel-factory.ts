import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel } from "@prisma/client";

export function createHotel(params: Partial<Hotel> = {}){
  return prisma.hotel.create({
    data:{
      name: params.name || faker.company.companyName.name,
      image: params.image || faker.image.business.toString(),

    }
  })
}

