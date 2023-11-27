import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers"
import supertest from "supertest"
import httpStatus from "http-status"
import faker from "@faker-js/faker"
import { createBooking, createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories"
import * as jwt from 'jsonwebtoken';
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory"
import { TicketStatus } from "@prisma/client"

beforeAll(async () => {
  await init()
})

beforeEach(async () => {
  await cleanDb()
})

const server = supertest(app)

describe('GET /booking', () =>{
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking')

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
  it('should respond with status 401 if given token is not valid', async () =>{
    const token = faker.lorem.word()

    const response = await server.get('/booking').set('Authorisation', `Bearer ${token}`)

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
})
describe('GET /booking | when token is valid', () => {
  it('should respond with status 200 if token is valid',async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK)
  })

  it('should respond with correct body', async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.body.id).toEqual(booking.id)
    expect(response.body.Room.id).toEqual(room.id)
    expect(response.body.Room.name).toEqual(room.name)
    expect(response.body.Room.capacity).toEqual(room.capacity)
    expect(response.body.Room.hotelId).toEqual(room.hotelId)
  })

  it("should respond with 404 when user doesn't have a booking", async () => {
    const user = await createUser()
    const token = await generateValidToken(user)
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })
})

describe("POST /booking", ()=>{
  it('should respond with status 401 if no tokent is given', async () =>{
    const response = await server.post('/booking').send({roomId: 1})

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
  it('shoulm respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: 1});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:1});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
})

describe("POST /booking | when token is valid", () =>{
  it('shoul respond with status 200 if token is valid', async () =>{
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:room.id});

    expect(response.status).toBe(httpStatus.OK); 
  })

  it('should respond with status 200 when roomId is a valid value', async () => {
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id})
    expect(response.status).toBe(httpStatus.OK)
  })

  it('should respond with correct body', async () => {
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false, true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: room.id})
    expect(response.status).toBe(httpStatus.OK)
  })
})
describe('PUT /booking', () =>{
  it('should respond with status 401 if no tokent is given', async () =>{
    const response = await server.post('/booking').send({roomId: 1})

    expect(response.status).toBe(httpStatus.UNAUTHORIZED)
  })
  it('shoulm respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId: 1});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({roomId:1});

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
})
describe('PUT /booking | when token is valid', () => {
  it('should respond with status 200 with a valid body', async () =>{
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const payment = await createPayment(ticket.id, ticketType.price)

    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)

    const elseRoom = await createRoomWithHotelId(hotel.id)
    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({roomId:elseRoom.id});

    expect(response.status).toEqual(httpStatus.OK);
  })
  it('should respond with status 400 with invalid bookingId', async () =>{
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const payment = await createPayment(ticket.id, ticketType.price)

    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)

    const elseRoom = await createRoomWithHotelId(hotel.id)
    const response = await server.put(`/booking/0`).set('Authorization', `Bearer ${token}`).send({roomId:elseRoom.id});

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  })
  it('should respond with status 400 with invalid body', async () =>{
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const payment = await createPayment(ticket.id, ticketType.price)

    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)

    const elseRoom = await createRoomWithHotelId(hotel.id)
    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({roomId:0});

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  })
  it("should respond with status 403 with a invalid body", async () => {
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const payment = await createPayment(ticket.id, ticketType.price)

    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)
    const elseRoom = await createRoomWithHotelId(hotel.id)
    const booking = await createBooking(user.id, room.id)
    await createBooking(user.id, elseRoom.id)
    await createBooking(user.id, elseRoom.id)
    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send({roomId:elseRoom.id});

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  })
  it('should respond with status 404 when user has not a booking', async () => {
    const user = await createUser()
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType(false,true)
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const token = await generateValidToken(user);
    const payment = await createPayment(ticket.id, ticketType.price)

    const hotel = await createHotel()
    const room = await createRoomWithHotelId(hotel.id)

    const elseUser = await createUser()
    const elseUserBooking = await createBooking(elseUser.id, room.id)
    const response = await server.put(`/booking/${elseUserBooking.id}`).set('Authorization', `Bearer ${token}`).send({roomId:room.id});

    expect(response.status).toEqual(httpStatus.FORBIDDEN)
  })
})

