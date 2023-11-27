import { bookingRepository } from "@/repositories"
import { bookingService } from "@/services"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("get bookings tests", () => {
  it("should return bookings", async () => {
    const bookingObj = {
      userId: 2,
      roomId: 4,
      createdAt:Date.now(),
      Room:{
        id: 4,
        name: "30A",
        capacity: 3,
        hotelId: 2,
        createdAt:Date.now()
      }
    }
    jest.spyOn(bookingRepository, "findBookingWithRoomByUserId").mockImplementationOnce((): any => {
      return {
        id:1,
        userId: bookingObj.userId,
        roomId: bookingObj.roomId,
        createdAt: bookingObj.createdAt,
        updatedAt: null,
        Room: {
          id: bookingObj.Room.id,
          name:bookingObj.Room.name,
          capacity: bookingObj.Room.capacity,
          hotelId: bookingObj.Room.hotelId,
          createdAt:bookingObj.Room.createdAt,
          updatedAt:null
        }
      }
    })
    const booking = await bookingService.findBookingByUser(bookingObj.userId)
    expect(booking.userId).toBe(bookingObj.userId)
    expect(booking.roomId).toBe(bookingObj.roomId)
    expect(booking.createdAt).toBe(bookingObj.createdAt)
    expect(booking.updatedAt).toBe(null)
    expect(booking.Room.id).toBe(bookingObj.Room.id)
    expect(booking.Room.name).toBe(bookingObj.Room.name)
    expect(booking.Room.capacity).toBe(bookingObj.Room.capacity)
    expect(booking.Room.hotelId).toBe(bookingObj.Room.hotelId)
    expect(booking.Room.createdAt).toBe(bookingObj.Room.createdAt)
    expect(booking.Room.updatedAt).toBe(null)
  })

  it('should throw not found error when booking not found', async () =>{
    jest.spyOn(bookingRepository, "findBookingWithRoomByUserId").mockImplementationOnce(():any => {
      return null
    })
    const promise = bookingService.findBookingByUser(1)
    expect(promise).rejects.toEqual({
      message:'No result for this search!',
      name:'NotFoundError'
    })
  })
})