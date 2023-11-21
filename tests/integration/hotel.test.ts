import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers"
import supertest from "supertest"
import httpStatus from "http-status"
import faker from "@faker-js/faker"
import { createEnrollmentWithAddress, createHotel, createPayment, createTicket, createTicketType, createUser } from "../factories"
import { TicketStatus } from "@prisma/client"
import { createRoom } from "../factories/room-factory"

beforeAll(async () => {
  await init()
})
beforeEach(async () => {
  await cleanDb()
})

const server = supertest(app)

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels')

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word()

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
})

describe('when token is valid', () => {
  it('should respond with status 404 when user has no enrollment', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })

  it("should respond with status 404 when user has enrollment but no ticket", async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    await createEnrollmentWithAddress(user)

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })

  it('should respond with status 404 when there are no hotels', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')
    await createPayment(ticket.id, ticketType.price)

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })
  it('should respond with status 402 when ticket is not paid', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,'RESERVED')

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 402 when ticket is remote', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(true, false)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 402 when ticket doenst include hotel', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, false)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 200 and a list of hotels', async ()=> {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')

    const hotel = await createHotel()

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.OK)
    expect(response.body).toEqual([
    {
      id: hotel.id,
      name:hotel.name,
      image:hotel.image,
      createdAt:hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString()
    }])
  })
})

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1')

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word()

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
})
describe('when token is valid', () => {
  it('should respond with status 404 when user has no enrollment', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)

    await createTicketType(true)
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })
  it("should respond with status 404 when user has enrollment but no ticket", async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    await createEnrollmentWithAddress(user)

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })

  it('should respond with status 404 for invalid hotel id', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,TicketStatus.PAID)
    await createPayment(ticket.id, ticketType.price)
    await createHotel()

    const response = await server.get('/hotels/999999').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })

  it('should respond with status 402 when ticket is not paid', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,'RESERVED')

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 402 when ticket is remote', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(true, false)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')
    await createPayment(ticket.id, ticketType.price)

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 402 when ticket doenst include hotel', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, false)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
  })
  it('should respond with status 200 and a list of hotels', async ()=> {
    const user = await createUser()
    const token = await generateValidToken(user)
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id,'PAID')

    const hotel = await createHotel()
    const room = await createRoom(hotel.id)

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.OK)
    expect(response.body).toEqual([
    {
      id: hotel.id,
      name:hotel.name,
      image:hotel.image,
      createdAt:hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms:[
        {
          id:room.id,
          name:room.name,
          capacity:room.capacity,
          hotelId:room.hotelId,
          createdAt:room.createdAt.toISOString(),
          updatedAt:room.updatedAt.toISOString(),
        }
      ]
    }])
  })
})

