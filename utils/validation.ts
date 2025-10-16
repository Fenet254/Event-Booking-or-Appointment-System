import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  endAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  capacity: z.number().min(0).optional(),
  categoryId: z.number().optional(),
  price: z.number().min(0).optional(),
  isVirtual: z.boolean().optional(),
})

export const bookingSchema = z.object({
  eventId: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  seats: z.number().min(1).max(10),
})

export const reviewSchema = z.object({
  eventId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
