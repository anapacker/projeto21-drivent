import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers"
import supertest from "supertest"
import httpStatus from "http-status"
import faker from "@faker-js/faker"
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories"

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
  it('shoul respond with status 404 when user has no enrollment', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })

  it("should respond with status 404 when user has no enrollment but no ticket", async () => {
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

    const response = await server .get ('/hotels').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })
})