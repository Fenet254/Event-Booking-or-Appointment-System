export interface Event {
  id: number
  title: string
  description?: string
  location?: string
  startAt: string
  endAt: string
  capacity: number
  createdAt: string
  categoryId?: number
  organizerId?: number
  imageUrl?: string
  price: number
  isVirtual: boolean
  bookings: Booking[]
}

export interface Booking {
  id: number
  eventId: number
  userId?: number
  name: string
  email: string
  seats: number
  createdAt: string
  status: string
  paymentStatus: string
  paymentId?: string
}

export interface EventForm {
  title: string
  description: string
  location: string
  startAt: string
  endAt: string
  capacity: number
}

export interface BookingForm {
  name: string
  email: string
  seats: number
}
